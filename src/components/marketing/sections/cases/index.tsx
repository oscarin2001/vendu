import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function CasesSection() {
  const items = [
    {
      quote: "Vendí más en 1 mes que en todo el año anterior.",
      who: "María, dueña de tienda",
      note: "Usó alertas de stock y promociones dirigidas para aumentar rotación.",
    },
    {
      quote: "Puse en orden mi inventario y gané tiempo.",
      who: "Carlos, encargado",
      note: "Centralizó recibos y devoluciones, reduciendo errores en caja.",
    },
  ];

  return (
    <section id="cases" className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">Historias reales</h2>
      <div className="space-y-6">
        {items.map((it) => (
          <Card key={it.who}>
            <CardContent>
              <CardTitle className="text-slate-700">“{it.quote}”</CardTitle>
              <div className="mt-2 text-sm text-slate-500">— {it.who}</div>
              <p className="mt-3 text-slate-600">{it.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
