"use client";

import { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
  showPanel?: boolean;
}

export function AuthShell({ children, showPanel = true }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-stretch lg:flex-row">
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="mt-8">{children}</div>
          </div>
        </div>
        {showPanel && (
          <div className="hidden flex-1 flex-col justify-between border-l border-white/5 bg-gradient-to-br from-slate-900 to-slate-800 px-10 py-12 text-white lg:flex">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                Acme Inc.
              </p>
              <p className="mt-6 text-2xl font-semibold">Tu ERP moderno</p>
              <p className="mt-3 text-sm text-white/70">
                Gestiona inventario, órdenes y finanzas con la precisión que tu
                equipo necesita.
              </p>
            </div>
            <div className="h-80 w-full rounded-2xl border border-white/5 bg-white/5" />
          </div>
        )}
      </div>
    </div>
  );
}
