"use client";

import { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { createCheckoutSession, openBillingPortal } from "@/lib/api/billing";
import { formatNumber } from "@/lib/format";
import styles from "./PlanPanel.module.css";

export default function PlanPanel({ onlyWhenUpgradable = false }: { onlyWhenUpgradable?: boolean } = {}) {
  const { dashboard, isLoading } = useDashboard();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return <p className={styles.muted}>Loading plan…</p>;
  if (!dashboard) return <p className={styles.muted}>Plan information unavailable.</p>;

  const { plan, canUpgrade, limits } = dashboard;

  // En el Overview no tiene caso ocupar espacio si ya esta en el tope.
  if (onlyWhenUpgradable && !canUpgrade) return null;

  async function handleUpgrade() {
    setBusy(true);
    setError(null);
    try {
      const data = await createCheckoutSession();
      const url = data.url ?? data.checkout_url;
      if (!url) throw new Error("Checkout URL was not returned.");
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected billing error.");
      setBusy(false);
    }
  }

  async function handleManage() {
    setBusy(true);
    setError(null);
    try {
      await openBillingPortal();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected billing error.");
      setBusy(false);
    }
  }

  return (
    <section className={styles.card}>
      <header>
        <h2 className={styles.title}>
          {canUpgrade ? "Upgrade to Starter" : `${plan.toUpperCase()} active`}
        </h2>
        <p className={styles.muted}>
          {canUpgrade
            ? "Process larger files, unlock every preset and use custom filters."
            : "Your plan covers larger files and custom filters."}
        </p>
      </header>

      <ul className={styles.features}>
        <li>{formatNumber(limits.filesPerMonth)} files per month</li>
        <li>{formatNumber(limits.maxFileSizeMb)} MB per file</li>
        <li>{formatNumber(limits.maxRecordsPerFile)} records per file</li>
        <li>Custom filters</li>
        <li>Files deleted after 24 hours</li>
      </ul>

      <div className={styles.actions}>
        {canUpgrade ? (
          <button className={styles.primary} onClick={handleUpgrade} disabled={busy}>
            {busy ? "Opening checkout…" : "Upgrade to Starter"}
          </button>
        ) : (
          <button className={styles.primary} onClick={handleManage} disabled={busy}>
            {busy ? "Opening billing…" : "Manage subscription"}
          </button>
        )}
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
