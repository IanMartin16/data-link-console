"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

/**
 * Dos grupos, a proposito:
 *
 * WORKSPACE  — depende del producto. Aqui crece cuando entre transform.
 * ACCOUNT    — es de la cuenta y sirve a todos los productos. No crece.
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

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  function renderGroup(
    title: string,
    items: { href: string; label: string; exact?: boolean }[],
  ) {
    return (
      <div className={styles.group}>
        <p className={styles.groupTitle}>{title}</p>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive(item.href, item.exact) ? styles.active : styles.link}
              >
                <span className={styles.dot} aria-hidden />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <nav className={styles.sidebar} aria-label="Navegación principal">
      <Link href="/" className={styles.ecosystem}>
        evi_link devs
      </Link>

      <div className={styles.product}>
        <span className={styles.productName}>Data_Link</span>
        <span className={styles.productHint}>Clean · Convert · Protect</span>
      </div>

      {renderGroup("Workspace", WORKSPACE)}
      {renderGroup("Account", ACCOUNT)}

      <Link href="https://evilink.dev" className={styles.platform}>
        <strong>Evilink Platform</strong>
        <span>One ecosystem. Unlimited connections.</span>
      </Link>
    </nav>
  );
}
