export function logInfo(message: string, meta?: any) {
  console.log("[info]", message, meta ?? "");
}
export function logError(err: any) {
  console.error("[error]", err);
}
