import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";
import styles from "./core.module.css";

export const metadata = {
  title: "Data_Link Core — deduplication at scale",
  description:
    "The engine behind Data_Link: deduplicate millions of rows in seconds, with the original file deleted as part of the job.",
};

const OPERATIONS = [
  {
    name: "Remove duplicates by email",
    detail:
      "Case-insensitive, so Ana@x.com and ana@x.com collapse into one. Rows with a blank email are kept, never merged together.",
    plan: "Free",
  },
  {
    name: "Remove duplicates by ID",
    detail: "For exports where the record key lives in an id column.",
    plan: "Free",
  },
  {
    name: "Remove duplicates by email + phone",
    detail: "Both fields must match before a row is dropped. Safer for partial data.",
    plan: "Starter",
  },
  {
    name: "Remove duplicates by any field",
    detail:
      "Pick the column yourself — sku, customer_id, whatever your export uses. If the column is not in the file, the job stops and tells you which columns it did find.",
    plan: "Starter",
  },
  {
    name: "Keep only active records",
    detail: "Filters on the status column and drops everything else.",
    plan: "Starter",
  },
  {
    name: "Remove empty records",
    detail: "Drops rows where every single field is blank.",
    plan: "Starter",
  },
];

export default function CorePage() {
  return (
    <MarketingShell>
      <article className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Data_Link Core</p>
          <h1 className={styles.title}>Deduplication that does not flinch at scale</h1>
          <p className={styles.lead}>
            Core is the engine running today. It reads your file in blocks, removes
            what you tell it to, and hands back a clean file plus the numbers. No
            spreadsheet limits, no scripts to maintain.
          </p>
          <div className={styles.actions}>
            <Link href="/signup" className={styles.primary}>
              Get a free API key
            </Link>
            <Link href="/pricing" className={styles.secondary}>
              See plans
            </Link>
          </div>
        </header>

        <section className={styles.figures} aria-label="Measured performance">
          <div>
            <strong>1,000,000</strong>
            <span>rows deduplicated in 8 seconds</span>
          </div>
          <div>
            <strong>2,000,000</strong>
            <span>rows per file on Starter</span>
          </div>
          <div>
            <strong>150 MB</strong>
            <span>max file size, CSV or JSON</span>
          </div>
        </section>

        <section>
          <h2 className={styles.h2}>What it does</h2>
          <ul className={styles.operations}>
            {OPERATIONS.map((op) => (
              <li key={op.name}>
                <div className={styles.opHead}>
                  <strong>{op.name}</strong>
                  <span className={op.plan === "Free" ? styles.free : styles.starter}>
                    {op.plan}
                  </span>
                </div>
                <p>{op.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className={styles.h2}>How it behaves</h2>
          <dl className={styles.behaviour}>
            <div>
              <dt>Blank values are never merged</dt>
              <dd>
                A row with no value in the deduplication field is kept as-is. Grouping
                every blank into one record would silently delete real data.
              </dd>
            </div>
            <div>
              <dt>Your types survive</dt>
              <dd>
                A code like 007 comes back as 007, not 7. Columns are read as text so
                nothing is reinterpreted on the way through.
              </dd>
            </div>
            <div>
              <dt>Deduplication is global</dt>
              <dd>
                Even when the file is split into blocks for speed, a duplicate is
                caught across the whole file, not just within its block.
              </dd>
            </div>
            <div>
              <dt>You get the numbers</dt>
              <dd>
                Every job reports rows analysed, duplicates removed, rows kept and the
                reduction percentage — so you can check the result, not just trust it.
              </dd>
            </div>
          </dl>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.h2}>Run it on a file you already have</h2>
          <p className={styles.lead}>
            The free key takes an email. Files up to 15 MB, two deduplication modes,
            no card.
          </p>
          <Link href="/signup" className={styles.primary}>
            Get a free API key
          </Link>
        </section>
      </article>
    </MarketingShell>
  );
}
