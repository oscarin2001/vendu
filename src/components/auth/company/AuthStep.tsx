"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/services/auth/login/actions";
import { checkUsernameAction } from "@/services/auth/company-registration/actions";
import { toast } from "sonner";
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

interface AuthStepProps {
  onRegistrationSuccess: (credentials: {
    username: string;
    password: string;
  }) => void;
}

export function AuthStep({ onRegistrationSuccess }: AuthStepProps) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, loginFormAction] = useActionState(loginAction, null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (loginState?.error) {
      // Para login, mostrar toast genérico
      toast.error(loginState.error.message);
    }
  }, [loginState]);

  useEffect(() => {
    // Limpiar errores cuando cambia el modo
    setFieldErrors({});
  }, [isLogin]);

  const validateForm = (username: string, password: string) => {
    const errors: { username?: string; password?: string } = {};

    // Validate username format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(username)) {
      errors.username = "El usuario debe ser un email válido";
    } else if (username.length < 3) {
      errors.username = "El usuario debe tener al menos 3 caracteres";
    }

    // Validate password strength
    if (password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    } else {
      const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
      if (!passwordRegex.test(password)) {
        errors.password =
          "Debe contener mayúscula, minúscula, número y símbolo";
      }
    }

    return errors;
  };

  return (
    <form
      action={isLogin ? loginFormAction : undefined}
      onSubmit={
        isLogin
          ? undefined
          : async (e) => {
              e.preventDefault();
              // Handle registration - store credentials and move to onboarding
              const formData = new FormData(e.currentTarget);
              const username = formData.get("username")?.toString() || "";
              const password = formData.get("password")?.toString() || "";

              if (!username || !password) {
                setFieldErrors({
                  username: !username ? "Usuario es requerido" : undefined,
                  password: !password ? "Contraseña es requerida" : undefined,
                });
                return;
              }

              // Validate form
              const validationErrors = validateForm(username, password);
              if (Object.keys(validationErrors).length > 0) {
                setFieldErrors(validationErrors);
                return;
              }

              // Clear any previous errors
              setFieldErrors({});

              // Check if username already exists
              try {
                const exists = await checkUsernameAction(username);
                console.log("Check username result for", username, ":", exists);
                if (exists) {
                  toast.error(
                    "Este usuario ya está registrado. Intenta iniciar sesión."
                  );
                  return;
                }
              } catch (error) {
                console.error("Error checking username:", error);
                toast.error("Error al verificar usuario. Inténtalo de nuevo.");
                return;
              }

              onRegistrationSuccess({ username, password });
            }
      }
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        {/* HEADER */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">
            {isLogin ? "Iniciar sesión" : "Registrar empresa"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin
              ? "Ingresa tus credenciales para acceder"
              : "Crea tu cuenta para comenzar"}
          </p>
        </div>

        {/* USUARIO */}
        <Field>
          <FieldLabel htmlFor="username">Usuario</FieldLabel>
          <Input
            id="username"
            name="username"
            placeholder="usuario@empresa.com"
            required
            {...(isLogin
              ? {}
              : {
                  minLength: 3,
                  pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}",
                  title: "Ingresa un email válido",
                })}
            onChange={() =>
              setFieldErrors((prev) => ({ ...prev, username: undefined }))
            }
          />
          {!isLogin && fieldErrors.username && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.username}</p>
          )}
        </Field>

        {/* CONTRASEÑA */}
        <Field>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              {...(isLogin
                ? {}
                : {
                    minLength: 8,
                    pattern:
                      "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}",
                    title:
                      "Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial",
                  })}
              onChange={() =>
                setFieldErrors((prev) => ({ ...prev, password: undefined }))
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {!isLogin && fieldErrors.password && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>
          )}
        </Field>

        <Field>
          <Button type="submit" className="w-full">
            {isLogin ? "Iniciar sesión" : "Registrar empresa"}
          </Button>
        </Field>

        <FieldSeparator>O continúa con</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" className="w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="mr-2"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar con Google
          </Button>
        </Field>

        <FieldDescription className="text-center">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="underline underline-offset-4"
          >
            {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
