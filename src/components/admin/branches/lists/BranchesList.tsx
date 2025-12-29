"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, Phone, User, Warehouse } from "lucide-react";

interface Branch {
  id: number;
  name: string;
  isWarehouse: boolean;
  phone: string | null;
  address: string;
  city: string;
  department: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  openingHours: any;
  manager: {
    id: number;
    name: string;
    email: string;
  } | null;
  createdAt: Date;
}

interface BranchesListProps {
  branches: Branch[];
  onEdit: (branchId: string) => void;
  onDelete: (branchId: string) => void;
}

export function BranchesList({ branches, onEdit, onDelete }: BranchesListProps) {
  if (branches.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium">No branches</h3>
            <p className="text-muted-foreground">
              Create your first branch to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {branches.map((branch) => (
        <Card key={branch.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {branch.isWarehouse ? (
                  <Warehouse className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {branch.name}
              </CardTitle>
              <Badge variant={branch.isWarehouse ? "secondary" : "default"}>
                {branch.isWarehouse ? "Warehouse" : "Store"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span className="text-sm">
                {branch.address}, {branch.city}
                {branch.country && `, ${branch.country}`}
              </span>
            </div>

            {branch.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{branch.phone}</span>
              </div>
            )}

            {branch.manager && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{branch.manager.name}</span>
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(branch.id.toString())}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(branch.id.toString())}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}