"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";
import { buildPhoneGroups, formatPhonePattern } from "@/lib/utils";

export type PhoneInputProps = {
  value?: string; // full value like "59112345678"
  onChange?: (val: string, valid: boolean) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showValidation?: boolean;
  // If provided, lock the country prefix (non-editable) and force local length
  fixedCountryCode?: string; // e.g. "591"
  fixedLocalMax?: number; // e.g. 8
  hideCountrySelect?: boolean; // hide the dropdown and show prefix as static
  // Show the format hint (e.g. "+591 XXXX XXXX") below the input
  showFormatHint?: boolean;
};

export const COUNTRIES = [
  { code: "54", name: "Argentina", flag: "🇦🇷", local: 9 },
  { code: "591", name: "Bolivia", flag: "🇧🇴", local: 8 },
  { code: "56", name: "Chile", flag: "🇨🇱", local: 9 },
  { code: "57", name: "Colombia", flag: "🇨🇴", local: 10 },
  { code: "506", name: "Costa Rica", flag: "🇨🇷", local: 8 },
  { code: "53", name: "Cuba", flag: "🇨🇺", local: 8 },
  { code: "593", name: "Ecuador", flag: "🇪🇨", local: 9 },
  { code: "503", name: "El Salvador", flag: "🇸🇻", local: 8 },
  { code: "502", name: "Guatemala", flag: "🇬🇹", local: 8 },
  { code: "504", name: "Honduras", flag: "🇭🇳", local: 8 },
  { code: "52", name: "Mexico", flag: "🇲🇽", local: 10 },
  { code: "505", name: "Nicaragua", flag: "🇳🇮", local: 8 },
  { code: "507", name: "Panama", flag: "🇵🇦", local: 8 },
  { code: "595", name: "Paraguay", flag: "🇵🇾", local: 9 },
  { code: "51", name: "Peru", flag: "🇵🇪", local: 9 },
  { code: "1", name: "Puerto Rico/DR (1)", flag: "🇵🇷", local: 10 },
  { code: "598", name: "Uruguay", flag: "🇺🇾", local: 8 },
  { code: "58", name: "Venezuela", flag: "🇻🇪", local: 10 },
];

