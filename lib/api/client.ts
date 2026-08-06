import { clearApiKey, getStoredApiKey } from "./apiKeyStore";
import type { Engine } from "@/lib/types";

const BASE: Record<Engine, string | undefined> = {
  core: process.env.NEXT_PUBLIC_CORE_API_URL,
  transform: process.env.NEXT_PUBLIC_TRANSFORM_API_URL,
};

export function baseUrl(engine: Engine = "core") {
  const base = BASE[engine];
  if (!base) throw new ApiError(0, `Motor "${engine}" sin URL configurada`);

  // Sin esquema, fetch lo trata como ruta relativa y pega contra el propio front.
  if (!/^https?:\/\//.test(base)) {
    throw new ApiError(
      0,
      `La URL del motor "${engine}" debe incluir https:// — recibido: ${base}`,
    );
  }

  return base.replace(/\/+$/, "");
}

/** FastAPI devuelve `detail` como string o como array de errores de validacion. */
export function extractApiError(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const b = body as Record<string, unknown>;

  if (Array.isArray(b.detail)) {
    return b.detail
      .map((item) => {
        if (item && typeof item === "object") {
          const i = item as Record<string, unknown>;
          return String(i.msg ?? i.detail ?? "Error de validación");
        }
        return "Error de validación";
      })
      .join(", ");
  }
  if (typeof b.detail === "string") return b.detail;
  if (typeof b.message === "string") return b.message;
  return fallback;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
  /** 402 = tope del plan. La UI lo convierte en upsell, no en pantalla de error. */
  get isPlanLimit() {
    return this.status === 402;
  }
  get isUnauthorized() {
    return this.status === 401 || this.status === 403;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  engine?: Engine;
  /** JSON. Para multipart usa `raw` y manda el FormData tal cual. */
  body?: unknown;
  raw?: BodyInit;
}

function apiKeyHeader(): Record<string, string> {
  const key = getStoredApiKey();
  return key ? { "X-API-Key": key } : {};
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { engine = "core", body, raw, headers, ...rest } = options;

  // Sin `credentials: "include"`: la credencial es el header X-API-Key, no una
  // cookie. Pedir credenciales obliga al backend a devolver un origen exacto en
  // Access-Control-Allow-Origin, y con "*" el navegador bloquea la respuesta
  // aunque el servidor haya respondido 200.
  let res: Response;
  try {
    res = await fetch(`${baseUrl(engine)}${path}`, {
      ...rest,
      headers: {
        ...(raw ? {} : { "Content-Type": "application/json" }),
        ...apiKeyHeader(),
        ...headers,
      },
      body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
    });
  } catch {
    // Falla de red o bloqueo de CORS: nunca llegamos a ver un status.
    throw new ApiError(0, "Could not reach the Data_Link API. Check the connection or CORS.");
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const err = new ApiError(res.status, extractApiError(payload, `Error ${res.status}`), payload);

    // Key invalida o revocada: se descarta y se vuelve al acceso.
    if (err.isUnauthorized && typeof window !== "undefined") {
      clearApiKey();
      window.location.href = "/login";
    }

    throw err;
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
