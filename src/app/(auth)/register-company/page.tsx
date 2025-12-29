"use client";
import { Suspense } from "react";
import AuthForm from "@/components/auth/company/auth-form";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
