import React from "react";

export function BranchListItem({ branch }: { branch: any }) {
  return (
    <div className="rounded border p-3 flex items-center justify-between">
      <div>
        <div className="font-medium">{branch.name}</div>
        <div className="text-sm text-muted-foreground">
          {branch.city} — {branch.address}
        </div>
      </div>
      <div className="text-sm">{branch.isWarehouse ? "Bodega" : "Tienda"}</div>
    </div>
  );
}
