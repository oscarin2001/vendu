"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminSidebarAvatarProps {
  firstName?: string;
  lastName?: string;
  className?: string;
}

export function AdminSidebarAvatar({
  firstName = "U",
  lastName = "U",
  className,
}: AdminSidebarAvatarProps) {
  // Función para obtener iniciales
  const getInitials = (first: string, last: string) => {
    const firstInitial = first.charAt(0).toUpperCase();
    const lastInitial = last.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const initials = getInitials(firstName, lastName);

  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-emerald-500 text-white font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
