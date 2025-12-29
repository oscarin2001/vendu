import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function MarketingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="w-full px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Toma el control total de tu inventario y ventas en un solo lugar
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              Vendu reúne stock, ventas y caja en una sola herramienta pensada
              para dueños de negocios. Mejora tu operación, reduce pérdidas y
              vende más con información clara y acciones sencillas.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline">
                <Link href="/register-company?mode=login">Iniciar sesión</Link>
              </Button>
              <Button>
                <Link href="/register-company">Registrar mi empresa</Link>
              </Button>
              <Link
                href="/staff-access"
                className="inline-flex items-center rounded px-3 py-1.5 text-sm font-medium border"
              >
                Ver demo
              </Link>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-2 text-sm text-slate-600 max-w-md">
              <li>Inventario por sucursal</li>
              <li>Ventas y caja integradas</li>
              <li>Reservas y envíos en la región</li>
              <li>Roles y permisos empresariales</li>
            </ul>
          </div>

          <div className="order-first md:order-last">
            <div className="rounded-xl bg-gradient-to-tr from-indigo-50 to-slate-50 p-6 shadow-lg w-full">
              <div className="aspect-video w-full overflow-hidden rounded-md bg-white">
                {/* Mock screenshot area; replace with real image */}
                <div className="flex h-full items-center justify-center text-slate-400">
                  <span>Captura del panel de Vendu (demo)</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-500">
                Vista previa: panel de administración
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
