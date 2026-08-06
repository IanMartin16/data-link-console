import { apiFetch } from "./client";
import { toJob } from "./jobs";
import type { DashboardData, DashboardResponse } from "@/lib/types";

/**
 * Una sola llamada trae todo: plan, limites, uso, catalogo de presets,
 * key enmascarada y los jobs recientes. No hay GET /api/v1/jobs separado.
 */
export async function getDashboard(): Promise<DashboardData> {
  const raw = await apiFetch<DashboardResponse>("/api/v1/dashboard");

  const limits = raw.limits ?? {};
  const usage = raw.usage ?? {};
  const billing = raw.billing ?? {};

  return {
    plan: raw.user?.plan ?? "free",
    planStatus: billing.status ?? "active",
    canUpgrade: billing.can_upgrade ?? false,
    apiKeyMasked: raw.api_key?.masked ?? null,
    filesUsed: usage.files_used ?? 0,
    filesLimit: limits.files_per_month ?? 0,
    maxFileSizeMb: limits.max_file_size_mb ?? 0,
    maxRecordsPerFile: limits.max_records_per_file ?? 0,
    recordsProcessed: usage.records_processed ?? 0,
    duplicatesRemoved: usage.duplicates_removed ?? 0,
    serviceStatus: raw.service?.status ?? "operational",
    limits: {
      filesPerMonth: limits.files_per_month ?? 0,
      maxFileSizeMb: limits.max_file_size_mb ?? 0,
      maxRecordsPerFile: limits.max_records_per_file ?? 0,
      customFiltersAllowed: limits.custom_filters_allowed ?? false,
    },
    presets: raw.presets ?? [],
    recentJobs: (raw.recent_jobs ?? []).map((j) => toJob(j, "core")),
    engine: "core",
  };
}
