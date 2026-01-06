"use client";

import { useParams } from "next/navigation";
import { WarehousesPageContent } from "@/components/admin/warehouses/pages";

export default function WarehousesPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  return <WarehousesPageContent tenantId={tenantId} />;
}
