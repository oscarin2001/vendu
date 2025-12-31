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
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Lock, Type } from "lucide-react";
import { useState } from "react";
import { Manager } from "@/services/admin/managers/types/manager.types";

interface ManagerDeleteFinalModalProps {
  manager: Manager | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onConfirm: (password: string) => void;
  isLoading: boolean;
}

export function ManagerDeleteFinalModal({
  manager,
  isOpen,
  onClose,
  onPrevious,
  onConfirm,
  isLoading,
}: ManagerDeleteFinalModalProps) {
  const [password, setPassword] = useState("");
  const [managerName, setManagerName] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  const handleConfirm = () => {
    let hasError = false;

    if (!password.trim()) {
      setPasswordError("La contraseña es requerida");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!managerName.trim()) {
      setNameError("Debes escribir el nombre del encargado");
      hasError = true;
    } else if (managerName.trim() !== manager?.fullName) {
      setNameError("El nombre no coincide exactamente");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!hasError) {
      onConfirm(password);
    }
  };

  const handleClose = () => {
    setPassword("");
    setManagerName("");
    setPasswordError("");
    setNameError("");
    onClose();
  };

  if (!manager) return null;

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
              Para confirmar la eliminación permanente, completa los siguientes
              campos:
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="managerName"
                  className="flex items-center gap-2"
                >
                  <Type className="h-4 w-4" />
                  Escribe el nombre completo del encargado
                </Label>
                <Input
                  id="managerName"
                  placeholder={`Escribe: ${manager.fullName}`}
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className={nameError ? "border-red-500" : ""}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleConfirm();
                    }
                  }}
                />
                {nameError && (
                  <span className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {nameError}
                  </span>
                )}
                <span className="text-xs text-muted-foreground block">
                  Debes escribir exactamente:{" "}
                  <strong>{manager.fullName}</strong>
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Contraseña de confirmación
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={passwordError ? "border-red-500" : ""}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleConfirm();
                    }
                  }}
                />
                {passwordError && (
                  <span className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {passwordError}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-red-100 dark:bg-red-950/50 p-4 rounded-md border border-red-300 dark:border-red-700">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Última Confirmación
              </div>
              <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                Esta es tu última oportunidad para cancelar. La eliminación será
                permanente.
              </div>
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
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !password.trim() || !managerName.trim()}
          >
            {isLoading ? "Eliminando..." : "Eliminar Permanentemente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
