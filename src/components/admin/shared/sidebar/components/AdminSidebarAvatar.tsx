"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminSidebarAvatarProps {
  firstName?: string;
  lastName?: string;
  className?: string;
}

export function AdminSidebarAvatar({
  firstName = "",
  lastName = "",
  className,
}: AdminSidebarAvatarProps) {
  // Obtener las iniciales, manejando casos vacíos
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";

  // Si ambos están vacíos, mostrar "U" por Usuario
  const initials =
    firstInitial || lastInitial ? `${firstInitial}${lastInitial}` : "U";

  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-emerald-500 text-white font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
