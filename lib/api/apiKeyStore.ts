/**
 * TRANSITORIO. Hoy la API key es la credencial de acceso y vive en localStorage.
 * Cuando NextAuth entre, la sesion pasa a ser la credencial y este modulo se
 * borra: la key deja de ser la puerta y se vuelve un recurso de /app/keys.
 *
 * Mientras tanto, `client.ts` no lo importa a proposito — el header se inyecta
 * desde el componente que lo necesite, para que la dependencia sea visible.
 */
const STORAGE_KEY = "datalink_api_key";

export function getStoredApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function saveApiKey(apiKey: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, apiKey);
}

export function clearApiKey() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/** Header de transicion: pasarlo a las llamadas que aun dependen de la key. */
export function apiKeyHeader(): Record<string, string> {
  const key = getStoredApiKey();
  return key ? { "X-API-Key": key } : {};
}
