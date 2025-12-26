import React from "react";

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border p-5 bg-white shadow-sm">
      <div className="text-indigo-600 font-semibold">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

export default function FeaturesGrid() {
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
      title: "Reportes accionables",
      desc: "Indicadores diarios y resúmenes para tomar decisiones.",
    },
    {
      title: "Ajustes y control",
      desc: "Historial de cambios y control de operaciones.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">
        Lo que hace Vendu por tu negocio
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <FeatureCard key={f.title} title={f.title} desc={f.desc} />
        ))}
      </div>
    </section>
  );
}
