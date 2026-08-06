/** dl_lso************7DXg — nunca mostrar la key completa en pantalla. */
export function maskApiKey(key: string | null, lead = 6, tail = 4): string {
  if (!key) return "No API key";
  if (key.length <= lead + tail) return key;
  return `${key.slice(0, lead)}${"*".repeat(12)}${key.slice(-tail)}`;
}

export function formatNumber(n: number | null | undefined): string {
  return typeof n === "number" ? n.toLocaleString("en-US") : "—";
}

export function formatDuration(ms: number | null | undefined): string {
  if (typeof ms !== "number") return "—";
  if (ms < 1000) return `${ms} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)} s`;
  return `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
}
