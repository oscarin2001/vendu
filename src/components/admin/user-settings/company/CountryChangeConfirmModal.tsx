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
import { AlertTriangle, ArrowRight, Coins } from "lucide-react";

interface CountryChangeConfirmModalProps {
  open: boolean;
  currentCountry: string;
  nextCountry: string;
  currentCurrency?: string;
  nextCurrency?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CountryChangeConfirmModal({
  open,
  currentCountry,
  nextCountry,
  currentCurrency,
  nextCurrency,
  onCancel,
  onConfirm,
}: CountryChangeConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => (!value ? onCancel() : undefined)}
    >
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar cambio de pais
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Estas por cambiar la configuracion de pais de{" "}
                {currentCountry || "tu empresa"} a {nextCountry}.
              </p>
              <div className="rounded-md border bg-amber-50 p-3 text-amber-900">
                <div className="flex items-center gap-2 font-semibold">
                  <Coins className="h-4 w-4" />
                  Actualizacion de moneda
                </div>
                <p className="mt-1">
                  El tipo de moneda pasara de{" "}
                  {currentCurrency || "la moneda actual"} a{" "}
                  {nextCurrency || "la nueva moneda"}. Las cifras existentes se
                  mantendran, pero deberas revisarlas manualmente.
                </p>
              </div>
              <div className="rounded-md border bg-muted p-3 space-y-2">
                <p>
                  <strong>Telefonos guardados:</strong> los numeros existentes
                  no se ajustan automaticamente. Si tu formato local cambia,
                  actualizalos manualmente para evitar errores de contacto.
                </p>
                <p>
                  <strong>Equipos dependientes:</strong> los responsables de
                  sucursales, bodegas, empleados internos y proveedores pueden
                  necesitar actualizar sus datos y permisos para reflejar el
                  nuevo pais. Coordina con ellos antes de continuar.
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="gap-2">
            Aceptar cambio
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
