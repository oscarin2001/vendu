"use client";
import React from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { checkAuthAndRedirect } from "@/services/auth/login/actions";

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
          <form action={checkAuthAndRedirect} onSubmit={onClose}>
            <button type="submit" className="text-center w-full">
              Iniciar sesión
            </button>
          </form>
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
