"use client";

import AuthForm from "../../pages/AuthForm";

interface RegisterFormProps {
  onSubmit?: (data: {
    email: string;
    password: string;
    confirmPassword?: string;
  }) => void;
  isLoading?: boolean;
  error?: string;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  error,
}: RegisterFormProps) {
  return (
    <AuthForm
      mode="register"
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
}
