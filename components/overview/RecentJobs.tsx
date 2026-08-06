"use client";

import Link from "next/link";
import { useJobs } from "@/hooks/useJobs";
import JobsTable from "@/components/jobs/JobsTable";
import styles from "./RecentJobs.module.css";

const PREVIEW = 5;

/** Vista previa en el Overview. La tabla completa vive en /app/jobs. */
export default function RecentJobs() {
  const { jobs, total, isLoading } = useJobs(PREVIEW, 0, null);

  if (isLoading && jobs.length === 0) return null;

  if (total === 0) {
    return (
      <section className={styles.empty}>
        <p className={styles.muted}>
          Your processed files will show up here, with what was removed and when the
          result expires.
        </p>
      </section>
    );
  }

  return (
    <section>
      <header className={styles.header}>
        <h2 className={styles.title}>Recent jobs</h2>
        {total > PREVIEW && (
          <Link href="/app/jobs" className={styles.link}>
            View all {total} →
          </Link>
        )}
      </header>
      <JobsTable jobs={jobs} />
    </section>
  );
}
