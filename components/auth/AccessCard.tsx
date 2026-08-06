"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signup } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { getDashboard } from "@/lib/api/dashboard";
import { saveApiKey } from "@/lib/api/apiKeyStore";
import styles from "./AccessCard.module.css";

type Mode = "signup" | "existing";

export default function AccessCard({ initialMode = "signup" }: { initialMode?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  async function handleSignup(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!email.trim()) return setError("Enter a valid email.");

    setLoading(true);
    try {
      const data = await signup(email.trim());
      if (!data.api_key) throw new Error("No API key was returned.");
      saveApiKey(data.api_key);
      router.push("/app/new");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the account.");
      setLoading(false);
    }
  }

  async function handleExistingKey(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!apiKey.trim()) return setError("Enter your API key.");

    setLoading(true);
    try {
      // Se guarda primero porque el cliente lee la key del storage,
      // y se valida pidiendo el dashboard. Si falla, se descarta.
      saveApiKey(apiKey.trim());
      await getDashboard();
      router.push("/app/new");
    } catch (err) {
      // Solo un rechazo del backend significa key mala. Un fallo de red o de
      // CORS no dice nada sobre la key, y decir lo contrario manda al usuario
      // a revisar algo que estaba bien.
      if (err instanceof ApiError && err.isUnauthorized) {
        setError("That key is not valid. Check it and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Could not load your account.");
      }
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Data_Link Console</h1>
        <p className={styles.lead}>
          Clean and prepare CSV/JSON files in seconds. Create a free key or use one you
          already have.
        </p>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={mode === "signup" ? styles.tabActive : styles.tab}
            onClick={() => switchMode("signup")}
          >
            Create key
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "existing"}
            className={mode === "existing" ? styles.tabActive : styles.tab}
            onClick={() => switchMode("existing")}
          >
            I have a key
          </button>
        </div>

        {mode === "signup" ? (
          <form onSubmit={handleSignup} className={styles.form}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className={styles.error} role="alert">{error}</p>}
            <button className={styles.primary} type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create free API key"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleExistingKey} className={styles.form}>
            <label htmlFor="key">API key</label>
            <input
              id="key"
              type="password"
              placeholder="dl_…"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            {error && <p className={styles.error} role="alert">{error}</p>}
            <button className={styles.primary} type="submit" disabled={loading}>
              {loading ? "Checking key…" : "Use this API key"}
            </button>
          </form>
        )}

        <small className={styles.note}>
          Your key stays in this browser. Use &ldquo;Forget this device&rdquo; on shared
          computers.
        </small>
      </section>
    </main>
  );
}
