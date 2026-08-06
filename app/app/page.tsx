import ProcessFileCard from "@/components/process/ProcessFileCard";
import ApiKeyCard from "@/components/keys/ApiKeyCard";
import PlanPanel from "@/components/billing/PlanPanel";
import StatStrip from "@/components/overview/StatStrip";
import RecentJobs from "@/components/overview/RecentJobs";
import styles from "./overview.module.css";

export const metadata = { title: "Overview" };

/**
 * Overview: la accion primero, el estado despues.
 *
 * Un usuario nuevo ve la invitacion a procesar un archivo; uno que vuelve ve
 * sus trabajos recientes sin dar un clic. Nadie ve un tablero de ceros.
 */
export default function OverviewPage() {
  return (
    <div className={styles.page}>
      <StatStrip />

      <div className={styles.columns}>
        <div className={styles.main}>
          <ProcessFileCard />
        </div>
        <aside className={styles.side}>
          <ApiKeyCard />
          <PlanPanel onlyWhenUpgradable />
        </aside>
      </div>

      <RecentJobs />
    </div>
  );
}
