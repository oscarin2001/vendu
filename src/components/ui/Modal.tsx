"use client";
import React from "react";

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded bg-white p-6">
        {children}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-3 py-1">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
