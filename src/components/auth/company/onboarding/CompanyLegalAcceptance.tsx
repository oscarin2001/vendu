"use client";

import React from "react";
import { Field } from "@/components/ui/field";
import { TermsModal } from "./TermsModal";

export default function CompanyLegalAcceptance({
  tosAccepted,
  setTosAccepted,
  tosRead,
  setTosRead,
}: any) {
  const [showTerms, setShowTerms] = React.useState(false);

  return (
    <>
      <Field>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={tosAccepted}
            onChange={(e) => setTosAccepted(e.target.checked)}
            className="mt-1"
            disabled={!tosRead}
          />
          <div className="text-sm">
            <div>
              He leído y acepto los{" "}
              <button
                type="button"
                className="underline"
                onClick={() => setShowTerms(true)}
              >
                Términos de Uso
              </button>{" "}
              y la{" "}
              <button
                type="button"
                className="underline"
                onClick={() => setShowTerms(true)}
              >
                Política de Uso Aceptable
              </button>
              .
            </div>
            <div className="text-xs text-muted-foreground">
              Debes <strong>abrir y marcar como leído</strong> los documentos
              antes de poder aceptar. Declaro que mi comercio no comercializa
              bienes ilegales o robados y entiendo que la plataforma podrá
              bloquear mi cuenta o página si se notifica actividad sospechosa.
            </div>
            <div className="mt-2">
              <button
                type="button"
                className="text-sm underline"
                onClick={() => setShowTerms(true)}
              >
                Abrir Términos y Política (obligatorio leer)
              </button>
            </div>
          </div>
        </label>
      </Field>

      <TermsModal
        open={showTerms}
        onClose={() => setShowTerms(false)}
        onAcknowledge={() => setTosRead(true)}
      />
    </>
  );
}
