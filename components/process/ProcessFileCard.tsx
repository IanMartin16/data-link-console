"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { processFile } from "@/lib/api/process";
import { ApiError } from "@/lib/api/client";
import { formatNumber } from "@/lib/format";
import styles from "./ProcessFileCard.module.css";

const DEDUPE_BY_FIELD = "REMOVE_DUPLICATES_BY_FIELD";

function fileSizeMb(file: File) {
  return file.size / 1024 / 1024;
}

export default function ProcessFileCard() {
  const router = useRouter();
  const { dashboard, isLoading } = useDashboard();

  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("csv");
  const [preset, setPreset] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterOperator, setFilterOperator] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const presets = dashboard?.presets ?? [];
  const isDedupeByField = preset === DEDUPE_BY_FIELD;

  useEffect(() => {
    const first = presets.find((p) => p.available);
    if (first && !preset) setPreset(first.value);
  }, [presets, preset]);

  useEffect(() => {
    if (isDedupeByField) {
      setFilterOperator("");
      setFilterValue("");
    }
  }, [isDedupeByField]);

  if (isLoading) return <p className={styles.muted}>Loading…</p>;
  if (!dashboard) return <p className={styles.error}>Account information unavailable.</p>;

  const { plan, limits } = dashboard;
  const { maxFileSizeMb, maxRecordsPerFile, customFiltersAllowed } = limits;

  function handlePresetChange(value: string) {
    setPreset(value);
    setError("");
    setFilterField("");
    setFilterOperator("");
    setFilterValue("");
  }

  function handleFileChange(selected: File | null) {
    setError("");
    setFile(selected);
    if (!selected) return;

    const name = selected.name.toLowerCase();
    if (name.endsWith(".csv")) setFormat("csv");
    else if (name.endsWith(".json")) setFormat("json");
    else {
      setError("Only CSV and JSON files are supported.");
      return;
    }

    if (fileSizeMb(selected) > maxFileSizeMb) {
      setError(`File is over the ${plan} limit of ${maxFileSizeMb} MB.`);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!file) return setError("Choose a CSV or JSON file.");
    if (fileSizeMb(file) > maxFileSizeMb)
      return setError(`File is over the ${plan} limit of ${maxFileSizeMb} MB.`);
    if (!preset) return setError("Choose an operation.");

    const selected = presets.find((p) => p.value === preset);
    if (selected && !selected.available)
      return setError(selected.locked_message ?? "This operation needs a higher plan.");

    if (isDedupeByField && !filterField.trim())
      return setError("Choose the field to deduplicate by.");

    const hasFilter =
      Boolean(filterField.trim()) || Boolean(filterOperator.trim()) || Boolean(filterValue.trim());

    if (!isDedupeByField && hasFilter && !customFiltersAllowed)
      return setError("Custom filters need a higher plan.");

    if (!isDedupeByField && hasFilter) {
      if (!filterField.trim() || !filterOperator.trim() || !filterValue.trim())
        return setError("Custom filters need a field, an operator and a value.");
    }

    setSubmitting(true);
    try {
      const job = await processFile({
        file,
        format,
        preset,
        filterField: filterField.trim() || undefined,
        filterOperator: isDedupeByField ? undefined : filterOperator.trim() || undefined,
        filterValue: isDedupeByField ? undefined : filterValue.trim() || undefined,
      });
      router.push(`/app/jobs/${job.job_id}`);
    } catch (err) {
      if (err instanceof ApiError && err.isPlanLimit) {
        setError("You reached your monthly file limit. Upgrade to keep processing.");
      } else {
        setError(err instanceof Error ? err.message : "Could not process the file.");
      }
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>Process file</h2>
        <p className={styles.muted}>Upload a CSV or JSON file and clean your data.</p>
      </header>

      <div className={styles.planNote}>
        <strong>{plan.toUpperCase()}</strong>
        <span>
          Up to {maxFileSizeMb} MB · {formatNumber(maxRecordsPerFile)} records per file
        </span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.dropzone}>
          <input
            type="file"
            accept=".csv,.json"
            className={styles.fileInput}
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />
          <span className={styles.dropzoneTitle}>
            {file ? file.name : "Choose a CSV or JSON file"}
          </span>
          <small className={styles.hint}>
            {file
              ? `${fileSizeMb(file).toFixed(2)} MB · detected as ${format.toUpperCase()}`
              : "Data_Link detects the format automatically."}
          </small>
        </label>

        <div className={styles.field}>
          <label htmlFor="preset">Operation</label>
          <select
            id="preset"
            value={preset}
            onChange={(e) => handlePresetChange(e.target.value)}
          >
            <option value="" disabled>
              Choose operation
            </option>
            {presets.map((item) => (
              <option key={item.value} value={item.value} disabled={!item.available}>
                {item.display_name}
                {!item.available ? " — upgrade" : ""}
              </option>
            ))}
          </select>
        </div>

        {isDedupeByField ? (
          <div className={styles.filterBox}>
            <div className={styles.filterTitle}>
              <span>Field to deduplicate by</span>
              <small>Required</small>
            </div>
            <input
              placeholder="material, sku, customer_id…"
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
            />
            <small className={styles.hint}>
              Records sharing the same value in this field are collapsed into one.
            </small>
          </div>
        ) : (
          <div className={styles.filterBox}>
            <div className={styles.filterTitle}>
              <span>Custom filters</span>
              {!customFiltersAllowed && <small>Needs a higher plan</small>}
            </div>
            <div className={styles.filterRow}>
              <input
                placeholder="Field"
                value={filterField}
                disabled={!customFiltersAllowed}
                onChange={(e) => setFilterField(e.target.value)}
              />
              <select
                value={filterOperator}
                disabled={!customFiltersAllowed}
                onChange={(e) => setFilterOperator(e.target.value)}
              >
                <option value="">Operator</option>
                <option value="EQUALS">Equals</option>
                <option value="NOT_EQUALS">Not equals</option>
                <option value="CONTAINS">Contains</option>
                <option value="GREATER_THAN">Greater than</option>
                <option value="LESS_THAN">Less than</option>
              </select>
              <input
                placeholder="Value"
                value={filterValue}
                disabled={!customFiltersAllowed}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </div>
          </div>
        )}

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" className={styles.primary} disabled={submitting}>
          {submitting ? "Creating job…" : "Process file"}
        </button>
      </form>
    </section>
  );
}
