"use client";

import { useState } from "react";
import { getStoredApiKey } from "@/lib/api/apiKeyStore";
import { openBillingPortal } from "@/lib/api/billing";
import { ApiError } from "@/lib/api/client";
import { maskApiKey } from "@/lib/format";
import { useDashboard } from "@/hooks/useDashboard";
import styles from "./ApiKeyCard.module.css";

export default function ApiKeyCard() {
  const { dashboard } = useDashboard();
  const [copied, setCopied] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);

  async function copyKey() {
    const full = getStoredApiKey();
    if (!full) return;
    await navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function manageSubscription() {
    setBillingLoading(true);
    setBillingError(null);
    try {
      await openBillingPortal();
    } catch (error) {
      setBillingError(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Unexpected billing error.",
      );
      setBillingLoading(false);
    }
  }

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>API key</h2>
        <p className={styles.subtitle}>
          Use this key to call the Data_Link API from your own code.
        </p>
      </header>

      <code className={styles.key}>{dashboard?.apiKeyMasked ?? maskApiKey(getStoredApiKey())}</code>

      <div className={styles.actions}>
        <button className={styles.secondary} onClick={copyKey} disabled={!dashboard}>
          {copied ? "Copied" : "Copy key"}
        </button>
        <button
          className={styles.primary}
          onClick={manageSubscription}
          disabled={billingLoading || !dashboard}
        >
          {billingLoading ? "Opening billing…" : "Manage subscription"}
        </button>
      </div>

      {billingError && (
        <p className={styles.error} role="alert">
          {billingError}
        </p>
      )}

      <footer className={styles.footer}>
        <small className={styles.note}>
          Keep this key secret. Anyone with it can process files on your account.
        </small>
      </footer>
    </section>
  );
}
