"use client";

import { useEffect, useState } from "react";
import type { JobStatus } from "@/lib/types";
import styles from "./JobProgress.module.css";

const STEPS = [
  { key: "uploaded", label: "Uploaded", detail: "File received" },
  { key: "queued", label: "Queued", detail: "Waiting for a worker" },
  { key: "processing", label: "Processing", detail: "Cleaning your data" },
  { key: "done", label: "Done", detail: "Result ready to download" },
] as const;

function currentStep(status: JobStatus): number {
  if (status === "pending") return 1;
  if (status === "processing") return 2;
  return 3;
}

/** Segundos transcurridos desde que se creo el job, para que la espera se vea viva. */
function useElapsed(startedAt: string | null, active: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  if (!startedAt) return null;
  const started = Date.parse(startedAt);
  if (Number.isNaN(started)) return null;
  return Math.max(0, Math.round((now - started) / 1000));
}

export default function JobProgress({
  status,
  createdAt,
}: {
  status: JobStatus;
  createdAt: string | null;
}) {
  const active = status === "pending" || status === "processing";
  const index = currentStep(status);
  const elapsed = useElapsed(createdAt, active);
  const step = STEPS[index];

  return (
    <div className={styles.wrap}>
      <ol className={styles.steps}>
        {STEPS.map((s, i) => (
          <li
            key={s.key}
            className={i < index ? styles.done : i === index ? styles.current : styles.pending}
            aria-current={i === index ? "step" : undefined}
          >
            <span className={styles.dot} aria-hidden />
            <span className={styles.label}>{s.label}</span>
          </li>
        ))}
      </ol>

      <p className={styles.detail}>
        {step.detail}
        {elapsed !== null && elapsed > 2 && (
          <span className={styles.elapsed}> · {elapsed}s elapsed</span>
        )}
      </p>
    </div>
  );
}
