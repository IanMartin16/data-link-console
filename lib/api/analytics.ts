import { apiFetch } from "./client";
import type { Analytics, AnalyticsResponse } from "@/lib/types";

export async function getAnalytics(): Promise<Analytics> {
  const raw = await apiFetch<AnalyticsResponse>("/api/v1/analytics/summary");

  const usage = raw.usage ?? {};
  const limits = raw.limits ?? {};
  const impact = raw.impact ?? {};

  // El backend manda el string "unlimited" en vez de un numero.
  const rawLimit = limits.files_per_month;
  const isUnlimited = rawLimit === "unlimited";

  return {
    filesThisMonth: usage.files_processed_this_month ?? 0,
    filesTotal: usage.files_processed_total ?? 0,
    usagePercentage: usage.usage_percentage ?? 0,
    lastResetDate: usage.last_reset_date ?? null,
    filesPerMonth: isUnlimited || typeof rawLimit !== "number" ? null : rawLimit,
    isUnlimited,
    requestsPerHour: limits.requests_per_hour ?? null,
    totalJobs: impact.total_jobs ?? 0,
    completedJobs: impact.completed_jobs ?? 0,
    failedJobs: impact.failed_jobs ?? 0,
    recordsProcessed: impact.total_records_processed ?? 0,
    duplicatesRemoved: impact.duplicates_removed ?? 0,
    recordsFiltered: impact.records_filtered ?? 0,
    recordsKept: impact.records_kept ?? 0,
    averageReductionPct: impact.average_reduction_percentage ?? 0,
    lastJob: raw.last_job
      ? {
          id: raw.last_job.job_id,
          status: raw.last_job.status,
          fileName: raw.last_job.original_file_name ?? null,
          createdAt: raw.last_job.created_at ?? null,
        }
      : null,
  };
}
