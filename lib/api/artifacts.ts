import { apiFetch } from "./client";
import type { Engine, FileProfile } from "@/lib/types";

/**
 * Subida en dos pasos: el backend firma una URL y el archivo va directo
 * al bucket. Con 100 MB esto evita que el archivo atraviese la API.
 */
export async function uploadFile(file: File, engine: Engine = "core"): Promise<FileProfile> {
  const { uploadUrl, artifactId } = await apiFetch<{ uploadUrl: string; artifactId: string }>(
    "/v1/artifacts",
    { engine, method: "POST", body: { fileName: file.name, sizeBytes: file.size } },
  );

  const put = await fetch(uploadUrl, { method: "PUT", body: file });
  if (!put.ok) throw new Error("No se pudo subir el archivo al bucket");

  return apiFetch<FileProfile>(`/v1/artifacts/${artifactId}/profile`, { engine });
}
