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
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Lock, Type } from "lucide-react";
import { PasswordConfirmation } from "@/components/admin/branches/modals/delete/components";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";

interface SupplierEditFinalModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  // onConfirm returns password and optional overrides for contract fields
  onConfirm: (
    password: string,
    overrides?: { isIndefinite?: boolean; contractEndAt?: Date | null },
  ) => void;
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
  const [isIndefinite, setIsIndefinite] = useState<boolean>(
    supplier?.isIndefinite ?? true,
  );
  const [contractEndAt, setContractEndAt] = useState<Date | null>(
    supplier?.contractEndAt ? new Date(supplier.contractEndAt) : null,
  );

  // sync when modal opens or supplier changes
  useEffect(() => {
    setIsIndefinite(supplier?.isIndefinite ?? true);
    setContractEndAt(
      supplier?.contractEndAt ? new Date(supplier.contractEndAt) : null,
    );
  }, [supplier, isOpen]);

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
      onConfirm(password, { isIndefinite, contractEndAt });
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
              <Type className="h-4 w-4" /> Escribe el nombre completo del
              proveedor
            </Label>
            <Input
              id="supplierName"
              type="text"
              placeholder={`Escribe: ${supplier.fullName}`}
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className={nameError ? "border-red-500" : ""}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
              }}
            />
            {nameError && (
              <p className="text-sm text-red-600 mt-1">{nameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-3">
              <Checkbox
                id="isIndefinite"
                checked={isIndefinite}
                onCheckedChange={(v) => {
                  const checked = Boolean(v);
                  setIsIndefinite(checked);
                  if (checked) setContractEndAt(null);
                }}
              />
              <span>Contrato por tiempo indefinido</span>
            </Label>

            <div className="space-y-1">
              <Label htmlFor="contractEndAt">Fecha fin de contrato</Label>
              <DatePicker
                date={contractEndAt || undefined}
                onSelect={(d) => setContractEndAt(d || null)}
                placeholder="Fecha de fin"
                disabled={isIndefinite || isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" /> Contraseña de confirmación
              </Label>
              <PasswordConfirmation
                value={password}
                onChange={setPassword}
                error={passwordError || error}
                onEnterPress={handleConfirm}
              />
            </div>
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
