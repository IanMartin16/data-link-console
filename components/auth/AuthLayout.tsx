import Link from "next/link";
import styles from "./AuthLayout.module.css";

/**
 * Marco de las pantallas de acceso.
 *
 * Antes era una caja flotando en fondo vacio, sin relacion con la landing.
 * El panel derecho carga la promesa del producto para que quien llega desde
 * la landing no pierda el hilo.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <section className={styles.formSide}>
        <Link href="/" className={styles.brand}>
          Data_Link
        </Link>
        <div className={styles.formWrap}>{children}</div>
      </section>

      <aside className={styles.pitch} aria-hidden>
        <div className={styles.pitchInner}>
          <p className={styles.metricLabel}>Measured on the live service</p>
          <p className={styles.metric}>
            1,000,000 <span>rows deduplicated in 8 seconds</span>
          </p>

          <ul className={styles.points}>
            <li>
              <strong>Your file does not stick around.</strong>
              The original is deleted when the job finishes; the result expires on
              its own.
            </li>
            <li>
              <strong>Six cleaning operations.</strong>
              Deduplicate by email, ID, or any column you pick. Filter and drop empty
              rows.
            </li>
            <li>
              <strong>CSV and JSON, up to 150 MB.</strong>
              Format detected automatically. No scripts to maintain.
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
