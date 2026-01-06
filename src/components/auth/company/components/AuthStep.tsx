"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "../forms/auth/LoginForm";
import { RegisterForm } from "../forms/auth/RegisterForm";

interface AuthStepProps {
  onRegistrationSuccess?: (credentials: {
    email: string;
    password: string;
    confirmPassword?: string;
  }) => void;
}

export function AuthStep({ onRegistrationSuccess }: AuthStepProps) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode === "login");

  useEffect(() => {
    // Limpiar cualquier estado anterior cuando cambia el modo
    // Esto asegura que no queden residuos de formularios anteriores
  }, [isLogin]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* TABS PARA CAMBIAR ENTRE LOGIN Y REGISTRO */}
      <div className="flex rounded-lg bg-muted p-1 mb-6">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            isLogin
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            !isLogin
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Registrarse
        </button>
      </div>

      {/* FORMULARIO */}
      {isLogin ? (
        <LoginForm />
      ) : (
        <RegisterForm onSubmit={onRegistrationSuccess} />
      )}
    </div>
  );
}
