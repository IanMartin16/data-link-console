"use client";

import useSWR from "swr";
import { getJob } from "@/lib/api/jobs";
import type { Engine, Job } from "@/lib/types";

const ACTIVE: Job["status"][] = ["pending", "processing"];

/** Sondea mientras el job siga vivo y se detiene solo al terminar. */
export function useJobPolling(id: string | null, engine: Engine = "core") {
  const { data, error, isLoading } = useSWR<Job>(
    id ? ["job", id, engine] : null,
    () => getJob(id!, engine),
    { refreshInterval: (job) => (job && ACTIVE.includes(job.status) ? 2000 : 0) },
  );
  return { job: data, error, isLoading };
}
