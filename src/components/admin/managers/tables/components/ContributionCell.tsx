"use client";

import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Manager } from "@/services/admin/managers";

interface ContributionCellProps {
  manager: Manager;
}

export function ContributionCell({ manager }: ContributionCellProps) {
  const formatSalary = (contributionType: string, salary?: number) => {
    if (contributionType === "none") {
      return "Sin compensación";
    }
    if (!salary || salary === 0) {
      return "No especificado";
    }
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
    }).format(salary);
  };

  const getFinancialContribution = (
    contributionType: string,
    salary?: number
  ) => {
    if (contributionType === "none") {
      return {
        text: "No recibe compensación",
        variant: "outline" as const,
        icon: null,
        color: "text-gray-600",
      };
    }
    if (contributionType === "contributes") {
      return {
        text: "Aporta a empresa",
        variant: "default" as const,
        icon: TrendingUp,
        color: "text-white",
      };
    }
    return {
      text: "Empresa aporta",
      variant: "secondary" as const,
      icon: TrendingDown,
      color: "text-gray-600",
    };
  };

  const contribution = getFinancialContribution(
    manager.contributionType,
    manager.salary
  );

  return (
    <TableCell>
      <div className="flex flex-col gap-1">
        <Badge variant={contribution.variant} className="text-xs w-fit">
          {contribution.icon && (
            <contribution.icon
              className={`w-3 h-3 mr-1 ${contribution.color}`}
            />
          )}
          {contribution.text}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {formatSalary(manager.contributionType, manager.salary)}
        </span>
      </div>
    </TableCell>
  );
}
