import type { JobStatus } from "@/lib/types";
import styles from "./JobStatusPill.module.css";

const LABEL: Record<JobStatus, string> = {
  pending: "Queued",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  expired: "Expired",
};

export default function JobStatusPill({ status }: { status: JobStatus }) {
  return <span className={`${styles.pill} ${styles[status]}`}>{LABEL[status]}</span>;
}
