"use client";

import Link from "next/link";
import { useState } from "react";
import { useJobs } from "@/hooks/useJobs";
import type { JobStatus } from "@/lib/types";
import JobsTable from "./JobsTable";
import styles from "./JobsList.module.css";

const PAGE_SIZE = 20;

const FILTERS: { label: string; value: JobStatus | null }[] = [
  { label: "All", value: null },
  { label: "Completed", value: "completed" },
  { label: "Processing", value: "processing" },
  { label: "Failed", value: "failed" },
];

export default function JobsList() {
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState<JobStatus | null>(null);
  const { jobs, total, isLoading, error } = useJobs(PAGE_SIZE, offset, status);

  function changeFilter(next: JobStatus | null) {
    setStatus(next);
    setOffset(0);
  }

  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);
  const hasPrev = offset > 0;
  const hasNext = offset + PAGE_SIZE < total;

  if (error) return <p className={styles.error}>Jobs could not be loaded.</p>;

  // Sin filtro y sin resultados: la cuenta esta vacia de verdad.
  if (!isLoading && total === 0 && status === null) {
    return (
      <div className={styles.empty}>
        <h2 className={styles.emptyTitle}>No files processed yet</h2>
        <p className={styles.muted}>Upload a CSV or JSON file to get started.</p>
        <Link href="/app/new" className={styles.cta}>
          Process a file
        </Link>
      </div>
    );
  }

  return (
    <section>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Jobs</h2>
          <p className={styles.muted}>Your processed files and cleanup status.</p>
        </div>

        <div className={styles.filters} role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => changeFilter(f.value)}
              className={status === f.value ? styles.filterActive : styles.filter}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {isLoading && jobs.length === 0 ? (
        <p className={styles.muted}>Loading jobs…</p>
      ) : jobs.length === 0 ? (
        <p className={styles.muted}>No jobs match this filter.</p>
      ) : (
        <JobsTable jobs={jobs} />
      )}

      {total > PAGE_SIZE && (
        <footer className={styles.pager}>
          <span className={styles.muted}>
            {from}–{to} of {total}
          </span>
          <div className={styles.pagerButtons}>
            <button
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              disabled={!hasPrev}
              className={styles.pageButton}
            >
              Previous
            </button>
            <button
              onClick={() => setOffset(offset + PAGE_SIZE)}
              disabled={!hasNext}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </footer>
      )}
    </section>
  );
}
