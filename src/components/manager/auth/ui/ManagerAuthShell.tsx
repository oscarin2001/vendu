"use client";

import { ReactNode } from "react";
import { Briefcase } from "lucide-react";

interface ManagerAuthShellProps {
  children: ReactNode;
  showPanel?: boolean;
}

export function ManagerAuthShell({ 
  children, 
  showPanel = true 
}: ManagerAuthShellProps) {
  return (
    <div className="min-h-screen bg-emerald-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-stretch lg:flex-row">
        {/* Formulario */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-emerald-950/70 p-8 shadow-[0_40px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="mt-8">{children}</div>
          </div>
        </div>
        
        {/* Panel lateral */}
        {showPanel && (
          <div className="hidden flex-1 flex-col justify-between border-l border-white/5 bg-gradient-to-br from-emerald-900 to-teal-800 px-10 py-12 text-white lg:flex">
            <ManagerPanelContent />
          </div>
        )}
      </div>
    </div>
  );
}

function ManagerPanelContent() {
  return (
    <>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
          <Briefcase className="h-6 w-6 text-emerald-400" />
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">
          Portal de Gestión
        </p>
        <p className="mt-6 text-2xl font-semibold">
          Bienvenido, Encargado
        </p>
        <p className="mt-3 text-sm text-white/70">
          Accede a tu panel de control para gestionar sucursales, 
          inventario y operaciones diarias.
        </p>
      </div>
      <ManagerFeaturesList />
      <div className="h-40 w-full rounded-2xl border border-white/5 bg-white/5" />
    </>
  );
}

function ManagerFeaturesList() {
  const features = [
    "Gestión de inventario",
    "Control de sucursales",
    "Reportes operativos",
    "Seguimiento de ventas",
  ];

  return (
    <div className="space-y-3">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="flex items-center gap-2 text-sm text-white/60"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {feature}
        </div>
      ))}
    </div>
  );
}
