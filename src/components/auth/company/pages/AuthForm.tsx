"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  mode?: "login" | "register";
  onSubmit?: (data: {
    email: string;
    password: string;
    confirmPassword?: string;
  }) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M23.5 12.25c0-.86-.07-1.45-.21-2.1H12v3.92h6.52a5.57 5.57 0 0 1-2.42 3.65v3.03h3.9c2.28-2.1 3.6-5.2 3.6-8.5z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.97-1 7.97-2.73l-3.9-3.03c-1.08.73-2.46 1.16-4.07 1.16-3.13 0-5.78-2.1-6.72-4.92H1.61v3.07A11.98 11.98 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.48a7.24 7.24 0 0 1 0-4.35V7.06H1.61a11.99 11.99 0 0 0 0 9.88l3.67-2.46z"
      />
      <path
        fill="#EA4335"
        d="M12 4.5c1.77 0 3.36.61 4.62 1.8l3.46-3.46C17.95 1.1 15.22 0 12 0 7.87 0 4.4 2.26 2.62 5.53l3.67 2.46C6.22 6.6 8.87 4.5 12 4.5z"
      />
    </svg>
  );
}

export default function AuthForm({
  mode = "login",
  onSubmit,
  isLoading = false,
  error,
  className,
  ...props
}: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            {mode === "login"
              ? "Ingresa tu email para acceder a tu cuenta"
              : "Ingresa tu email para crear tu cuenta empresarial"}
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="empresa@ejemplo.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            {mode === "login" && (
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
            />
            <button
              type="button"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </Field>

        {error && (
          <div className="text-sm text-red-500 text-center">{error}</div>
        )}

        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </Button>
        </Field>

        <FieldSeparator>O continuar con</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" className="w-full">
            <span className="mr-2 flex h-4 w-4 items-center justify-center">
              <GoogleIcon />
            </span>
            {mode === "login"
              ? "Continuar con Google"
              : "Registrarse con Google"}
          </Button>
          <FieldDescription className="text-center">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <a
                  href="?mode=register"
                  className="underline underline-offset-4"
                >
                  Regístrate
                </a>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <a href="?mode=login" className="underline underline-offset-4">
                  Inicia sesión
                </a>
              </>
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
