"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";

interface ManagerLoginFieldsProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  disabled?: boolean;
}

export function ManagerLoginFields({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  disabled = false,
}: ManagerLoginFieldsProps) {
  return (
    <div className="space-y-4">
      <EmailField 
        value={email} 
        onChange={onEmailChange} 
        disabled={disabled} 
      />
      <PasswordField 
        value={password} 
        onChange={onPasswordChange} 
        disabled={disabled} 
      />
    </div>
  );
}

interface FieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

function EmailField({ value, onChange, disabled }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-white/80 flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Correo electrónico
      </Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="tu@correo.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500"
        autoComplete="email"
      />
    </div>
  );
}

function PasswordField({ value, onChange, disabled }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="password" className="text-white/80 flex items-center gap-2">
        <Lock className="h-4 w-4" />
        Contraseña
      </Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500"
        autoComplete="current-password"
      />
    </div>
  );
}
