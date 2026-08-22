"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/hooks/useDashboard";
import { useApiKey } from "@/hooks/useApiKey";
import { formatNumber } from "@/lib/format";
import styles from "./SettingsPanel.module.css";

/**
 * Settings solo muestra lo que el backend realmente soporta hoy.
 *
 * No hay endpoints para cambiar email ni borrar la cuenta, asi que no se
 * inventan controles que no funcionan: se muestra el estado y se enlaza a
 * donde si se puede actuar.
 */
export default function SettingsPanel() {
  const { dashboard, isLoading } = useDashboard();
  const { signOut } = useApiKey();
  const router = useRouter();

  if (isLoading) return <p className={styles.muted}>Loading…</p>;
  if (!dashboard) return <p className={styles.error}>Account information unavailable.</p>;

  const retention = dashboard.plan.toLowerCase() === "free" ? "1 hour" : "24 hours";

  function handleSignOut() {
    signOut();
    router.replace("/login");
  }

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.muted}>Your account and how your data is handled.</p>
      </header>

      <section className={styles.card}>
        <h2 className={styles.h2}>Account</h2>
        <dl className={styles.rows}>
          <div>
            <dt>Email</dt>
            <dd>{dashboard.email ?? "—"}</dd>
          </div>
          <div>
            <dt>Plan</dt>
            <dd>
              {dashboard.plan.toUpperCase()}{" "}
              <Link href="/app/billing" className={styles.link}>
                {dashboard.canUpgrade ? "Upgrade" : "Manage"}
              </Link>
            </dd>
          </div>
          <div>
            <dt>API key</dt>
            <dd>
              <Link href="/app/keys" className={styles.link}>
                View and copy
              </Link>
            </dd>
          </div>
        </dl>
        <p className={styles.note}>
          To change the email on your account, write to us — there is no self-service
          option yet.
        </p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.h2}>Limits on your plan</h2>
        <dl className={styles.rows}>
          <div>
            <dt>Max file size</dt>
            <dd>{dashboard.limits.maxFileSizeMb} MB</dd>
          </div>
          <div>
            <dt>Records per file</dt>
            <dd>{formatNumber(dashboard.limits.maxRecordsPerFile)} CSV</dd>
          </div>
          <div>
            <dt>Files this month</dt>
            <dd>
              {formatNumber(dashboard.filesUsed)} of{" "}
              {formatNumber(dashboard.limits.filesPerMonth)}
            </dd>
          </div>
          <div>
            <dt>Custom filters</dt>
            <dd>{dashboard.limits.customFiltersAllowed ? "Enabled" : "Not on this plan"}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.card}>
        <h2 className={styles.h2}>Data handling</h2>
        <ul className={styles.bullets}>
          <li>Your source file is deleted as soon as the job finishes.</li>
          <li>Results stay available for {retention}, then are deleted automatically.</li>
          <li>File contents are never stored — only counts and timings.</li>
        </ul>
        <Link href="/security" className={styles.link}>
          How your files are handled
        </Link>
      </section>

      <section className={`${styles.card} ${styles.danger}`}>
        <h2 className={styles.h2}>Sign out</h2>
        <p className={styles.muted}>
          Removes your API key from this browser. You will need the key to sign back
          in — there is no password reset.
        </p>
        <button className={styles.signOut} onClick={handleSignOut}>
          Sign out of this browser
        </button>
      </section>
    </div>
  );
}
