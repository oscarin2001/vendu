import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsContent } from "./TermsContent";
import { AUPContent } from "./AUPContent";

export function TermsModal({
  open,
  onClose,
  onAcknowledge,
  companyName,
}: {
  open: boolean;
  onClose: () => void;
  onAcknowledge: () => void;
  companyName?: string;
}) {
  const [terms, setTerms] = useState<string>("");
  const [aup, setAup] = useState<string>("");
  const [ack, setAck] = useState(false);

  // No need for useEffect since we're using components

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-md shadow-lg p-6 overflow-auto max-h-[80vh]">
        <h3 className="text-lg font-bold mb-4">Términos de Uso</h3>
        <div className="prose mb-6 max-h-60 overflow-y-auto">
          <TermsContent companyName={companyName} />
        </div>

        <h4 className="text-md font-semibold mt-4">
          Política de Uso Aceptable (AUP)
        </h4>
        <div className="prose mb-6 max-h-60 overflow-y-auto">
          <AUPContent companyName={companyName} />
        </div>

        <label className="flex items-start gap-3">
          <Checkbox
            checked={ack}
            onCheckedChange={(checked) => setAck(checked as boolean)}
            className="mt-1"
          />
          <span className="text-sm">
            He leído y acepto los Términos de Uso y la Política de Uso Aceptable.
            Declaro que mi comercio no comercializa bienes ilegales o robados y entiendo que la plataforma podrá
            bloquear mi cuenta o página si se notifica actividad sospechosa.
          </span>
        </label>

        <div className="flex gap-2 justify-end mt-6">
          <Button
            disabled={!ack}
            onClick={() => {
              onAcknowledge();
              onClose();
            }}
          >
            Aceptar y Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
