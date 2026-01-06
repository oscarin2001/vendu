"use client";

import { Table, TableBody } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Manager } from "@/services/admin/managers";
import {
  ManagersTableSkeleton,
  ManagerTableRow,
  EmptyState,
  ManagersTableHeader,
} from "./components";

interface ManagersTableProps {
  managers: Manager[];
  isLoading: boolean;
  onViewDetails: (manager: Manager) => void;
  onEdit: (manager: Manager) => void;
  onDelete: (manager: Manager) => void;
  onToggleStatus: (manager: Manager) => void;
  onConfigureService: (manager: Manager) => void;
}

export function ManagersTable({
  managers,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  onConfigureService,
}: ManagersTableProps) {
  if (isLoading) {
    return <ManagersTableSkeleton />;
  }

  if (managers.length === 0) {
    return <EmptyState />;
  }

  return (
    <TooltipProvider>
      <div className="border rounded-lg">
        <Table>
          <ManagersTableHeader />
          <TableBody>
            {managers.map((manager) => (
              <ManagerTableRow
                key={manager.id}
                manager={manager}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                onConfigureService={onConfigureService}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
