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
import { Lock, Type } from "lucide-react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";
import { useState } from "react";

interface WarehouseEditFinalModalProps {
  warehouse: WarehouseType | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onConfirm: (password: string) => void;
  isLoading: boolean;
  error?: string;
}

export function WarehouseEditFinalModal({
  warehouse,
  isOpen,
  onClose,
  onPrevious,
  onConfirm,
  isLoading,
  error,
}: WarehouseEditFinalModalProps) {
  const [password, setPassword] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
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

    if (!warehouseName.trim()) {
      setNameError("Debes escribir el nombre de la bodega");
      hasError = true;
    } else if (warehouseName !== warehouse?.name) {
      setNameError("El nombre no coincide con la bodega");
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
    setWarehouseName("");
    setPasswordError("");
    setNameError("");
    onClose();
  };

  if (!warehouse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Confirmación de Edición
          </DialogTitle>
          <div className="text-muted-foreground text-sm space-y-4">
            <div className="font-medium">
              Para confirmar los cambios en la bodega, escribe el nombre exacto
              y tu contraseña de confirmación:
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="warehouseName" className="flex items-center gap-2">
              <Type className="h-4 w-4" /> Escribe el nombre de la bodega
            </Label>
            <Input
              id="warehouseName"
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
              placeholder={`Escribe "${warehouse.name}"`}
              className={nameError ? "border-red-500" : ""}
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Contraseña de administrador
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
            disabled={isLoading || !password.trim() || !warehouseName.trim()}
          >
            {isLoading ? "Confirmando..." : "Confirmar edición"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
