"use client";

import Link from "next/link";
import { useState } from "react";
import { useJobPolling } from "@/hooks/useJobPolling";
import { downloadJobFile } from "@/lib/api/jobs";
import { getProcessingTime, getTotalTime } from "@/lib/timeUtils";
import { formatNumber } from "@/lib/format";
import JobProgress from "./JobProgress";
import styles from "./JobDetail.module.css";

export default function JobDetail({ jobId }: { jobId: string }) {
  const { job, isLoading, error } = useJobPolling(jobId);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (isLoading) return <p className={styles.muted}>Loading job…</p>;
  if (error || !job) return <p className={styles.error}>This job could not be loaded.</p>;

  if (job.status === "pending" || job.status === "processing") {
    return (
      <section className={styles.card}>
        <h2 className={styles.title}>{job.fileName}</h2>
        <p className={styles.muted}>This page updates on its own.</p>
        <div className={styles.progress}>
          <JobProgress status={job.status} createdAt={job.createdAt} />
        </div>
      </section>
    );
  }

  if (job.status === "failed") {
    return (
      <section className={`${styles.card} ${styles.failed}`}>
        <h2 className={styles.title}>Processing failed</h2>
        <p className={styles.muted}>{job.error ?? "The job failed. Try running it again."}</p>
        <Link href="/app/new" className={styles.primary}>
          Try again
        </Link>
      </section>
    );
  }

  const processingTime = getProcessingTime(job.raw);
  const totalTime = getTotalTime(job.raw);

  async function handleDownload() {
    setDownloadError(null);
    try {
      await downloadJobFile(job!.id);
    } catch (e) {
      setDownloadError(e instanceof Error ? e.message : "Download failed.");
    }
  }

  return (
    <section className={styles.card}>
      <header>
        <h2 className={styles.title}>{job.fileName}</h2>
        <p className={styles.muted}>
          {formatNumber(job.stats.totalRecords)} records analyzed
          {processingTime && ` in ${processingTime}`}.
        </p>
      </header>

      <dl className={styles.grid}>
        <div>
          <dt>Total records</dt>
          <dd>{formatNumber(job.stats.totalRecords)}</dd>
        </div>
        <div>
          <dt>Duplicates removed</dt>
          <dd>{formatNumber(job.stats.duplicatesRemoved)}</dd>
        </div>
        <div>
          <dt>Records kept</dt>
          <dd>{formatNumber(job.stats.recordsKept)}</dd>
        </div>
        <div>
          <dt>Reduction</dt>
          <dd>{job.stats.reductionPct ?? 0}%</dd>
        </div>
        <div>
          <dt>Process time</dt>
          <dd>{processingTime || "—"}</dd>
        </div>
      </dl>

      {totalTime && (
        <p className={styles.note}>
          Total job time: {totalTime}, including queue and worker pickup.
        </p>
      )}

      {job.canDownload ? (
        <button className={styles.primary} onClick={handleDownload}>
          Download cleaned file
        </button>
      ) : (
        <p className={styles.note}>
          The file was deleted. Results stay available for 24 hours after processing.
        </p>
      )}

      {downloadError && (
        <p className={styles.error} role="alert">
          {downloadError}
        </p>
      )}
    </section>
  );
}
