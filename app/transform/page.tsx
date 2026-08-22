import Link from "next/link";
import MarketingShell from "@/components/marketing/MarketingShell";
import styles from "./transform.module.css";

export const metadata = {
  title: "Data_Link Transform — in development",
  description:
    "A second engine for converting files to Parquet, masking sensitive fields and running lightweight ETL. Not available yet.",
};

export default function TransformPage() {
  return (
    <MarketingShell>
      <article className={styles.page}>
        <header className={styles.header}>
          <p className={styles.status}>In development</p>
          <h1 className={styles.title}>Data_Link Transform</h1>
          <p className={styles.lead}>
            A second engine for the same console: convert files to Parquet, mask
            sensitive fields, and run lightweight ETL. It is not available yet — this
            page describes where it is headed, not what it does today.
          </p>
        </header>

        <section>
          <h2 className={styles.h2}>What it will do</h2>
          <ul className={styles.features}>
            <li>
              <strong>Convert to Parquet</strong>
              <span>
                CSV and JSON into a columnar format that analytics tools read directly.
              </span>
            </li>
            <li>
              <strong>Mask sensitive fields</strong>
              <span>
                Replace personal data before a file leaves your hands, so datasets can
                be shared or analysed with less exposure.
              </span>
            </li>
            <li>
              <strong>Lightweight ETL</strong>
              <span>
                Reusable transformations between extraction and load, without standing
                up a pipeline platform.
              </span>
            </li>
          </ul>
        </section>

        <section className={styles.honest}>
          <h2 className={styles.h2}>What we are not claiming</h2>
          <p>
            Masking is not the same as anonymisation, and Transform will not ship as a
            compliance product. When it launches we will be explicit about which
            strategies are reversible and which are not, so you can decide what fits
            your obligations. Until then, we would rather say nothing than promise
            something we have not finished testing.
          </p>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.h2}>Want to know when it ships?</h2>
          <p className={styles.lead}>
            Tell us what you would use it for. Real use cases decide what gets built
            first.
          </p>
          <a
            href="mailto:hola@data-link.dev?subject=Data_Link%20Transform"
            className={styles.primary}
          >
            Write to us
          </a>
          <p className={styles.note}>
            In the meantime,{" "}
            <Link href="/core" className={styles.link}>
              Data_Link Core
            </Link>{" "}
            handles deduplication today.
          </p>
        </section>
      </article>
    </MarketingShell>
  );
}
