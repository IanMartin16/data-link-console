"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getDashboard } from "@/lib/api/dashboard";
import { clearApiKey, saveApiKey } from "@/lib/api/apiKeyStore";
import styles from "./AuthForm.module.css";

export default function SignInForm() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [reveal, setReveal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!apiKey.trim()) return setError("Enter your API key.");

    setLoading(true);
    try {
      // Se guarda primero porque el cliente lee la key del storage, y se
      // valida pidiendo el dashboard. Si no sirve, se descarta.
      saveApiKey(apiKey.trim());
      await getDashboard();
      router.push("/app");
    } catch (err) {
      clearApiKey();

      if (err instanceof ApiError && err.isUnauthorized) {
        setError("That key is not valid. Check it and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Could not reach the API.");
      }
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.lead}>Paste the API key you saved when you created your account.</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="key">API key</label>
            <button
              type="button"
              className={styles.reveal}
              onClick={() => setReveal(!reveal)}
            >
              {reveal ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="key"
            type={reveal ? "text" : "password"}
            autoComplete="off"
            spellCheck={false}
            placeholder="dl_…"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button className={styles.primary} type="submit" disabled={loading}>
          {loading ? "Checking…" : "Sign in"}
        </button>
      </form>

      <p className={styles.switch}>
        No key yet? <Link href="/signup">Create one free</Link>
      </p>

      <p className={styles.note}>
        Your key stays in this browser. It is the only credential — there is no
        password to reset.
      </p>
    </div>
  );
}
