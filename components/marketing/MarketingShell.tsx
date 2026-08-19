import Link from "next/link";
import styles from "./MarketingShell.module.css";

const NAV = [
  { href: "/core", label: "Core" },
  { href: "/transform", label: "Transform" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
];

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          Data_Link
        </Link>

        <nav className={styles.nav}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/login" className={styles.ghost}>
            Sign in
          </Link>
          <Link href="/signup" className={styles.cta}>
            Get a free key
          </Link>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div>
          <strong className={styles.footerBrand}>Data_Link</strong>
          <p className={styles.footerNote}>
            Part of the evilink ecosystem. Files are deleted 24 hours after processing.
          </p>
        </div>
        <nav className={styles.footerNav}>
          <Link href="/security">Security</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="https://evilink.dev">Powered by evi_link devs</Link>
        </nav>
      </footer>
    </div>
  );
}
