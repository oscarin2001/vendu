"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Building2, User } from "lucide-react";
import { Branch } from "@/services/admin/branches";

interface BranchDeleteInitialModalProps {
  branch: Branch | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
}

export function BranchDeleteInitialModal({
  branch,
  isOpen,
  onClose,
  onNext,
}: BranchDeleteInitialModalProps) {
  if (!branch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Sucursal
          </DialogTitle>
          <DialogDescription>
            <span className="block mb-3">
              ¿Estás seguro de que quieres eliminar la sucursal{" "}
              <span className="font-semibold text-foreground">
                {branch.name}
              </span>
              ?
            </span>
            <span className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">
                <span className="block font-medium">{branch.name}</span>
                <span className="block text-muted-foreground">
                  {branch.city}, {branch.address}
                </span>
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onNext}>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
