"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Mail } from "lucide-react";
import { Branch } from "@/services/admin/branches";

interface BranchManagersSectionProps {
  branch: Branch;
}

export function BranchManagersSection({ branch }: BranchManagersSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Gerentes Asignados ({branch.managers?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!branch.managers || branch.managers.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay gerentes asignados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {branch.managers?.map((manager) => (
              <div
                key={manager.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">{manager.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {manager.email}
                    </div>
                  </div>
                </div>
                {branch.manager?.id === manager.id && (
                  <Badge variant="secondary" className="text-xs">
                    Principal
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
