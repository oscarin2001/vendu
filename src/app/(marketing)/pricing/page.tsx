import React from "react";
import Link from "next/link";
import SectionHeader from "@/components/marketing/landing/SectionHeader";
import MarketingNavbar from "@/components/marketing/landing/navbar";
import Footer from "@/components/marketing/landing/Footer";

export default function PricingPage() {
  return (
    <>
      <MarketingNavbar />
      <main className="pt-16">
        <SectionHeader
          title="Precios sencillos"
          intro="Escoge el plan que mejor se adapte a tu tienda. Sin contratos largos ni letra chica."
        />

        <section className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border p-6 bg-white shadow-sm">
              <div className="font-semibold text-lg">Básico</div>
              <div className="text-3xl font-extrabold mt-3">
                $9<span className="text-base font-medium"> / mes</span>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Ideal para tiendas pequeñas que empiezan a organizar su stock y
                ventas.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• 1 tienda</li>
                <li>• Control de inventario básico</li>
                <li>• Punto de venta y cierre de caja</li>
                <li>• Soporte por email</li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/purchase"
                  className="inline-block w-full rounded-md bg-indigo-600 px-4 py-2 text-white text-center"
                >
                  Empezar
                </Link>
              </div>
            </div>

            <div className="rounded-xl border p-6 bg-white shadow-sm">
              <div className="font-semibold text-lg">Pro</div>
              <div className="text-3xl font-extrabold mt-3">
                $29<span className="text-base font-medium"> / mes</span>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Para comercios con varias sucursales y necesidades de reporte.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Hasta 5 tiendas</li>
                <li>• Reportes avanzados y exportes</li>
                <li>• Prioridad en soporte</li>
                <li>• Integración con pasarelas de pago</li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/purchase"
                  className="inline-block w-full rounded-md bg-indigo-600 px-4 py-2 text-white text-center"
                >
                  Comenzar
                </Link>
              </div>
            </div>

            <div className="rounded-xl border p-6 bg-white shadow-sm">
              <div className="font-semibold text-lg">Expert</div>
              <div className="text-3xl font-extrabold mt-3">
                $79<span className="text-base font-medium"> / mes</span>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Solución para cadenas y negocios con integraciones y soporte
                dedicado.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Tiendas ilimitadas</li>
                <li>• API e integraciones a medida</li>
                <li>• Cuenta y soporte dedicado</li>
                <li>• Migración y onboarding personalizado</li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/purchase"
                  className="inline-block w-full rounded-md bg-indigo-600 px-4 py-2 text-white text-center"
                >
                  Contactar ventas
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-8">
          <div className="rounded-lg border p-6 bg-white shadow-sm">
            <h4 className="font-semibold">¿No estás seguro?</h4>
            <p className="mt-2 text-slate-700">
              Contacta nuestro equipo y te ayudamos a elegir el plan.
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="rounded-md bg-indigo-600 px-4 py-2 text-white"
              >
                Contactar
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
