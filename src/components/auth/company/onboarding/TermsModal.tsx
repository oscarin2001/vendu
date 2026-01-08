"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function TermsModal({
  open,
  onClose,
  onAcknowledge,
}: {
  open: boolean;
  onClose: () => void;
  onAcknowledge: () => void;
}) {
  const [terms, setTerms] = useState<string>("");
  const [aup, setAup] = useState<string>("");
  const [ack, setAck] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/legal/terms")
      .then((r) => r.json())
      .then((d) => setTerms(d.content || ""));
    fetch("/api/legal/aup")
      .then((r) => r.json())
      .then((d) => setAup(d.content || ""));
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-md shadow-lg p-6 overflow-auto max-h-[80vh]">
        <h3 className="text-lg font-bold mb-4">Términos de Uso</h3>
        <div className="prose mb-6">
          <div
            dangerouslySetInnerHTML={{ __html: terms.replace(/\n/g, "<br/>") }}
          />
        </div>

        <h4 className="text-md font-semibold mt-4">
          Política de Uso Aceptable (AUP)
        </h4>
        <div className="prose mb-6">
          <div
            dangerouslySetInnerHTML={{ __html: aup.replace(/\n/g, "<br/>") }}
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
          />
          <span>
            He leído los Términos de Uso y la Política de Uso Aceptable
          </span>
        </label>

        <div className="flex gap-2 justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            disabled={!ack}
            onClick={() => {
              onAcknowledge();
              onClose();
            }}
          >
            Marcar como leído y continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
