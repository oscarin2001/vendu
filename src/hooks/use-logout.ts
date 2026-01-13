"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/services/auth/logout";

export function useLogout() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const logout = useCallback(() => {
    startTransition(async () => {
      try {
        await logoutAction();
      } catch (error) {
        console.error("Failed to log out", error);
      } finally {
        router.replace("/register-company?mode=login");
        router.refresh();
      }
    });
  }, [router]);

  return { logout, isPending };
}
