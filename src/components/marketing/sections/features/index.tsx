import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-indigo-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mt-1 text-sm text-slate-600">{desc}</p>
      </CardContent>
    </Card>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      title: "Inventario por sucursal",
      desc: "Control exacto por ubicación y alertas automáticas.",
    },
    {
      title: "Ventas y caja integradas",
      desc: "Cierre de caja simple y conciliación en segundos.",
    },
    {
      title: "Reservas y envíos",
      desc: "Gestión de envíos con opciones de pago contra entrega y seguimiento.",
    },
    {
      title: "Roles y permisos",
      desc: "Dueños, encargados y staff con permisos claros.",
    },
    {
      title: "Indicadores y resúmenes",
      desc: "Indicadores diarios y resúmenes para tomar decisiones.",
    },
    {
      title: "Ajustes y control",
      desc: "Historial de cambios y control de operaciones.",
    },
  ];

  return (
    <section id="features" className="w-full px-6 py-16">
      <div className="w-full">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
          Lo que hace Vendu por tu negocio
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} title={f.title} desc={f.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}
