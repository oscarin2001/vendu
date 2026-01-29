"use client";

import { Briefcase } from "lucide-react";

export function ManagerLoginHeader() {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
        <Briefcase className="h-7 w-7 text-emerald-400" />
      </div>
      <h1 className="text-2xl font-bold text-white">
        Portal de Encargados
      </h1>
      <p className="mt-2 text-sm text-white/60">
        Ingresa tus credenciales para acceder al sistema
      </p>
    </div>
  );
}
