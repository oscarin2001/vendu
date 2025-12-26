import React from "react";
import TenantSwitcher from "./TenantSwitcher";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="text-lg font-bold">MiSaaS</div>
      <div className="flex items-center gap-4">
        <TenantSwitcher />
      </div>
    </header>
  );
}
