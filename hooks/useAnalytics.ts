"use client";

import useSWR from "swr";
import { getAnalytics } from "@/lib/api/analytics";
import type { Analytics } from "@/lib/types";

export function useAnalytics() {
  const { data, error, isLoading, mutate } = useSWR<Analytics>("analytics", getAnalytics, {
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  });
  return { analytics: data, error, isLoading, refresh: mutate };
}
