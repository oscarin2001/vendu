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
import { AlertTriangle } from "lucide-react";
import { Branch } from "@/services/admin/branches";
import { useBranchDeleteFinal } from "./hooks";
import {
  BranchNameConfirmation,
  PasswordConfirmation,
  DeleteWarning,
} from "./components";

interface BranchDeleteFinalModalProps {
  branch: Branch | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onConfirm: (password: string) => void;
  isLoading: boolean;
}

export function BranchDeleteFinalModal({
  branch,
  isOpen,
  onClose,
  onPrevious,
  onConfirm,
  isLoading,
}: BranchDeleteFinalModalProps) {
  const {
    password,
    setPassword,
    branchNameInput,
    setBranchNameInput,
    passwordError,
    nameError,
    validateAndConfirm,
    resetForm,
  } = useBranchDeleteFinal({
    branchName: branch?.name || "",
    onConfirm,
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!branch) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmación Final
          </DialogTitle>
          <div className="text-muted-foreground text-sm space-y-4">
            <div className="text-red-600 font-medium">
              Para confirmar la eliminación permanente de la sucursal, completa
              los siguientes campos:
            </div>

            <div className="space-y-4">
              <BranchNameConfirmation
                branchName={branch.name}
                value={branchNameInput}
                onChange={setBranchNameInput}
                error={nameError}
                onEnterPress={validateAndConfirm}
              />

              <PasswordConfirmation
                value={password}
                onChange={setPassword}
                error={passwordError}
                onEnterPress={validateAndConfirm}
              />
            </div>

            <DeleteWarning />
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onPrevious}>
            Atrás
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={validateAndConfirm}
            disabled={isLoading || !password.trim() || !branchNameInput.trim()}
          >
            {isLoading ? "Eliminando..." : "Eliminar Sucursal Permanentemente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
