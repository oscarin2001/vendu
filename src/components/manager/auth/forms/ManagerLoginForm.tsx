"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { managerLoginAction } from "@/services/manager/auth";
import type { ManagerLoginResult } from "@/services/manager/auth";
import { ManagerLoginFields } from "./ManagerLoginFields";
import { ManagerLoginButton } from "./ManagerLoginButton";
import { ManagerLoginError } from "./ManagerLoginError";

const initialState: ManagerLoginResult = { ok: false, error: "" };

export function ManagerLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, formAction, isPending] = useActionState(
    managerLoginAction,
    initialState
  );

  useEffect(() => {
    if (state.ok) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  const errorMessage = !state.ok ? state.error : null;

  return (
    <form action={formAction} className="space-y-6">
      <ManagerLoginFields
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        disabled={isPending}
      />

      <ManagerLoginError message={errorMessage} />

      <ManagerLoginButton 
        isLoading={isPending} 
        disabled={!email || !password}
      />

      <ManagerLoginFooter />
    </form>
  );
}

function ManagerLoginFooter() {
  return (
    <div className="text-center text-sm text-white/50">
      <p>
        ¿Problemas para acceder?{" "}
        <span className="text-emerald-400 cursor-pointer hover:underline">
          Contacta al administrador
        </span>
      </p>
    </div>
  );
}
