"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import type { CustomerSegment } from "@/services/admin/crm/types";

interface CustomerSegmentsProps {
  segments: CustomerSegment[];
  isLoading: boolean;
}

export function CustomerSegmentsComponent({
  segments,
  isLoading,
}: CustomerSegmentsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segmentos de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {segments.map((segment) => (
            <div key={segment.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{segment.name}</h3>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {segment.customerCount}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {segment.description}
              </p>
              <div className="text-xs text-muted-foreground">
                Creado: {segment.createdAt.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
