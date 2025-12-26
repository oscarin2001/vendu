import React from "react";
import SectionHeader from "@/components/marketing/landing/SectionHeader";
import MarketingNavbar from "@/components/marketing/landing/navbar";
import Footer from "@/components/marketing/landing/Footer";

export default function CasesPage() {
  return (
    <>
      <MarketingNavbar />
      <main className="pt-16">
        <SectionHeader
          title="Historias de clientes"
          intro="Pequeños negocios que mejoraron ventas y ganaron tiempo con Vendu."
        />

        <section className="mx-auto max-w-3xl px-6 py-6">
          <div className="space-y-6">
            <article className="rounded-lg border p-6">
              <p className="text-slate-700">
                “Vendí más en 1 mes que en todo el año anterior.”
              </p>
              <div className="mt-2 text-sm text-slate-500">
                — María, dueña de tienda
              </div>
              <p className="mt-3 text-slate-600">
                María usó alertas de stock y promociones dirigidas para aumentar
                rotación.
              </p>
            </article>

            <article className="rounded-lg border p-6">
              <p className="text-slate-700">
                “Ahora mi inventario está ordenado y ahorro tiempo.”
              </p>
              <div className="mt-2 text-sm text-slate-500">
                — Carlos, encargado
              </div>
              <p className="mt-3 text-slate-600">
                Carlos centralizó recibos y devoluciones, reduciendo errores en
                caja.
              </p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
