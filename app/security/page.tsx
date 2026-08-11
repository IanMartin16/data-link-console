import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";
import styles from "./security.module.css";

export const metadata = {
  title: "Security & data handling",
  description:
    "What Data_Link stores, for how long, and what it deletes. Your source file is removed as part of the job.",
};

export default function SecurityPage() {
  return (
    <MarketingShell>
      <article className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>How your files are handled</h1>
          <p className={styles.lead}>
            Data_Link is built so that the file you upload stops existing as soon as
            the work is done. This page describes exactly what happens and what is
            kept.
          </p>
        </header>

        <section>
          <h2 className={styles.h2}>The lifecycle of a file</h2>
          <ol className={styles.timeline}>
            <li>
              <strong>Upload</strong>
              <p>
                The file is streamed to object storage. It is never written to a
                database and never read into memory in full.
              </p>
            </li>
            <li>
              <strong>Processing</strong>
              <p>
                A worker downloads it, reads it in blocks, and writes the result to a
                separate file. No copies are made anywhere else.
              </p>
            </li>
            <li>
              <strong>Source deleted</strong>
              <p>
                When the job finishes, the original file is deleted from storage. It
                is part of the job, not a scheduled cleanup that might not run.
              </p>
            </li>
            <li>
              <strong>Result expires</strong>
              <p>
                The cleaned file stays available for 24 hours so you can download it,
                then it is deleted automatically. On the free plan, one hour.
              </p>
            </li>
          </ol>
        </section>

        <section>
          <h2 className={styles.h2}>What is kept after that</h2>
          <div className={styles.columns}>
            <div className={styles.keep}>
              <h3>Kept</h3>
              <ul>
                <li>Your email address, for your account</li>
                <li>The file name and its size</li>
                <li>How many records were processed, removed and kept</li>
                <li>When the job ran and how long it took</li>
              </ul>
            </div>
            <div className={styles.discard}>
              <h3>Not kept</h3>
              <ul>
                <li>The contents of your file</li>
                <li>Any individual record, value or column</li>
                <li>The source file, once the job completes</li>
                <li>The result, past its expiry window</li>
              </ul>
            </div>
          </div>
          <p className={styles.note}>
            The statistics on your dashboard are counters, not samples. They are
            produced while the file streams past and describe quantities, never
            content.
          </p>
        </section>

        <section>
          <h2 className={styles.h2}>API keys</h2>
          <p className={styles.body}>
            Your key is the credential for every request. It is stored in your browser
            only, which is why the console offers &ldquo;Forget this device&rdquo; —
            use it on shared machines. If a key is exposed, regenerate it from the
            console and the old one stops working.
          </p>
        </section>

        <section>
          <h2 className={styles.h2}>What we do not claim</h2>
          <p className={styles.body}>
            Data_Link is a data cleaning service, not a compliance product. We do not
            hold a security certification, and nothing here should be read as legal
            advice about the regulations that apply to your data. What we describe on
            this page is how the system behaves — you decide whether that fits your
            obligations.
          </p>
          <p className={styles.body}>
            If you handle personal data and need masking or anonymisation rather than
            deduplication, that is{" "}
            <Link href="/transform" className={styles.link}>
              Data_Link Transform
            </Link>
            , which is still in development.
          </p>
        </section>
      </article>
    </MarketingShell>
  );
}
