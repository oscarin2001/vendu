"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

interface PasswordTabProps {
  userId: number;
}

export function PasswordTab({ userId }: PasswordTabProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      setSaving(true);
      // TODO: Implementar cambio de contraseña via API
      toast.success("Contraseña cambiada (simulado)");
    } catch (error) {
      toast.error("Error cambiando contraseña");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Cambiar Contraseña</h3>
      <Field>
        <FieldLabel>Contraseña Actual</FieldLabel>
        <Input
          type="password"
          value={formData.currentPassword}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              currentPassword: e.target.value,
            }))
          }
        />
      </Field>
      <Field>
        <FieldLabel>Nueva Contraseña</FieldLabel>
        <Input
          type="password"
          value={formData.newPassword}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
          }
        />
      </Field>
      <Field>
        <FieldLabel>Confirmar Nueva Contraseña</FieldLabel>
        <Input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
        />
      </Field>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Cambiando..." : "Cambiar Contraseña"}
      </Button>
    </div>
  );
}
