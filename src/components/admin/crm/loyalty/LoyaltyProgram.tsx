"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { LoyaltyProgram } from "@/services/admin/crm/types";

interface LoyaltyProgramComponentProps {
  loyaltyProgram: LoyaltyProgram | null;
  isLoading: boolean;
}

export function LoyaltyProgramComponent({
  loyaltyProgram,
  isLoading,
}: LoyaltyProgramComponentProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-48 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!loyaltyProgram) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Programa de lealtad no configurado
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{loyaltyProgram.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {loyaltyProgram.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <strong>{loyaltyProgram.pointsPerDollar} punto(s)</strong> por cada
            $1 gastado
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Niveles de Membresía</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loyaltyProgram.levels.map((level, index) => {
              const nextLevel = loyaltyProgram.levels[index + 1];
              const progress = nextLevel
                ? (level.minPoints / nextLevel.minPoints) * 100
                : 100;

              return (
                <div key={level.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge
                        style={{ backgroundColor: level.color }}
                        className="text-white"
                      >
                        {level.name}
                      </Badge>
                      <span className="text-sm font-medium">
                        {level.minPoints.toLocaleString()} puntos
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Beneficios: {level.benefits.join(", ")}
                  </div>
                  {nextLevel && <Progress value={progress} className="h-2" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
