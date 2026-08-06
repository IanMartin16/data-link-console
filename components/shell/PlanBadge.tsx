"use client";

import { useDashboard } from "@/hooks/useDashboard";
import styles from "./PlanBadge.module.css";

/**
 * Reemplaza las cards gigantes de "Account & limits".
 * Plan y cuota siempre visibles, en una franja, sin robar la pantalla.
 */
export default function PlanBadge() {
  const { dashboard, isLoading } = useDashboard();
  if (isLoading || !dashboard) return null;

  const pct = dashboard.filesLimit
    ? Math.round((dashboard.filesUsed / dashboard.filesLimit) * 100)
    : 0;

  return (
    <div className={styles.badge}>
      <span className={styles.plan}>{dashboard.plan.toUpperCase()}</span>
      <span className={styles.usage}>
        {dashboard.filesUsed} / {dashboard.filesLimit} archivos
      </span>
      <span className={styles.meter} aria-hidden>
        <span className={styles.fill} style={{ width: `${Math.min(pct, 100)}%` }} />
      </span>
    </div>
  );
}
