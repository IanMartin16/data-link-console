"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signup } from "@/lib/api/auth";
import { saveApiKey } from "@/lib/api/apiKeyStore";
import styles from "./AuthForm.module.css";

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // La key completa se muestra UNA vez: despues el dashboard solo devuelve
  // la version enmascarada, asi que si el usuario no la guarda aqui y luego
  // cierra sesion, se queda sin credencial.
  const [issuedKey, setIssuedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim()) return setError("Enter a valid email.");

    setLoading(true);
    try {
      const data = await signup(email.trim());
      if (!data.api_key) throw new Error("No API key was returned.");

      saveApiKey(data.api_key);
      setIssuedKey(data.api_key);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the account.");
    } finally {
      setLoading(false);
    }
  }

  async function copyKey() {
    if (!issuedKey) return;
    await navigator.clipboard.writeText(issuedKey);
    setCopied(true);
  }

  if (issuedKey) {
    return (
      <div className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.title}>Save your API key</h1>
          <p className={styles.lead}>
            This is the only time the full key is shown. It is your only credential —
            store it somewhere safe before continuing.
          </p>
        </header>

        <code className={styles.issuedKey}>{issuedKey}</code>

        <button className={styles.secondary} onClick={copyKey}>
          {copied ? "Copied" : "Copy key"}
        </button>

        <label className={styles.confirm}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          I saved my key somewhere safe
        </label>

        <button
          className={styles.primary}
          disabled={!confirmed}
          onClick={() => router.push("/app")}
        >
          Go to the console
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Create your free key</h1>
        <p className={styles.lead}>
          An email is all it takes. No card, no password — you get an API key and the
          console opens right away.
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button className={styles.primary} type="submit" disabled={loading}>
          {loading ? "Creating your key…" : "Create free API key"}
        </button>
      </form>

      <p className={styles.switch}>
        Already have a key? <Link href="/login">Sign in</Link>
      </p>

      <p className={styles.note}>
        Free plan: 10 files a month, up to 15 MB each. No expiry, no card.
      </p>
    </div>
  );
}
