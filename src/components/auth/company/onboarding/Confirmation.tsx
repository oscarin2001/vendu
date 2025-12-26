"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Building2,
  MapPin,
  User,
  Warehouse,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ConfirmationProps {
  data: any;
  onComplete: () => void;
  onBack: () => void;
}

export function Confirmation({ data, onComplete, onBack }: ConfirmationProps) {
  const summaryItems = [
    {
      icon: Building2,
      label: "Empresa",
      value: data.companyName?.name || "No especificado",
      status: "success",
    },
    {
      icon: User,
      label: "Responsable",
      value:
        `${data.owner?.firstName || ""} ${data.owner?.lastName || ""}`.trim() ||
        "No especificado",
      status: "success",
    },
    {
      icon: MapPin,
      label: "Sucursal",
      value: data.branch?.name || "No especificado",
      status: "success",
    },
    {
      icon: Warehouse,
      label: "Bodega",
      value: data.warehouse?.hasWarehouse
        ? data.warehouse.name
        : "No requerida",
      status: data.warehouse?.hasWarehouse ? "success" : "info",
    },
    {
      icon: FileText,
      label: "Datos Fiscales",
      value: data.fiscal?.taxId ? "Configurados" : "Pendientes",
      status: data.fiscal?.taxId ? "success" : "warning",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-green-600">¡Todo listo!</h3>
          <p className="text-muted-foreground mt-2">
            Tu empresa está configurada y lista para comenzar
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Resumen de configuración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {summaryItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-in slide-in-from-left duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      item.status === "success"
                        ? "bg-green-100 text-green-600"
                        : item.status === "warning"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
                <CheckCircle
                  className={`w-5 h-5 ${
                    item.status === "success"
                      ? "text-green-500"
                      : item.status === "warning"
                      ? "text-yellow-500"
                      : "text-blue-500"
                  }`}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Revisar
        </Button>
        <Button
          onClick={onComplete}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          Comenzar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
