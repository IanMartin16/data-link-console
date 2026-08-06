"use client";

import { useCallback, useEffect, useState } from "react";
import { clearApiKey, getStoredApiKey, saveApiKey } from "@/lib/api/apiKeyStore";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/**
 * Credencial actual del producto: la API key en localStorage.
 * localStorage no existe en el server, por eso el estado arranca en "loading"
 * y se resuelve en el primer efecto del cliente.
 */
export function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const stored = getStoredApiKey();
    setApiKey(stored);
    setStatus(stored ? "authenticated" : "unauthenticated");
  }, []);

  const signIn = useCallback((key: string) => {
    saveApiKey(key);
    setApiKey(key);
    setStatus("authenticated");
  }, []);

  const signOut = useCallback(() => {
    clearApiKey();
    setApiKey(null);
    setStatus("unauthenticated");
  }, []);

  return { apiKey, status, signIn, signOut };
}
