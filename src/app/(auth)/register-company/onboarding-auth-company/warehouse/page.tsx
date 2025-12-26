import { WarehouseForm } from "@/components/auth/company/onboarding/WarehouseForm";

export default function WarehousePage() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bodega</h2>
      <p className="text-muted-foreground mb-6">
        ¿Tienes una bodega distinta a tu tienda?
      </p>
      <WarehouseForm />
    </div>
  );
}
