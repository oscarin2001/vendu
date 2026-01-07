"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Plus, Mail, Eye } from "lucide-react";
import type { Campaign } from "@/services/admin/crm/types";

interface CampaignListProps {
  campaigns: Campaign[];
  isLoading: boolean;
}

const statusColors = {
  draft: "secondary",
  active: "default",
  paused: "outline",
  completed: "secondary",
} as const;

const statusLabels = {
  draft: "Borrador",
  active: "Activa",
  paused: "Pausada",
  completed: "Completada",
};

export function CampaignList({ campaigns, isLoading }: CampaignListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Campañas Activas</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">{campaign.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {campaign.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={statusColors[campaign.status]}>
                      {statusLabels[campaign.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {campaign.metrics.sent} enviados
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
