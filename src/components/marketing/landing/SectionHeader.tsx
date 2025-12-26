import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SectionHeader({
  title,
  intro,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  intro: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <header className="mx-auto max-w-4xl px-6 py-8 text-center">
      <h1 className="text-3xl font-bold text-slate-900 mb-3">{title}</h1>
      <p className="text-slate-700 mb-6">{intro}</p>
      {ctaLabel && ctaHref ? (
        <div className="flex justify-center">
          <Button>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </div>
      ) : null}
    </header>
  );
}
