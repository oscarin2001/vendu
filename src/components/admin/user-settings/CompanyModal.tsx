"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompanyTab } from "./components/CompanyTab";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export function CompanyModal({ isOpen, onClose, userId }: CompanyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Empresa</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
          <CompanyTab userId={userId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
