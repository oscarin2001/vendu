"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

interface ProfileTabProps {
  userId: number;
}

export function ProfileTab({ userId }: ProfileTabProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    ci: "",
    username: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // TODO: Implementar carga real del perfil
      // Mock data for now
      setFormData({
        firstName: "Oscar",
        lastName: "Flores",
        phone: "+591 12345678",
        ci: "12345678",
        username: "oscar.flores",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Error cargando perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (
        formData.newPassword &&
        formData.newPassword !== formData.confirmPassword
      ) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
      // TODO: Implementar guardado real del perfil
      toast.success("Perfil actualizado (simulado)");
    } catch (error) {
      toast.error("Error guardando perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Perfil de Usuario</h3>
      <Field>
        <FieldLabel>Nombre</FieldLabel>
        <Input
          value={formData.firstName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, firstName: e.target.value }))
          }
        />
      </Field>
      <Field>
        <FieldLabel>Apellido</FieldLabel>
        <Input
          value={formData.lastName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, lastName: e.target.value }))
          }
        />
      </Field>
      <Field>
        <FieldLabel>Teléfono</FieldLabel>
        <Input
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
        />
      </Field>
      <Field>
        <FieldLabel>CI</FieldLabel>
        <Input
          value={formData.ci}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, ci: e.target.value }))
          }
        />
      </Field>
      <Field>
        <FieldLabel>Usuario</FieldLabel>
        <Input
          value={formData.username}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, username: e.target.value }))
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
        <FieldLabel>Confirmar Contraseña</FieldLabel>
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
        {saving ? "Guardando..." : "Guardar"}
      </Button>
    </div>
  );
}
