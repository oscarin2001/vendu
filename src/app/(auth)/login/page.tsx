import React from "react";
import { LoginForm } from "@/components/ui/login-form";

export default function LoginPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
      <div className="mt-4">
        <LoginForm />
      </div>
    </main>
  );
}
