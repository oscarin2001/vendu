import React from "react";
import { Button } from "@/components/ui/Button";

function PriceCard({
  name,
  price,
  perks,
}: {
  name: string;
  price: string;
  perks: string[];
}) {
  return (
    <div className="rounded-lg border p-6 bg-white shadow">
      <div className="text-sm font-medium text-slate-600">{name}</div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-3xl font-extrabold">{price}</div>
        <div className="text-sm text-slate-500">/mes</div>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {perks.map((p) => (
          <li key={p}>• {p}</li>
        ))}
      </ul>
      <div className="mt-6">
        <Button>
          <a href="/register-company">Comenzar</a>
        </Button>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const plans = [
    { name: "Básico", price: "$29", perks: ["1 tienda", "Soporte por email"] },
    {
      name: "Pro",
      price: "$79",
      perks: ["Hasta 5 tiendas", "Reportes detallados", "Soporte prioritario"],
    },
    {
      name: "Enterprise",
      price: "Contactar",
      perks: ["Multi-sucursal", "Acompañamiento inicial", "Soporte dedicado"],
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">
        Planes pensados para crecer
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <PriceCard
            key={p.name}
            name={p.name}
            price={p.price}
            perks={p.perks}
          />
        ))}
      </div>
    </section>
  );
}
