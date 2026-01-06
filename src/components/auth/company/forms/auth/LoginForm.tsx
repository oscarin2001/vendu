"use client";

import AuthForm from "../../pages/AuthForm";

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  isLoading?: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  return (
    <AuthForm
      mode="login"
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
}
