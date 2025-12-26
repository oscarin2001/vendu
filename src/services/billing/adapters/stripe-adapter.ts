// Stripe adapter: encapsula llamadas a Stripe SDK

export async function verifyStripeEvent(_raw: Buffer, _sig: string) {
  throw new Error("stripe-adapter not implemented");
}
