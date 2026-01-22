"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Branch } from "@/services/admin/branches";
import { useBranchDeleteFinal } from "../delete/hooks/useBranchDeleteFinal";
import {
  BranchNameConfirmation,
  PasswordConfirmation,
} from "../delete/components";

interface BranchEditFinalModalProps {
  branch: Branch | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onConfirm: (password: string) => void;
  isLoading: boolean;
  error?: string;
}

export function BranchEditFinalModal({
  branch,
  isOpen,
  onClose,
  onPrevious,
  onConfirm,
  isLoading,
  error,
}: BranchEditFinalModalProps) {
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
          <DialogTitle className="flex items-center gap-2">
            Confirmación de Edición
          </DialogTitle>
          <div className="text-muted-foreground text-sm space-y-4">
            <div className="font-medium">
              Para confirmar los cambios en la sucursal, escribe el nombre
              exacto y tu contraseña de confirmación:
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
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
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
            onClick={validateAndConfirm}
            disabled={isLoading || !password.trim() || !branchNameInput.trim()}
          >
            {isLoading ? "Confirmando..." : "Confirmar edición"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
