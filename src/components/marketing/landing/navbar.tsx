"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import MobileMenu from "./mobile-menu";
import { checkAuthAndRedirect } from "@/services/auth/login/actions";

export default function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 w-full ${
        scrolled ? "bg-white/95 shadow-md" : "bg-transparent"
      } backdrop-blur`}
    >
      <div className="px-6 w-full">
        <nav className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Vendu
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-slate-700">
              <Link href="/features" className="hover:underline">
                Características
              </Link>
              <Link href="/pricing" className="hover:underline">
                Precios
              </Link>
              <Link href="/cases" className="hover:underline">
                Casos
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <form action={checkAuthAndRedirect}>
              <button
                type="submit"
                className="text-sm text-slate-700 hover:underline"
              >
                Iniciar sesión
              </button>
            </form>
            <Button>
              <Link href="/register-company">Registrar mi empresa</Link>
            </Button>

            {/* Mobile menu button (simple) */}
            <button
              className="md:hidden ml-2"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen(true)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <MobileMenu
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
