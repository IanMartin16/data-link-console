"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApiKey } from "@/hooks/useApiKey";
import Sidebar from "./Sidebar";
import PlanBadge from "./PlanBadge";
import styles from "./AppShell.module.css";

/**
 * Gating client-side. Hoy la credencial es la API key; cuando core exponga
 * rutas de auth, este componente cambia de hook y nada mas se entera.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { status } = useApiKey();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status === "loading") return <div className={styles.loading}>Cargando…</div>;
  if (status === "unauthenticated") return null;

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <header className={styles.topbar}>
          <PlanBadge />
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
