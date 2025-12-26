import React from "react";
import MarketingNavbar from "@/components/marketing/landing/navbar";
import Hero from "@/components/marketing/landing/hero";
import FeaturesSection from "@/components/marketing/sections/features";
import PricingSection from "@/components/marketing/sections/pricing";
import CasesSection from "@/components/marketing/sections/cases";
import MobileMenu from "@/components/marketing/landing/mobile-menu";
import Footer from "@/components/marketing/landing/Footer";

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen w-full">
      <MarketingNavbar />
      <main className="pt-16 w-full">
        <Hero />
        <FeaturesSection />
        <CasesSection />
        <PricingSection />
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-lg border p-8 text-center text-slate-700">
            Testimonios y próximos contenidos.
          </div>
        </section>
      </main>
      <Footer />
      <MobileMenu />
    </div>
  );
}
