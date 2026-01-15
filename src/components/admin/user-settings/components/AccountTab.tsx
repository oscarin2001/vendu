"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import {
  ChevronDown,
  User,
  AlertCircle,
  Check,
  CreditCard,
  Mail,
} from "lucide-react";
import { Phone as PhoneIcon } from "lucide-react";
import { cn, formatPhonePattern } from "@/lib/utils";
import { getOnboardingData } from "@/services/auth/company-registration/onboarding/session";
import { getCountryConfigByName } from "@/services/admin/config";
import { PhoneInput } from "@/components/ui/phone-input";
import { getAccountProfile } from "@/services/admin/user-settings";

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
    // passwords removed from profile UI
  });
  const [lastLogin, setLastLogin] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    profile: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load profile data from server
      setProfileLoading(true);
      try {
        const result = await getAccountProfile();

      if (result.success && result.data) {
          setProfileData({
            firstName: result.data.firstName || "",
            lastName: result.data.lastName || "",
            phone: result.data.phone || "",
            ci: result.data.ci || "",
            username: result.data.username || "",
          });
          setLastLogin(result.data.lastLogin);
        } else {
          console.error("Error loading profile:", result.error);
          toast.error(result.error || "Error cargando datos del perfil");
        }
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
      // passwords handled elsewhere; skip password checks here
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
                  <PhoneIcon className="h-4 w-4" />
                  Teléfono
                </FieldLabel>
                {
                  (() => {
                    // derive company country from onboarding session so profile phone follows same formatting
                    const session: any = typeof window !== "undefined" ? getOnboardingData() : {};
                    const companyCountry = session?.company?.country;
                    const countryConfig = getCountryConfigByName(companyCountry);
                    return (
                      <PhoneInput
                        value={profileData.phone}
                        onChange={(val /*, valid*/) =>
                          setProfileData((prev) => ({ ...prev, phone: val }))
                        }
                        placeholder={
                          countryConfig?.phone?.format || formatPhonePattern(countryConfig?.phone?.local || 8)
                        }
                        fixedCountryCode={countryConfig?.phone?.prefix}
                        fixedLocalMax={countryConfig?.phone?.local}
                        hideCountrySelect
                        showValidation={!!profileData.phone}
                      />
                    );
                  })()
                }
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
                  <Mail className="h-4 w-4" />
                  Email / Usuario
                </FieldLabel>
                <Input
                  value={profileData.username}
                  disabled
                  className="bg-muted/50 cursor-not-allowed"
                  placeholder="usuario@ejemplo.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Este es el correo con el que iniciaste sesión. No se puede
                  modificar.
                </p>
              </Field>
              {/* password fields removed per request */}
            </div>

            {/* Footer con acciones */}
            <div className="mt-8 pt-6 border-t flex justify-between items-center">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                {lastLogin
                  ? `Última conexión: ${formatLastLogin(lastLogin)}`
                  : "Sin registro de última conexión"}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Restablecer
                </Button>
                <Button size="sm" className="min-w-[140px]">
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatLastLogin(date: Date): string {
  const now = new Date();
  const loginDate = new Date(date);
  const diffMs = now.getTime() - loginDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "hace unos segundos";
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
  if (diffHours < 24)
    return `hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;

  return loginDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
