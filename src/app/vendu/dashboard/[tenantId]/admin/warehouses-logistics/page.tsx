"use client";

import { useParams } from "next/navigation";
import { WarehousesLogisticsPageContent } from "@/components/admin/warehouses-logistics/pages";

export default function WarehousesLogisticsPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  return <WarehousesLogisticsPageContent />;
}
