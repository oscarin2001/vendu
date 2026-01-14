"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UrlInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UrlInfoModal({ open, onOpenChange }: UrlInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Qué es la URL única?</DialogTitle>
          <DialogDescription>
            El nombre de tu empresa se convierte automáticamente en tu dirección web única.
            <br />
            <br />
            <strong>Ejemplo:</strong> Si escribes "Mi Tienda", tu URL será <code>vendu.com/mi-tienda</code>.
            <br />
            <br />
            Esta URL no se puede cambiar después de crear la empresa, así que asegúrate de que sea correcta.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}