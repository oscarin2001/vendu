"use client";

import { Phone, User, Mail } from "lucide-react";
import { Branch } from "@/services/admin/branches";

interface BranchContactSectionProps {
  branch: Branch;
}

export function BranchContactSection({ branch }: BranchContactSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Phone className="h-5 w-5 text-primary" />
        <h4 className="font-semibold text-base">Contacto & Gerente</h4>
      </div>

      <div className="space-y-3 pl-7">
        {branch.phone ? (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{branch.phone}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground italic">
              Sin teléfono registrado
            </span>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-sm font-medium">Gerentes Asignados</div>
          {branch.managers && branch.managers.length > 0 ? (
            <div className="space-y-2">
              {branch.managers.map((manager) => (
                <div
                  key={manager.id}
                  className="bg-muted/50 p-3 rounded-lg space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{manager.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {manager.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground italic">
                  Sin gerentes asignados
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
