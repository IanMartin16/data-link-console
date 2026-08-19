"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApiKey } from "@/hooks/useApiKey";
import Sidebar from "./Sidebar";
import PlanBadge from "./PlanBadge";
import AccountMenu from "./AccountMenu";
import styles from "./AppShell.module.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { status } = useApiKey();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status === "loading") return <div className={styles.loading}>Cargando…</div>;
  if (status === "unauthenticated") return null;

  // En el Overview la franja de estado ya muestra plan y consumo.
  const showPlanBadge = pathname !== "/app";

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <header className={styles.topbar}>
          {showPlanBadge && <PlanBadge />}
          <AccountMenu />
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
