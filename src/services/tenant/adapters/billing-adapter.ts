// Adapter para integración con PSPs desde tenant (por ejemplo: crear customer en Stripe)

export async function createBillingCustomer(_payload: any) {
  throw new Error("billing-adapter not implemented");
}
