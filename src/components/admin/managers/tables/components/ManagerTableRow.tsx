"use client";

import { TableRow } from "@/components/ui/table";
import { Manager } from "@/services/admin/managers";
import {
  ManagerInfoCell,
  ContactCell,
  BranchesCell,
  ContributionCell,
  StatusCell,
  ActionsCell,
} from "./";

interface ManagerTableRowProps {
  manager: Manager;
  onViewDetails: (manager: Manager) => void;
  onEdit: (manager: Manager) => void;
  onDelete: (manager: Manager) => void;
  onToggleStatus: (manager: Manager) => void;
  onConfigureService: (manager: Manager) => void;
}

export function ManagerTableRow({
  manager,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  onConfigureService,
}: ManagerTableRowProps) {
  return (
    <TableRow>
      <ManagerInfoCell manager={manager} />
      <ContactCell manager={manager} />
      <BranchesCell manager={manager} />
      <ContributionCell manager={manager} />
      <StatusCell manager={manager} />
      <ActionsCell
        manager={manager}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
        onConfigureService={onConfigureService}
      />
    </TableRow>
  );
}
