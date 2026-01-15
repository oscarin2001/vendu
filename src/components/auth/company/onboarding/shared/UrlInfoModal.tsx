"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Globe } from "lucide-react";

interface UrlInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSlug?: string;
  onConfirm?: () => void;
}

export function UrlInfoModal({ open, onOpenChange, currentSlug, onConfirm }: UrlInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Campos Permanentes</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div>
            <strong>Nombre de la empresa:</strong> Se convierte
            automáticamente en tu URL única. Por ejemplo, si escribes "Mi
            Tienda", tu URL será{" "}
            <code className="bg-muted px-1 rounded flex items-center gap-1">
              <Globe className="h-3 w-3" />
              vendu.com/{currentSlug || 'mi-tienda'}
            </code>
            .
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-none" />
            <div>
              <div className="font-semibold">El país NO podrá cambiarse después bajo ninguna circunstancia.</div>
              <div className="text-sm">Este valor determina la moneda, impuestos y formatos de reporte; una vez seleccionado no será posible modificarlo. Revisa y confirma antes de continuar.</div>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={() => { onConfirm?.(); onOpenChange(false); }}>
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
