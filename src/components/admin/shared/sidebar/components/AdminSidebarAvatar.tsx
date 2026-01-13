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
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-emerald-500 text-white font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
