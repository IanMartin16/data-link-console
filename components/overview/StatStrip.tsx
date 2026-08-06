"use client";

import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { formatNumber } from "@/lib/format";
import styles from "./StatStrip.module.css";

/**
 * Franja compacta con lo que SI cambia: plan, consumo y estado.
 *
 * Los limites (tamano maximo, registros por archivo) no van aqui: son
 * constantes y ya se muestran donde importan, dentro del formulario de
 * proceso, justo cuando el usuario elige un archivo.
 */
export default function StatStrip() {
  const { dashboard, isLoading } = useDashboard();
  if (isLoading || !dashboard) return null;

  const pct = dashboard.filesLimit
    ? Math.round((dashboard.filesUsed / dashboard.filesLimit) * 100)
    : 0;
  const near = pct >= 80;

  return (
    <section className={styles.strip}>
      <div className={styles.plan}>
        <span className={styles.label}>Plan</span>
        <strong className={styles.value}>{dashboard.plan.toUpperCase()}</strong>
        <Link href="/app/billing" className={styles.link}>
          {dashboard.canUpgrade ? "Upgrade" : "Manage"}
        </Link>
      </div>

      <div className={styles.usage}>
        <div className={styles.usageHead}>
          <span className={styles.label}>Files this month</span>
          <span className={styles.value}>
            {formatNumber(dashboard.filesUsed)}
            <span className={styles.of}> / {formatNumber(dashboard.filesLimit)}</span>
          </span>
        </div>
        <div className={styles.meter} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <span
            className={near ? styles.fillWarn : styles.fill}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      <div className={styles.service}>
        <span
          className={dashboard.serviceStatus === "operational" ? styles.dotOk : styles.dotWarn}
          aria-hidden
        />
        <span className={styles.serviceText}>
          {dashboard.serviceStatus === "operational" ? "All systems operational" : "Degraded service"}
        </span>
      </div>
    </section>
  );
}
