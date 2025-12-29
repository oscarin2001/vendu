"use client";
import React from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export default function MobileMenu({
  open = false,
  onClose = () => {},
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <nav className="flex flex-col gap-4">
        <Link
          href="/features"
          onClick={onClose}
          className="text-lg font-medium"
        >
          Características
        </Link>
        <Link href="/pricing" onClick={onClose} className="text-lg font-medium">
          Precios
        </Link>
        <Link href="/cases" onClick={onClose} className="text-lg font-medium">
          Casos
        </Link>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="/register-company?mode=login"
            onClick={onClose}
            className="text-center"
          >
            Iniciar sesión
          </Link>
          <div className="text-center">
            <Button>
              <Link href="/register-company">Registrar mi empresa</Link>
            </Button>
          </div>
        </div>
      </nav>
    </Modal>
  );
}
