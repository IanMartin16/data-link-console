"use client";

import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatNumber } from "@/lib/format";
import styles from "./UsagePanel.module.css";

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString();
}

export default function UsagePanel() {
  const { analytics, isLoading, error } = useAnalytics();

  if (isLoading) return <p className={styles.muted}>Loading…</p>;
  if (error || !analytics) return <p className={styles.error}>Usage data unavailable.</p>;

  const a = analytics;
  const removed = a.duplicatesRemoved + a.recordsFiltered;
  const hasHistory = a.totalJobs > 0;
  const quotaPct = Math.min(a.usagePercentage, 100);
  const resetDate = formatDate(a.lastResetDate);

  if (!hasHistory) {
    return (
      <div className={styles.empty}>
        <h2 className={styles.emptyTitle}>Nothing measured yet</h2>
        <p className={styles.muted}>
          Impact numbers appear here after your first file is processed.
        </p>
        <Link href="/app/new" className={styles.cta}>
          Process a file
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.heroLabel}>Rows removed from your data so far</p>
        <p className={styles.heroValue}>{formatNumber(removed)}</p>
        <p className={styles.muted}>
          Out of {formatNumber(a.recordsProcessed)} records analyzed across{" "}
          {formatNumber(a.completedJobs)} completed {a.completedJobs === 1 ? "file" : "files"} —
          an average reduction of {a.averageReductionPct}%.
        </p>
      </section>

      <section className={styles.strip}>
        <div>
          <dt>Duplicates removed</dt>
          <dd>{formatNumber(a.duplicatesRemoved)}</dd>
        </div>
        <div>
          <dt>Filtered out</dt>
          <dd>{formatNumber(a.recordsFiltered)}</dd>
        </div>
        <div>
          <dt>Records kept</dt>
          <dd>{formatNumber(a.recordsKept)}</dd>
        </div>
        <div>
          <dt>Files all time</dt>
          <dd>{formatNumber(a.filesTotal)}</dd>
        </div>
        {a.failedJobs > 0 && (
          <div>
            <dt>Failed jobs</dt>
            <dd className={styles.failed}>{formatNumber(a.failedJobs)}</dd>
          </div>
        )}
      </section>

      <section className={styles.quota}>
        <div className={styles.quotaHead}>
          <h2 className={styles.quotaTitle}>This month</h2>
          <span className={styles.muted}>
            {a.isUnlimited
              ? `${formatNumber(a.filesThisMonth)} files · no monthly limit`
              : `${formatNumber(a.filesThisMonth)} of ${formatNumber(a.filesPerMonth ?? 0)} files`}
          </span>
        </div>

        {!a.isUnlimited && (
          <div
            className={styles.meter}
            role="progressbar"
            aria-valuenow={Math.round(quotaPct)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span
              className={quotaPct >= 90 ? styles.fillWarn : styles.fill}
              style={{ width: `${quotaPct}%` }}
            />
          </div>
        )}

        <p className={styles.note}>
          {resetDate && `Counter last reset on ${resetDate}. `}
          {a.requestsPerHour && `Your plan allows ${formatNumber(a.requestsPerHour)} API requests per hour.`}
        </p>

        {!a.isUnlimited && quotaPct >= 80 && (
          <Link href="/app/billing" className={styles.cta}>
            Raise your limit
          </Link>
        )}
      </section>

      {a.lastJob && (
        <p className={styles.lastJob}>
          Last file:{" "}
          <Link href={`/app/jobs/${a.lastJob.id}`}>{a.lastJob.fileName ?? a.lastJob.id}</Link>
        </p>
      )}
    </div>
  );
}
