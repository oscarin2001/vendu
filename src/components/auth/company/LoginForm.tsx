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
import { Eye, EyeOff } from "lucide-react";

interface Props extends Omit<React.ComponentProps<"form">, 'onSubmit'> {
  onSubmit?: (data: { email: string; password: string }) => void;
  error?: string;
  isLoading?: boolean;
}

export function LoginForm({ className, onSubmit, error, isLoading, ...props }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email: email.trim().toLowerCase(), password });
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handle} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="text-muted-foreground text-sm text-balance">Ingresa tu email y contraseña</p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="usuario@ejemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          </div>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>

        {error && <div className="text-sm text-red-500 text-center">{error}</div>}

        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Entrando..." : "Iniciar sesión"}
          </Button>
        </Field>

        <FieldSeparator>O continuar con</FieldSeparator>

        <Field>
          <Button variant="outline" type="button">
            Continuar con Google
          </Button>
          <FieldDescription className="text-center">
            ¿No tienes cuenta? <a href="/register-company" className="underline">Regístrate</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}