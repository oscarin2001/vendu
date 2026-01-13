"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import {
  ChevronDown,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Phone,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountTabProps {
  userId: number;
}

export function AccountTab({ userId }: AccountTabProps) {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    ci: "",
    username: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    profile: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load profile data
      setProfileLoading(true);
      try {
        // TODO: Replace with actual profile loading
        setProfileData({
          firstName: "Oscar",
          lastName: "Flores",
          phone: "+591 12345678",
          ci: "12345678",
          username: "oscar.flores",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (profileError) {
        console.error("Error loading profile:", profileError);
        toast.error("Error cargando datos del perfil");
      } finally {
        setProfileLoading(false);
      }
    } catch (error) {
      console.error("General error loading data:", error);
      toast.error("Error general cargando datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (
        profileData.newPassword &&
        profileData.newPassword !== profileData.confirmPassword
      ) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
      // TODO: Implementar guardado real
      toast.success("Cuenta actualizada (simulado)");
    } catch (error) {
      toast.error("Error guardando cuenta");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground">Cuenta</h3>
        <p className="text-muted-foreground mt-1">
          Gestiona tu información personal y credenciales
        </p>
      </div>

      {/* Profile Section Mejorada */}
      <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <button
          onClick={() => toggleSection("profile")}
          className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-foreground text-lg">
                Perfil de Usuario
              </span>
              <p className="text-sm text-muted-foreground">
                Información personal y credenciales de acceso
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              expandedSections.profile ? "rotate-180" : ""
            )}
          />
        </button>
        {expandedSections.profile && (
          <div className="p-6 bg-card border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nombre
                </FieldLabel>
                <Input
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className={cn(errors.firstName && "border-destructive")}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.firstName}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Apellido
                </FieldLabel>
                <Input
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className={cn(errors.lastName && "border-destructive")}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.lastName}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono
                </FieldLabel>
                <Input
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="+591 12345678"
                />
              </Field>
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  CI
                </FieldLabel>
                <Input
                  value={profileData.ci}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, ci: e.target.value }))
                  }
                  placeholder="12345678"
                />
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Usuario
                </FieldLabel>
                <Input
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="usuario.ejemplo"
                />
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel className="flex items-center gap-2">
                  Nueva Contraseña
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={profileData.newPassword}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Dejar vacío para mantener la actual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel className="flex items-center gap-2">
                  Confirmar Contraseña
                </FieldLabel>
                <Input
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Repite la nueva contraseña"
                />
              </Field>
            </div>

            {/* Footer con acciones */}
            <div className="mt-8 pt-6 border-t flex justify-between items-center">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Última actualización: hace 2 días
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Restablecer
                </Button>
                <Button size="sm" className="min-w-[140px]">
                  {saving ? "Guardando..." : "Datos de la cuenta"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
