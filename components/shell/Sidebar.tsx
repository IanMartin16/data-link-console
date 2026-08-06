"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./Sidebar.module.css";

/**
 * Dos grupos, a proposito:
 *
 * WORKSPACE  — depende del producto. Aqui crece cuando entre transform.
 * ACCOUNT    — es de la cuenta y sirve a todos los productos. No crece.
 *
 * Es lo que evita que el menu se desborde cuando el portal albergue
 * mas de una API.
 */
const WORKSPACE = [
  { href: "/app", label: "Overview", exact: true },
  { href: "/app/new", label: "Process file" },
  { href: "/app/jobs", label: "Jobs" },
];

const ACCOUNT = [
  { href: "/app/keys", label: "API keys" },
  { href: "/app/usage", label: "Usage" },
  { href: "/app/billing", label: "Billing" },
  { href: "/app/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  function renderGroup(
    title: string,
    items: { href: string; label: string; exact?: boolean }[],
  ) {
    return (
      <div className={styles.group}>
        {!collapsed && <p className={styles.groupTitle}>{title}</p>}
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive(item.href, item.exact) ? styles.active : styles.link}
                title={collapsed ? item.label : undefined}
              >
                <span className={styles.dot} aria-hidden />
                {!collapsed && item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <nav
      className={collapsed ? styles.sidebarCollapsed : styles.sidebar}
      aria-label="Navegación principal"
    >
      <div className={styles.top}>
        {!collapsed && (
          <Link href="/" className={styles.ecosystem}>
            evilink
          </Link>
        )}
        <button
          className={styles.collapse}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {!collapsed && (
        <div className={styles.product}>
          <span className={styles.productName}>Data_Link</span>
          <span className={styles.productHint}>Clean · Convert · Protect</span>
        </div>
      )}

      {renderGroup("Workspace", WORKSPACE)}
      {renderGroup("Account", ACCOUNT)}

      {!collapsed && (
        <Link href="https://evilink.dev" className={styles.platform}>
          <strong>Evilink Platform</strong>
          <span>One ecosystem. Unlimited connections.</span>
        </Link>
      )}
    </nav>
  );
}
