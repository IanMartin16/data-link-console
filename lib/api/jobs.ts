import { apiFetch, baseUrl } from "./client";
import type { Engine, Job, JobListResponse, JobPage, JobResponse, JobStatus } from "@/lib/types";

/** El backend manda el status en MAYUSCULAS; adentro se usa en minusculas. */
export function toJob(raw: JobResponse, engine: Engine = "core"): Job {
  const stats = raw.stats ?? {};
  const expired = raw.files_deleted === true;

  return {
    id: raw.job_id,
    engine,
    fileName: raw.original_file_name ?? "—",
    format: raw.format ?? null,
    fileSizeMb: raw.file_size_mb ?? null,
    preset: raw.preset ?? null,
    status: expired
      ? "expired"
      : ((raw.status?.toLowerCase() as JobStatus) ?? "pending"),
    stats: {
      totalRecords: stats.total_records ?? raw.total_records ?? null,
      duplicatesRemoved: stats.duplicates_removed ?? raw.duplicates_removed ?? null,
      recordsFiltered: raw.records_filtered ?? null,
      recordsKept: stats.records_kept ?? raw.records_kept ?? null,
      reductionPct: stats.reduction_percentage ?? raw.reduction_percentage ?? null,
    },
    createdAt: raw.created_at ?? null,
    startedAt: raw.started_at ?? null,
    completedAt: raw.completed_at ?? null,
    expiresAt: raw.expires_at ?? null,
    filesDeleted: expired,
    canDownload: raw.can_download === true,
    downloadUrl: raw.download_url ?? null,
    error: raw.error ?? null,
    raw,
  };
}

export interface ListJobsParams {
  limit?: number;
  offset?: number;
  /** Se manda al backend en MAYUSCULAS. */
  status?: JobStatus | null;
}

/**
 * GET /api/v1/jobs — paginado. Responde { items, total, limit, offset }.
 * `expired` no es un status del backend: se deriva de files_deleted, asi que
 * no se manda como filtro.
 */
export async function listJobs(
  { limit = 20, offset = 0, status = null }: ListJobsParams = {},
  engine: Engine = "core",
): Promise<JobPage> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (status && status !== "expired") {
    params.set("status", status.toUpperCase());
  }

  const raw = await apiFetch<JobListResponse>(`/api/v1/jobs?${params}`, { engine });

  return {
    jobs: (raw.items ?? []).map((j) => toJob(j, engine)),
    total: raw.total ?? 0,
    limit: raw.limit ?? limit,
    offset: raw.offset ?? offset,
  };
}

export async function getJob(jobId: string, engine: Engine = "core"): Promise<Job> {
  return toJob(await apiFetch<JobResponse>(`/api/v1/jobs/${jobId}`, { engine }), engine);
}

export function getJobDownloadUrl(jobId: string, engine: Engine = "core") {
  return apiFetch<{ download_url?: string }>(`/api/v1/jobs/${jobId}/download-url`, { engine });
}

export function absoluteUrl(pathOrUrl: string, engine: Engine = "core") {
  return pathOrUrl.startsWith("http") ? pathOrUrl : `${baseUrl(engine)}${pathOrUrl}`;
}

export async function downloadJobFile(jobId: string, engine: Engine = "core") {
  const data = await getJobDownloadUrl(jobId, engine);
  if (!data.download_url) throw new Error("File expired or not available for download.");
  window.open(absoluteUrl(data.download_url, engine), "_blank", "noopener,noreferrer");
}
