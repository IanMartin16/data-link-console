"use client";

import Link from "next/link";
import { useState } from "react";
import { downloadJobFile } from "@/lib/api/jobs";
import { getProcessingTime } from "@/lib/timeUtils";
import { formatNumber } from "@/lib/format";
import type { Job } from "@/lib/types";
import JobStatusPill from "./JobStatusPill";
import styles from "./JobsTable.module.css";

/** Presentacional: recibe los jobs ya normalizados. */
export default function JobsTable({ jobs }: { jobs: Job[] }) {
  const [failed, setFailed] = useState<string | null>(null);

  async function handleDownload(id: string) {
    setFailed(null);
    try {
      await downloadJobFile(id);
    } catch {
      setFailed(id);
    }
  }

  return (
    <>
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>File</th>
              <th>Operation</th>
              <th>Status</th>
              <th>Records</th>
              <th>Reduction</th>
              <th>Time</th>
              <th>Expires</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>
                  <Link href={`/app/jobs/${job.id}`} className={styles.fileName}>
                    {job.fileName}
                  </Link>
                  <small className={styles.meta}>
                    {job.format?.toUpperCase() ?? "—"}
                    {job.fileSizeMb != null && ` · ${job.fileSizeMb} MB`}
                  </small>
                </td>
                <td className={styles.meta}>{job.preset ?? "—"}</td>
                <td>
                  <JobStatusPill status={job.status} />
                </td>
                <td>{formatNumber(job.stats.totalRecords)}</td>
                <td className={styles.reduction}>
                  {job.stats.reductionPct != null ? `${job.stats.reductionPct}%` : "—"}
                </td>
                <td>{getProcessingTime(job.raw) || "—"}</td>
                <td>
                  {job.filesDeleted
                    ? "Expired"
                    : job.expiresAt
                      ? new Date(job.expiresAt).toLocaleString()
                      : "—"}
                </td>
                <td>
                  {job.canDownload ? (
                    <button className={styles.link} onClick={() => handleDownload(job.id)}>
                      Download
                    </button>
                  ) : job.status === "failed" ? (
                    <Link href={`/app/jobs/${job.id}`} className={styles.link}>
                      View error
                    </Link>
                  ) : (
                    <span className={styles.muted}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {failed && (
        <p className={styles.error} role="alert">
          That file is no longer available. Results are kept for 24 hours.
        </p>
      )}
    </>
  );
}
