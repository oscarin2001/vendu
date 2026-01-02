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
import { AlertTriangle, Lock, Type, Warehouse } from "lucide-react";
import { useState } from "react";
import { Warehouse as WarehouseType } from "@/services/admin/warehouses/types/warehouse.types";

interface WarehouseDeleteFinalModalProps {
  warehouse: WarehouseType | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onConfirm: (password: string) => void;
  isLoading: boolean;
}

export function WarehouseDeleteFinalModal({
  warehouse,
  isOpen,
  onClose,
  onPrevious,
  onConfirm,
  isLoading,
}: WarehouseDeleteFinalModalProps) {
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
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmación Final
          </DialogTitle>
          <DialogDescription>
            Para eliminar permanentemente la bodega{" "}
            <span className="font-semibold text-foreground">
              {warehouse.name}
            </span>
            , confirma tu identidad y escribe el nombre exacto de la bodega.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-3">
              <Warehouse className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-medium text-red-800">
                  Bodega a eliminar
                </div>
                <div className="text-red-700 text-sm mt-1">
                  {warehouse.name}
                </div>
                <div className="text-red-600 text-xs mt-2">
                  Esta acción no se puede deshacer
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="warehouseName" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Escribe el nombre de la bodega
              </Label>
              <Input
                id="warehouseName"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                placeholder={`Escribe "${warehouse.name}"`}
                className={nameError ? "border-red-500" : ""}
              />
              {nameError && (
                <p className="text-sm text-red-500">{nameError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
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
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
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
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !password.trim() || !warehouseName.trim()}
          >
            {isLoading ? "Eliminando..." : "Eliminar Bodega"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}