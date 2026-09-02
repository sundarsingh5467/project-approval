export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startTransferWorkflow } = await import("./lib/transferWorkflow");
    startTransferWorkflow();
  }
}
