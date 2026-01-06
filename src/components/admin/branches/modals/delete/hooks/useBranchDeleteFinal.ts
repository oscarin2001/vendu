"use client";

import { useState } from "react";

interface UseBranchDeleteFinalProps {
  branchName: string;
  onConfirm: (password: string) => void;
}

export function useBranchDeleteFinal({
  branchName,
  onConfirm,
}: UseBranchDeleteFinalProps) {
  const [password, setPassword] = useState("");
  const [branchNameInput, setBranchNameInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");

  const validateAndConfirm = () => {
    let hasError = false;

    if (!password.trim()) {
      setPasswordError("La contraseña es requerida");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!branchNameInput.trim()) {
      setNameError("Debes escribir el nombre de la sucursal");
      hasError = true;
    } else if (branchNameInput.trim() !== branchName) {
      setNameError("El nombre no coincide exactamente");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!hasError) {
      onConfirm(password);
    }
  };

  const resetForm = () => {
    setPassword("");
    setBranchNameInput("");
    setPasswordError("");
    setNameError("");
  };

  return {
    password,
    setPassword,
    branchNameInput,
    setBranchNameInput,
    passwordError,
    nameError,
    validateAndConfirm,
    resetForm,
  };
}
