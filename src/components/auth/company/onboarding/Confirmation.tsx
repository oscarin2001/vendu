"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Building2,
  User,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ConfirmationProps {
  data?: any;
  onComplete?: () => void;
  onBack?: () => void;
  tenantId?: string;
}

export function Confirmation({
  data = {},
  onComplete = () => {},
  onBack = () => {},
  tenantId = "",
}: ConfirmationProps) {
  const router = useRouter();
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
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-emerald-700" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-emerald-700">¡Todo listo!</h3>
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
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-in slide-in-from-left duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
                <CheckCircle
                  className={`w-5 h-5 ${
                    item.status === "success"
                      ? "text-emerald-700"
                      : item.status === "warning"
                      ? "text-yellow-500"
                      : "text-emerald-600"
                  }`}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="px-8">
          Atrás
        </Button>
        <Button
          onClick={() => {
            onComplete();
            // Redirection will be handled by the parent component after registration completes
          }}
          className="bg-emerald-500 hover:bg-emerald-800 px-8"
        >
          Comenzar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
