"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApiKey } from "@/hooks/useApiKey";
import { useDashboard } from "@/hooks/useDashboard";
import styles from "./AccountMenu.module.css";

/**
 * Menu de cuenta de la topbar.
 *
 * Antes la unica forma de cerrar sesion era "Forget this device", enterrado
 * dentro de la card de API key. Aqui vive donde la gente lo busca.
 */
export default function AccountMenu() {
  const { signOut } = useApiKey();
  const { dashboard } = useDashboard();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleSignOut() {
    setOpen(false);
    signOut();
    router.replace("/login");
  }

  const email = dashboard?.email ?? null;
  const initials = (email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className={styles.avatar} aria-hidden>
          {initials}
        </span>
        <span className={styles.chevron} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          {email && (
            <div className={styles.identity}>
              <span className={styles.email}>{email}</span>
              {dashboard && (
                <span className={styles.plan}>{dashboard.plan.toUpperCase()}</span>
              )}
            </div>
          )}

          <Link href="/app/keys" className={styles.item} role="menuitem" onClick={() => setOpen(false)}>
            API keys
          </Link>
          <Link href="/app/billing" className={styles.item} role="menuitem" onClick={() => setOpen(false)}>
            Plan &amp; billing
          </Link>
          <Link href="/app/settings" className={styles.item} role="menuitem" onClick={() => setOpen(false)}>
            Settings
          </Link>

          <div className={styles.separator} />

          <button className={styles.signOut} role="menuitem" onClick={handleSignOut}>
            Sign out
          </button>
          <p className={styles.note}>
            Removes your API key from this browser.
          </p>
        </div>
      )}
    </div>
  );
}
