import { NextRequest, NextResponse } from "next/server";

import {
  detectWallet,
  describeWallet,
  readWalletBalanceSnapshot,
  switchToBNBChain,
} from "@/lib/wallet";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address") ?? searchParams.get("walletAddress") ?? undefined;
    const providerParam = searchParams.get("provider");
    const wallet = providerParam ? JSON.parse(providerParam) : undefined;

    if (!address && !wallet) {
      return NextResponse.json(
        {
          success: false,
          error: "A wallet address or Web3 provider is required.",
        },
        { status: 400 },
      );
    }

    const detectedWallet = detectWallet(wallet);
    if (detectedWallet) {
      await switchToBNBChain(detectedWallet);
    }

    const snapshot = await readWalletBalanceSnapshot(
      address ?? detectedWallet?.selectedAddress ?? "",
      detectedWallet ?? undefined,
    );

    return NextResponse.json({
      success: true,
      wallet: describeWallet(detectedWallet ?? wallet ?? undefined),
      ...snapshot,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown wallet check error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const wallet = body.wallet ?? body.provider ?? body.ethereum ?? body.ethereumProvider ?? undefined;
    const address = body.address ?? body.walletAddress ?? body.account ?? wallet?.selectedAddress ?? undefined;

    const detectedWallet = detectWallet(wallet);
    if (detectedWallet) {
      await switchToBNBChain(detectedWallet);
    }

    if (!address && detectedWallet) {
      return NextResponse.json(
        {
          success: false,
          error: "The connected wallet could not be resolved to a valid address.",
        },
        { status: 400 },
      );
    }

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: "A wallet address or Web3 provider is required.",
        },
        { status: 400 },
      );
    }

    const snapshot = await readWalletBalanceSnapshot(address, detectedWallet ?? undefined);

    return NextResponse.json({
      success: true,
      wallet: describeWallet(detectedWallet ?? wallet ?? undefined),
      ...snapshot,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown wallet check error",
      },
      { status: 500 },
    );
  }
}
