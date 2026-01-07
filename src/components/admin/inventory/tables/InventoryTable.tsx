"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { InventoryData } from "@/services/admin/inventory";

const VARIANTS = {
  excellent: "default",
  good: "secondary",
  acceptable: "outline",
  damaged: "destructive",
} as const;
const LABELS = {
  excellent: "Excelente",
  good: "Bueno",
  acceptable: "Aceptable",
  damaged: "Dañado",
};

export function InventoryTable({
  inventoryData,
  isLoading,
}: {
  inventoryData: InventoryData[];
  isLoading: boolean;
}) {
  if (isLoading) return <div className="h-32 bg-muted animate-pulse rounded" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventoryData.slice(0, 3).map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {item.productVariantId}
            </TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>
              <Badge
                variant={
                  VARIANTS[item.condition as keyof typeof VARIANTS] ||
                  "secondary"
                }
              >
                {LABELS[item.condition as keyof typeof LABELS] ||
                  item.condition}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
