import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";
import styles from "./landing.module.css";

export const metadata = {
  title: "Data_Link — clean millions of rows in seconds",
  description:
    "Upload a CSV or JSON file, remove duplicates, and download a clean file. Your original never survives the process.",
};

const OPERATIONS = [
  { name: "Remove duplicates by email", detail: "Case-insensitive. Blank values are kept, never merged." },
  { name: "Remove duplicates by ID", detail: "For exports where the record key is an id column." },
  { name: "Remove duplicates by email + phone", detail: "Both must match before a row is dropped." },
  { name: "Remove duplicates by any field", detail: "Pick the column yourself — sku, customer_id, whatever you have." },
  { name: "Keep only active records", detail: "Filters on the status column." },
  { name: "Remove empty records", detail: "Drops rows where every field is blank." },
];

export default function LandingPage() {
  return (
    <MarketingShell>
      <section className={styles.hero}>
        <h1 className={styles.headline}>
          Clean millions of rows <em>in seconds</em>.
        </h1>
        <p className={styles.lead}>
          Upload a CSV or JSON file, remove duplicates, download a clean file. No
          spreadsheet crashes, no scripts to maintain, and your original never
          survives the process.
        </p>

        <div className={styles.heroActions}>
          <Link href="/signup" className={styles.primary}>
            Get a free API key
          </Link>
          <Link href="/security" className={styles.secondary}>
            How your files are handled
          </Link>
        </div>

        <p className={styles.heroNote}>No credit card. The free key works immediately.</p>
      </section>

      <section className={styles.proof} aria-label="Measured performance">
        <div>
          <strong className={styles.proofValue}>1,000,000</strong>
          <span className={styles.proofLabel}>rows deduplicated</span>
        </div>
        <div>
          <strong className={styles.proofValue}>8s</strong>
          <span className={styles.proofLabel}>start to finish</span>
        </div>
        <div>
          <strong className={styles.proofValue}>59 MB</strong>
          <span className={styles.proofLabel}>file size — within the plan</span>
        </div>
      </section>

      <p className={styles.proofNote}>
        Measured on the live service, not a lab. That file fits inside the 100 MB
        limit, so you can reproduce it with your own data on the day you sign up.
      </p>

      <section className={styles.section}>
        <h2 className={styles.h2}>How it works</h2>
        <ol className={styles.steps}>
          <li>
            <strong>Upload</strong>
            <span>CSV or JSON. The format is detected automatically.</span>
          </li>
          <li>
            <strong>Pick an operation</strong>
            <span>Deduplicate, filter, or drop empty rows. Add a condition if you need one.</span>
          </li>
          <li>
            <strong>Download</strong>
            <span>You get the clean file plus the numbers: what was removed and what stayed.</span>
          </li>
        </ol>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>What it can do today</h2>
        <ul className={styles.operations}>
          {OPERATIONS.map((op) => (
            <li key={op.name}>
              <strong>{op.name}</strong>
              <span>{op.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.lifecycle}>
        <h2 className={styles.h2}>Your file does not stick around</h2>
        <p className={styles.lifecycleLead}>
          Most tools keep your upload. This one deletes it as part of the job.
        </p>

        <ol className={styles.timeline}>
          <li>
            <strong>Upload</strong>
            <span>The file goes straight to storage, never through a database.</span>
          </li>
          <li>
            <strong>Process</strong>
            <span>Read in blocks. Nothing is copied anywhere else.</span>
          </li>
          <li>
            <strong>Source deleted</strong>
            <span>The original is removed the moment the job finishes.</span>
          </li>
          <li>
            <strong>Result expires</strong>
            <span>The clean file is deleted automatically after 24 hours.</span>
          </li>
        </ol>

        <Link href="/security" className={styles.secondary}>
          Read the details
        </Link>
      </section>

      <section className={styles.next}>
        <h2 className={styles.h2}>In development: Data_Link Transform</h2>
        <p className={styles.lead}>
          A second engine for converting files to Parquet, masking sensitive fields
          and running lightweight ETL. Not available yet — it will share this same
          console when it ships.
        </p>
        <Link href="/transform" className={styles.secondary}>
          What it will do
        </Link>
      </section>

      <section className={styles.finalCta}>
        <h2 className={styles.h2}>Try it with a file you already have</h2>
        <p className={styles.lead}>
          The free key takes an email and nothing else. If it does not save you time
          on the first file, you have lost a minute.
        </p>
        <Link href="/signup" className={styles.primary}>
          Get a free API key
        </Link>
      </section>
    </MarketingShell>
  );
}
