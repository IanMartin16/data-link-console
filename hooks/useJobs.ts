"use client";

import useSWR from "swr";
import { listJobs } from "@/lib/api/jobs";
import type { Job, JobPage, JobStatus } from "@/lib/types";

const ACTIVE: JobStatus[] = ["pending", "processing"];

export function useJobs(limit: number, offset: number, status: JobStatus | null) {
  const { data, error, isLoading, mutate } = useSWR<JobPage>(
    ["jobs", limit, offset, status],
    () => listJobs({ limit, offset, status }),
    {
      keepPreviousData: true,
      // Solo sondea mientras haya algun job vivo en la pagina actual.
      refreshInterval: (page) =>
        page?.jobs.some((j: Job) => ACTIVE.includes(j.status)) ? 5000 : 0,
    },
  );

  return {
    jobs: data?.jobs ?? [],
    total: data?.total ?? 0,
    error,
    isLoading,
    refresh: mutate,
  };
}
