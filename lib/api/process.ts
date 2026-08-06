import { apiFetch } from "./client";
import type { Engine, Job, JobResponse } from "@/lib/types";

export interface ProcessFileParams {
  file: File;
  format: string;
  preset: string;
  filterField?: string;
  filterValue?: string;
  filterOperator?: string;
}

/**
 * Contrato actual de core: multipart contra /api/v1/process, una operacion
 * por llamada. Cuando exista POST /v1/artifacts + recetas, esto se reemplaza
 * por upload firmado + createJob(steps).
 */
export async function processFile(
  params: ProcessFileParams,
  engine: Engine = "core",
): Promise<JobResponse> {
  const form = new FormData();
  form.append("file", params.file);
  form.append("format", params.format);
  form.append("preset", params.preset);
  if (params.filterField) form.append("filter_field", params.filterField);
  if (params.filterValue) form.append("filter_value", params.filterValue);
  if (params.filterOperator) form.append("filter_operator", params.filterOperator);

  return apiFetch<JobResponse>("/api/v1/process", { engine, method: "POST", raw: form });
}
