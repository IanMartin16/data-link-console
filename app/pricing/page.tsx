import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";
import styles from "./pricing.module.css";

export const metadata = {
  title: "Pricing",
  description:
    "Start free. Upgrade when your files outgrow it — bigger uploads, every operation and custom filters.",
};

const ROWS = [
  { label: "Max file size", free: "15 MB", starter: "150 MB" },
  { label: "Records per file (CSV)", free: "200,000", starter: "2,000,000" },
  { label: "Records per file (JSON)", free: "100,000", starter: "1,000,000" },
  { label: "Files per month", free: "10", starter: "100" },
  { label: "Cleaning operations", free: "2 of 6", starter: "All 6" },
  { label: "Custom filters", free: false, starter: true },
  { label: "Result kept for", free: "1 hour", starter: "24 hours" },
  { label: "API requests per hour", free: "20", starter: "100" },
  { label: "API access", free: true, starter: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <span className={styles.yes}>Included</span>;
  if (value === false) return <span className={styles.no}>—</span>;
  return <>{value}</>;
}

export default function PricingPage() {
  return (
    <MarketingShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Start free. Upgrade when your files outgrow it.</h1>
          <p className={styles.lead}>
            The free key is enough to clean a small export today. Most people move up
            because a file is too big or they need a condition the free plan does not
            cover — not because they ran out of uploads.
          </p>
        </header>

        <section className={styles.plans}>
          <article className={styles.plan}>
            <h2 className={styles.planName}>Free</h2>
            <p className={styles.price}>
              <strong>$0</strong>
            </p>
            <p className={styles.planFor}>
              For a one-off cleanup or trying the engine on real data.
            </p>
            <ul className={styles.highlights}>
              <li>Files up to 15 MB — 200k rows in CSV, 100k in JSON</li>
              <li>Deduplicate by email or ID</li>
              <li>10 files a month</li>
            </ul>
            <Link href="/signup" className={styles.secondaryCta}>
              Get a free key
            </Link>
            <p className={styles.fine}>Email only. No card.</p>
          </article>

          <article className={`${styles.plan} ${styles.featured}`}>
            <span className={styles.badge}>Most complete</span>
            <h2 className={styles.planName}>Starter</h2>
            <p className={styles.price}>
              <strong>$29</strong>
              <span className={styles.period}>/month</span>
            </p>
            <p className={styles.planFor}>
              For recurring cleanups where the files are real exports, not samples.
            </p>
            <ul className={styles.highlights}>
              <li>Files up to 150 MB — 2M rows in CSV, 1M in JSON</li>
              <li>All six operations, including deduplicate by any field</li>
              <li>Custom filters with conditions</li>
            </ul>
            <Link href="/signup" className={styles.primaryCta}>
              Start with Starter
            </Link>
            <p className={styles.fine}>Cancel any time from the console.</p>
          </article>

          <article className={styles.plan}>
            <h2 className={styles.planName}>More capacity</h2>
            <p className={styles.price}>
              <strong className={styles.talk}>Let&rsquo;s talk</strong>
            </p>
            <p className={styles.planFor}>
              The engine handles far more than the Starter limits. If your files are
              bigger, tell us what you are working with.
            </p>
            <ul className={styles.highlights}>
              <li>Larger uploads and record counts</li>
              <li>Higher request limits</li>
              <li>Priced on what you actually move</li>
            </ul>
            <Link href="mailto:hola@data-link.dev?subject=Data_Link%20capacity" className={styles.secondaryCta}>
              Tell us your case
            </Link>
            <p className={styles.fine}>No fixed tier yet — we want the real numbers first.</p>
          </article>
        </section>

        <section className={styles.tableSection}>
          <h2 className={styles.h2}>Side by side</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th />
                  <th>Free</th>
                  <th className={styles.featuredCol}>Starter</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>
                      <Cell value={row.free} />
                    </td>
                    <td className={styles.featuredCol}>
                      <Cell value={row.starter} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.tableNote}>
            JSON files are roughly twice the size of a CSV holding the same rows, so
            the record limit is lower for JSON. Both formats share the same file size
            limit.
          </p>
        </section>

        <section className={styles.notes}>
          <h2 className={styles.h2}>Worth knowing</h2>
          <dl className={styles.faq}>
            <div>
              <dt>What counts as a file?</dt>
              <dd>
                One upload that finishes processing. Files that fail do not count
                against your month.
              </dd>
            </div>
            <div>
              <dt>What happens when I hit the monthly limit?</dt>
              <dd>
                Processing stops until the counter resets. Nothing is deleted early
                and your key keeps working.
              </dd>
            </div>
            <div>
              <dt>Do you keep my data?</dt>
              <dd>
                No. The source file is deleted when the job finishes and the result
                expires on its own.{" "}
                <Link href="/security" className={styles.link}>
                  How files are handled
                </Link>
                .
              </dd>
            </div>
            <div>
              <dt>Can I cancel?</dt>
              <dd>
                Any time, from the console. You keep Starter until the end of the
                period you already paid for.
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </MarketingShell>
  );
}
