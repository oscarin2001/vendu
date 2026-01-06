"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Building2 } from "lucide-react";
import { CompanyData, SubscriptionData } from "@/services/admin/company";
import {
  CompanyDetailsHeader,
  CompanyBasicInfoCard,
  CompanyAuditCard,
  CompanySubscriptionCard,
} from "./components";

interface CompanyDetailsModalProps {
  company: CompanyData | null;
  subscription: SubscriptionData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDetailsModal({
  company,
  subscription,
  isOpen,
  onClose,
}: CompanyDetailsModalProps) {
  if (!company) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <CompanyDetailsHeader />

        <div className="space-y-6">
          <CompanyBasicInfoCard company={company} />

          <CompanyAuditCard company={company} />

          {subscription && <CompanySubscriptionCard subscription={subscription} />}

          <Separator />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">ID de Empresa</p>
            <p className="text-2xl font-mono font-bold">#{company.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
