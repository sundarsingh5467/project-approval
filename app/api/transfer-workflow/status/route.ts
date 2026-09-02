import { NextResponse } from "next/server";

import {
  checkApprovedWallet,
  getTransferWorkflowStatus,
} from "@/lib/transferWorkflow";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getTransferWorkflowStatus());
}

export async function POST() {
  const result = await checkApprovedWallet();
  return NextResponse.json(result, {
    status: result.state === "error" ? 500 : 200,
  });
}