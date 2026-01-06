"use server";

import { prisma } from "@/lib/prisma";

export async function getCompanySubscription(tenantId: string) {
  const subscription = await prisma.tbsubscriptions.findFirst({
    where: {
      company: {
        slug: tenantId,
      },
    },
  });

  if (!subscription) {
    return null;
  }

  return {
    planType: subscription.planType,
    status: subscription.status,
    nextBillingDate: subscription.nextBillingDate,
  };
}
