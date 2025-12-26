import React from "react";
import SectionHeader from "@/components/marketing/landing/SectionHeader";
import MarketingNavbar from "@/components/marketing/landing/navbar";
import Footer from "@/components/marketing/landing/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FeaturesPage() {
  return (
    <>
      <MarketingNavbar />
      <main className="pt-16">
        <SectionHeader
          title="Características principales"
          intro="Todo lo que necesitas para gestionar ventas, stock y entregas, explicado de manera clara y práctica."
        />

        <section className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-indigo-600">
                  Inventario por sucursal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  Organiza stock por ubicación, recibe alertas cuando un
                  producto se agota y mueve inventario entre sucursales con unos
                  clics.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-indigo-600">
                  Ventas y caja
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  Punto de venta sencillo, cierre de caja diario y reportes
                  claros para entender cuánto vendes y cuándo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-indigo-600">
                  Reservas y envíos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  Acepta reservas, gestiona envíos y ofrece pago contra entrega.
                  Los clientes reciben información clara del estado de su
                  pedido.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-indigo-600">
                  Roles y permisos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  Define quién puede ver y hacer cambios: dueño, encargado o
                  vendedor. Control simple y seguro.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      {/* Footer shared with landing */}
      <Footer />
    </>
  );
}
