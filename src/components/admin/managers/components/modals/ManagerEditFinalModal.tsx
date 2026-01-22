"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { Manager } from "@/services/admin/managers";
import { useState } from "react";

interface ManagerEditFinalModalProps {
  manager: Manager | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onConfirm: (password: string) => void;
  isLoading: boolean;
  error?: string;
}

export function ManagerEditFinalModal({
  manager,
  isOpen,
  onClose,
  onPrevious,
  onConfirm,
  isLoading,
  error,
}: ManagerEditFinalModalProps) {
  const [password, setPassword] = useState("");
  const [managerNameInput, setManagerNameInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  const managerName = manager ? `${manager.firstName} ${manager.lastName}` : "";

  const handleConfirm = () => {
    let hasError = false;

    if (managerNameInput !== managerName) {
      setNameError("El nombre del encargado no coincide");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!password.trim()) {
      setPasswordError("La contraseña es requerida");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!hasError) {
      onConfirm(password);
    }
  };

  const handleClose = () => {
    setPassword("");
    setManagerNameInput("");
    setPasswordError("");
    setNameError("");
    onClose();
  };

  if (!manager) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Confirmación de Edición
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="managerName">Confirma el nombre del encargado</Label>
            <Input
              id="managerName"
              value={managerNameInput}
              onChange={(e) => setManagerNameInput(e.target.value)}
              placeholder={`Escribe: ${managerName}`}
              className={nameError ? "border-red-500" : ""}
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              <Lock className="h-4 w-4 inline mr-1" />
              Contraseña de administrador
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className={passwordError ? "border-red-500" : ""}
            />
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onPrevious} disabled={isLoading}>
            Atrás
          </Button>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !password.trim() || !managerNameInput.trim()}
          >
            {isLoading ? "Confirmando..." : "Confirmar edición"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
