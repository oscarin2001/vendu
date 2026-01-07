"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Plus, Users, Mail, Trophy, Target } from "lucide-react";
import { CampaignList } from "../campaigns/CampaignList";
import { LoyaltyProgramComponent } from "../loyalty/LoyaltyProgram";
import { CustomerSegmentsComponent } from "../segments/CustomerSegments";
import { useCRM } from "@/services/admin/crm";

export function CRMPageContent() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  const { metrics, campaigns, loyaltyProgram, segments, isLoading } =
    useCRM(tenantId);

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CRM y Marketing</h1>
        <p className="text-muted-foreground">
          Gestiona campañas, fideliza clientes y analiza comportamiento de
          compra
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalCustomers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Registrados activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Campañas Activas
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">En ejecución</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Puntos Emitidos
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalPointsIssued.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total acumulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversión</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.campaignConversionRate}%
            </div>
            <p className="text-xs text-muted-foreground">Tasa de campañas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="loyalty">Programa de Lealtad</TabsTrigger>
          <TabsTrigger value="segments">Segmentos</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Campañas de Marketing</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Campaña
            </Button>
          </div>
          <CampaignList campaigns={campaigns} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <h2 className="text-xl font-semibold">Programa de Lealtad</h2>
          <LoyaltyProgramComponent
            loyaltyProgram={loyaltyProgram}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <h2 className="text-xl font-semibold">Segmentación de Clientes</h2>
          <CustomerSegmentsComponent
            segments={segments}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
