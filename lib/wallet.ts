import { ethers } from "ethers";

export const BNB_CHAIN_ID = "0x38";
export const BSC_RPC_URL = process.env.BSC_RPC_URL ?? "https://bsc-dataseed.binance.org/";
export const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";

export type Web3WalletLike = {
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isMetaMask?: boolean;
  isTrust?: boolean;
  isTrustWallet?: boolean;
  isCoinbaseWallet?: boolean;
  selectedAddress?: string;
  chainId?: string;
  networkVersion?: string;
  accounts?: string[];
  provider?: Web3WalletLike;
  ethereum?: Web3WalletLike;
  web3?: Web3WalletLike;
  wallet?: Web3WalletLike;
  currentProvider?: Web3WalletLike;
  [key: string]: unknown;
};

export type WalletBalanceSnapshot = {
  address: string;
  chainId: string;
  network: string;
  walletDetected: boolean;
  balances: {
    BNB: string;
    USDT: string;
  };
};

export function detectWallet(input?: unknown): Web3WalletLike | null {
  const candidates: unknown[] = [];

  if (input && typeof input === "object") {
    candidates.push(input);
    const provider = input as Web3WalletLike;
    if (provider.provider) candidates.push(provider.provider);
    if (provider.ethereum) candidates.push(provider.ethereum);
    if (provider.web3) candidates.push(provider.web3);
    if (provider.wallet) candidates.push(provider.wallet);
    if (provider.currentProvider) candidates.push(provider.currentProvider);
  }

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const wallet = candidate as Web3WalletLike;
    const hasRequest = typeof wallet.request === "function";
    const hasWalletSignature = Boolean(
      wallet.isMetaMask ||
        wallet.isTrust ||
        wallet.isTrustWallet ||
        wallet.isCoinbaseWallet ||
        wallet.selectedAddress ||
        wallet.chainId ||
        wallet.networkVersion ||
        wallet.accounts,
    );

    if (hasRequest || hasWalletSignature) {
      return wallet;
    }
  }

  return null;
}

function getWalletName(wallet: Web3WalletLike): string {
  if (wallet.isMetaMask) return "MetaMask";
  if (wallet.isTrust || wallet.isTrustWallet) return "Trust Wallet";
  if (wallet.isCoinbaseWallet) return "Coinbase Wallet";
  return "Web3 wallet";
}

export async function switchToBNBChain(wallet?: Web3WalletLike): Promise<boolean> {
  const provider = detectWallet(wallet);

  if (!provider?.request) {
    return false;
  }

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BNB_CHAIN_ID }],
    });
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error ?? "");
    const shouldAddChain = /chain.*(not found|missing)|4902|wallet_addEthereumChain|switch.*chain/i.test(message);

    if (!shouldAddChain) {
      throw error;
    }

    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: BNB_CHAIN_ID,
          chainName: "BNB Smart Chain",
          nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
          },
          rpcUrls: [BSC_RPC_URL],
          blockExplorerUrls: ["https://bscscan.com"],
        },
      ],
    });

    return true;
  }
}

async function getTokenBalanceValue(provider: ethers.Provider, holderAddress: string): Promise<bigint> {
  const iface = new ethers.Interface([
    "function balanceOf(address) view returns (uint256)",
  ]);

  const raw = await provider.call({
    to: USDT_CONTRACT_ADDRESS,
    data: iface.encodeFunctionData("balanceOf", [holderAddress]),
  });

  return iface.decodeFunctionResult("balanceOf", raw)[0];
}

export async function readWalletBalanceSnapshot(
  address: string,
  wallet?: Web3WalletLike,
): Promise<WalletBalanceSnapshot> {
  const fallbackAddress =
    address ||
    wallet?.selectedAddress ||
    wallet?.accounts?.[0] ||
    "0x0000000000000000000000000000000000000000";

  if (!fallbackAddress || !/^0x[a-fA-F0-9]{40}$/.test(fallbackAddress)) {
    throw new Error("A valid wallet address is required.");
  }

  const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
  const [bnbBalance, usdtBalance] = await Promise.all([
    provider.getBalance(fallbackAddress),
    getTokenBalanceValue(provider, fallbackAddress),
  ]);

  return {
    address: fallbackAddress,
    chainId: BNB_CHAIN_ID,
    network: "BNB Smart Chain",
    walletDetected: Boolean(detectWallet(wallet)),
    balances: {
      BNB: ethers.formatEther(bnbBalance),
      USDT: ethers.formatUnits(usdtBalance, 18),
    },
  };
}

export async function checkWalletStatus(input?: unknown): Promise<WalletBalanceSnapshot> {
  const wallet = detectWallet(input);
  const selectedAddress =
    (input && typeof input === "object" && "selectedAddress" in (input as object)
      ? (input as Web3WalletLike).selectedAddress
      : undefined) ||
    wallet?.selectedAddress ||
    wallet?.accounts?.[0];

  if (wallet?.request) {
    await switchToBNBChain(wallet);
  }

  const address =
    selectedAddress ||
    (input && typeof input === "object" && "address" in (input as object)
      ? String((input as { address?: string }).address)
      : undefined);

  if (!address) {
    throw new Error("No connected wallet address was provided, but the provider was detected.");
  }

  return readWalletBalanceSnapshot(address, wallet || undefined);
}

export function describeWallet(input?: unknown): { detected: boolean; name: string | null } {
  const wallet = detectWallet(input);

  if (!wallet) {
    return { detected: false, name: null };
  }

  return { detected: true, name: getWalletName(wallet) };
}
