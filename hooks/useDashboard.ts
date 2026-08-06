"use client";

import useSWR from "swr";
import { getDashboard } from "@/lib/api/dashboard";
import type { DashboardData } from "@/lib/types";

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>("dashboard", getDashboard, {
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  });
  return { dashboard: data, error, isLoading, refresh: mutate };
}
