import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";

function PriceCard({
  title,
  price,
  bullets,
}: {
  title: string;
  price: string;
  bullets: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-3 text-2xl font-bold">{price}</div>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {bullets.map((b) => (
            <li key={b}>• {b}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href="/purchase">Comenzar</a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function PricingSection() {
  const plans = [
    {
      title: "Básico",
      price: "$9 / mes",
      bullets: ["1 tienda", "Inventario básico", "Ventas y caja"],
    },
    {
      title: "Pro",
      price: "$29 / mes",
      bullets: ["Hasta 5 tiendas", "Reportes avanzados", "Soporte prioritario"],
    },
    {
      title: "Expert",
      price: "$79 / mes",
      bullets: ["Tiendas ilimitadas", "Integraciones", "Cuenta dedicada"],
    },
  ];

  return (
    <section id="pricing" className="w-full px-6 py-16">
      <div className="w-full">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
          Precios claros, sin sorpresas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((p) => (
            <PriceCard
              key={p.title}
              title={p.title}
              price={p.price}
              bullets={p.bullets}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