export function PhoneInput({
  value = "",
  onChange,
  placeholder,
  required,
  className = "",
  showValidation = false,
  fixedCountryCode,
  fixedLocalMax,
  hideCountrySelect = false,
  showFormatHint = true,
}: PhoneInputProps) {
  const initialCountry = fixedCountryCode || COUNTRIES[0].code;
  const initialLocalMax =
    fixedLocalMax ??
    COUNTRIES.find((c) => c.code === initialCountry)?.local ??
    COUNTRIES[0].local;
  const [country, setCountry] = useState<string>(initialCountry);
  const [local, setLocal] = useState<string>("");
  const [localMax, setLocalMax] = useState<number>(initialLocalMax);
  const lastPropRef = useRef<string | null>(null);
  // keep track of last value we notified the parent about to avoid cycles
  const lastNotifiedRef = useRef<string | null>(null);

  // When fixed props change, update internal state
  useEffect(() => {
    if (fixedCountryCode) {
      setCountry(fixedCountryCode);
    }
    if (typeof fixedLocalMax === "number") {
      setLocalMax(fixedLocalMax);
    }
  }, [fixedCountryCode, fixedLocalMax]);

  useEffect(() => {
    const digits = (value || "").replace(/\D/g, "");
    if (!digits) return;
    // if this digits string is what we last notified the parent about, skip
    if (lastNotifiedRef.current === digits) return;
    // avoid re-processing the same incoming prop repeatedly
    if (lastPropRef.current === digits) return;
    lastPropRef.current = digits;

    const currentCombined = `${country}${local}`;
    if (digits === currentCombined) return;
    const found = COUNTRIES.find((c) => digits.startsWith(c.code));
    if (found) {
      const newLocal = digits.slice(found.code.length);
      if (found.code !== country || newLocal !== local) {
        // mark as notified to avoid re-notifying parent when we set state
        lastNotifiedRef.current = digits;
        setCountry(found.code);
        setLocal(newLocal);
        setLocalMax(found.local);
      }
    }
  }, [value]);
  useEffect(() => {
    const combined = `${country}${local}`;
    const valid = local.length === localMax;
    if (!onChange) return;
    if (lastNotifiedRef.current !== combined) {
      lastNotifiedRef.current = combined;
      onChange(combined, valid);
    }
  }, [country, local, localMax, onChange]);

  const handleCountry = (c: string) => {
    const found = COUNTRIES.find((x) => x.code === c) || COUNTRIES[0];
    const newLocal =
      local.length > found.local ? local.slice(0, found.local) : local;
    setCountry(found.code);
    setLocalMax(found.local);
    setLocal(newLocal);
    const combined = `${found.code}${newLocal}`;
    const valid = newLocal.length === found.local;
    onChange?.(combined, valid);
    lastNotifiedRef.current = combined;
  };

  const handleLocal = (v: string) => {
    let digits = v.replace(/\D/g, "");

    // If user pasted or typed a full number starting with a known country code,
    // detect and extract country + local portion.
    const maybeCountry = COUNTRIES.find((c) => digits.startsWith(c.code));
    if (maybeCountry && digits.length > maybeCountry.local) {
      // switch country and set local to the following digits
      const newLocal = digits.slice(
        maybeCountry.code.length,
        maybeCountry.code.length + maybeCountry.local
      );
      setCountry(maybeCountry.code);
      setLocalMax(maybeCountry.local);
      setLocal(newLocal);
      const combined = `${maybeCountry.code}${newLocal}`;
      const valid = newLocal.length === maybeCountry.local;
      onChange?.(combined, valid);
      lastNotifiedRef.current = combined;
      return;
    }

    // If user accidentally typed the country prefix into the local input, strip it
    if (digits.startsWith(country)) {
      digits = digits.slice(country.length);
    }

    // enforce maxlength
    const cleaned = digits.slice(0, localMax);
    setLocal(cleaned);
    const combined = `${country}${cleaned}`;
    const valid = cleaned.length === localMax;
    onChange?.(combined, valid);
    lastNotifiedRef.current = combined;
  };

  const currentCountry =
    COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];

  const formatLocalForDisplay = (digits: string, len: number) => {
    const cleaned = digits.replace(/\D/g, "").slice(0, len);
    const groups = buildPhoneGroups(len);
    const parts: string[] = [];
    let idx = 0;
    for (const g of groups) {
      const part = cleaned.slice(idx, idx + g);
      if (!part) break;
      parts.push(part);
      idx += g;
    }
    return parts.join(" ");
  };

  const isInvalid =
    showValidation && local.length > 0 && local.length !== localMax;

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div
        className={`flex items-center rounded-md px-1 py-1 min-w-0 w-full ${
          isInvalid ? "border-red-600" : "border"
        }`}
      >
        {!hideCountrySelect ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-36 justify-start rounded-l-md px-3 py-2 border-none min-w-0 flex-shrink-0"
              >
                <span className="mr-2">{currentCountry.flag}</span>
                <span className="font-medium">+{currentCountry.code}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {COUNTRIES.map((c) => (
                <DropdownMenuItem
                  key={c.code}
                  onClick={() => handleCountry(c.code)}
                >
                  <span className="mr-2">{c.flag}</span>
                  <span className="font-medium">+{c.code}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {c.name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="w-36 px-3 py-2 flex items-center rounded-l-md bg-muted text-sm">
            <span className="mr-2">{currentCountry.flag}</span>
            <span className="font-medium">+{currentCountry.code}</span>
          </div>
        )}

        <input
          aria-label="número local"
          className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm outline-none"
          value={formatLocalForDisplay(local, localMax)}
          onChange={(e) => handleLocal(e.target.value)}
          placeholder={
            placeholder ?? `Ej. ${formatPhonePattern(currentCountry.local)}`
          }
          inputMode="numeric"
          maxLength={formatPhonePattern(currentCountry.local).replace(/\s/g, "").length}
          required={required}
        />
      </div>

      {showValidation && local.length > 0 && local.length !== localMax && (
        <p className="mt-1 text-xs text-red-600">{`Faltan ${
          localMax - local.length
        } dígitos`}</p>
      )}

      {/* Format hint (per-country) */}
      {showFormatHint && (
        <p className="mt-1 text-sm text-muted-foreground">
          {hideCountrySelect || fixedCountryCode
            ? formatPhonePattern(currentCountry.local)
            : `+${currentCountry.code} ${formatPhonePattern(
                currentCountry.local
              )}`}
        </p>
      )}
    </div>
  );
}
