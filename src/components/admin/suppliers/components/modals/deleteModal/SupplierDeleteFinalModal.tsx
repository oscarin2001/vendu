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
import { Supplier } from "@/services/admin/suppliers";

interface SupplierDeleteFinalModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onConfirm: (password: string) => void;
  isLoading: boolean;
}

export function SupplierDeleteFinalModal({
  supplier,
  isOpen,
  onClose,
  onPrevious,
  onConfirm,
  isLoading,
}: SupplierDeleteFinalModalProps) {
  const [password, setPassword] = useState("");
  const [supplierName, setSupplierName] = useState("");
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

    if (!supplierName.trim()) {
      setNameError("Debes escribir el nombre del proveedor");
      hasError = true;
    } else if (supplierName.trim() !== supplier?.fullName) {
      setNameError("El nombre no coincide con el proveedor seleccionado");
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
    setSupplierName("");
    setPasswordError("");
    setNameError("");
    onClose();
  };

  if (!supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmación Final
          </DialogTitle>
          <DialogDescription>
            Para eliminar permanentemente al proveedor{" "}
            <span className="font-semibold text-foreground">
              {supplier.fullName}
            </span>
            , confirma tu identidad:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supplierName" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Escribe el nombre completo del proveedor
            </Label>
            <Input
              id="supplierName"
              type="text"
              placeholder={`Escribe: ${supplier.fullName}`}
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className={nameError ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {nameError && (
              <p className="text-sm text-red-600 mt-1">{nameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Confirma con tu contraseña de administrador
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? "border-red-500" : ""}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleConfirm();
                }
              }}
            />
            {passwordError && (
              <p className="text-sm text-red-600 mt-1">{passwordError}</p>
            )}
          </div>

          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
            <div className="text-red-800 dark:text-red-200 font-medium text-sm">
              🚨 Esta acción es irreversible
            </div>
            <div className="text-red-700 dark:text-red-300 text-sm mt-1">
              Una vez eliminado, no podrás recuperar al proveedor ni su
              información.
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onPrevious} disabled={isLoading}>
            Atrás
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !password.trim() || !supplierName.trim()}
          >
            {isLoading ? "Eliminando..." : "Eliminar Permanentemente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}