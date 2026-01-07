"use client";

import { useParams } from "next/navigation";
import { CustomersPageContent } from "@/components/admin/customers/pages";

export default function CustomersPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  return <CustomersPageContent />;
}