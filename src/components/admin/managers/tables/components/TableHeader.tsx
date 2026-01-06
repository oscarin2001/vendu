"use client";

import {
  TableHead,
  TableHeader as TableHeaderUI,
  TableRow,
} from "@/components/ui/table";

export function ManagersTableHeader() {
  return (
    <TableHeaderUI>
      <TableRow>
        <TableHead>Encargado</TableHead>
        <TableHead>Contacto</TableHead>
        <TableHead>Sucursal</TableHead>
        <TableHead>Salario</TableHead>
        <TableHead>Estado Laboral</TableHead>
        <TableHead className="w-12"></TableHead>
      </TableRow>
    </TableHeaderUI>
  );
}
