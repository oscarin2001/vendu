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

interface CountryChangeVerifyModalProps {
  open: boolean;
  companyName: string;
  nextCountry: string;
  password: string;
  companyNameInput: string;
  passwordError?: string;
  companyNameError?: string;
  onPasswordChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CountryChangeVerifyModal({
  open,
  companyName,
  nextCountry,
  password,
  companyNameInput,
  passwordError,
  companyNameError,
  onPasswordChange,
  onCompanyNameChange,
  onCancel,
  onConfirm,
}: CountryChangeVerifyModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => (!value ? onCancel() : undefined)}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <AlertTriangle className="h-5 w-5" />
            Verifica la identidad de la empresa
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Para confirmar el cambio de pais a {nextCountry}, ingresa el
                nombre exacto de la empresa y tu contraseña de seguridad.
              </p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="company-name"
                    className="flex items-center gap-2"
                  >
                    <Type className="h-4 w-4" />
                    Nombre de la empresa
                  </Label>
                  <Input
                    id="company-name"
                    placeholder={`Escribe: ${companyName}`}
                    value={companyNameInput}
                    onChange={(event) =>
                      onCompanyNameChange(event.target.value)
                    }
                    className={companyNameError ? "border-red-500" : ""}
                  />
                  {companyNameError && (
                    <span className="text-xs text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3" />
                      {companyNameError}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground block">
                    Debes escribir exactamente: <strong>{companyName}</strong>
                  </span>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="company-password"
                    className="flex items-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Contraseña de seguridad
                  </Label>
                  <Input
                    id="company-password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(event) => onPasswordChange(event.target.value)}
                    className={passwordError ? "border-red-500" : ""}
                  />
                  {passwordError && (
                    <span className="text-xs text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3" />
                      {passwordError}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground block">
                    Esta clave es la de operaciones sensibles, puede diferir de
                    la contraseña de inicio de sesion.
                  </span>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Confirmar cambio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
