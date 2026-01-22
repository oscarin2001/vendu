"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Supplier } from "@/services/admin/suppliers";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Lock, Type } from "lucide-react";

interface SupplierEditFinalModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onConfirm: (password: string) => void;
  isLoading: boolean;
  error?: string;
}

export function SupplierEditFinalModal({
  supplier,
  isOpen,
  onClose,
  onPrevious,
  onConfirm,
  isLoading,
  error,
}: SupplierEditFinalModalProps) {
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
          <DialogTitle className="flex items-center gap-2">
            Confirmación de Edición
          </DialogTitle>
          <div className="text-muted-foreground text-sm space-y-4">
            <div className="font-medium">
              Para confirmar los cambios en el proveedor, escribe el nombre
              exacto y tu contraseña de confirmación:
            </div>
          </div>
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
            {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}
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
              disabled={isLoading}
            />
            {passwordError && (<p className="text-sm text-red-600 mt-1">{passwordError}</p>)}
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onPrevious} disabled={isLoading}>
            Atrás
          </Button>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !password.trim() || !supplierName.trim()}
          >
            {isLoading ? "Confirmando..." : "Confirmar edición"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
