/** Contratos compartidos entre la shell y los motores (core / transform). */

export type Engine = "core" | "transform";

export type Plan = "free" | "starter" | "pro" | "business";

export interface DashboardData {
  plan: Plan;
  planStatus: "active" | "past_due" | "canceled";
  filesUsed: number;
  filesLimit: number;
  maxFileSizeMb: number;
  maxRecordsPerFile: number;
  serviceStatus: "operational" | "degraded" | "down";
  canUpgrade: boolean;
  recordsProcessed: number;
  duplicatesRemoved: number;
  limits: {
    filesPerMonth: number;
    maxFileSizeMb: number;
    maxRecordsPerFile: number;
    customFiltersAllowed: boolean;
  };
  presets: PresetOption[];
  email: string | null;
  apiKeyMasked: string | null;
  recentJobs: Job[];
  /** De que motor reporta esta respuesta. Pedir al backend que lo declare. */
  engine?: Engine;
}

export type JobStatus = "pending" | "processing" | "completed" | "failed" | "expired";

export interface JobStats {
  totalRecords: number | null;
  duplicatesRemoved: number | null;
  recordsFiltered: number | null;
  recordsKept: number | null;
  reductionPct: number | null;
}

export interface Job {
  id: string;
  engine: Engine;
  fileName: string;
  format: string | null;
  preset: string | null;
  fileSizeMb: number | null;
  status: JobStatus;
  stats: JobStats;
  createdAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  expiresAt: string | null;
  filesDeleted: boolean;
  canDownload: boolean;
  downloadUrl: string | null;
  error: string | null;
  /** Payload crudo: lo necesitan getProcessingTime / getTotalTime. */
  raw: JobResponse;
}

/** Una entrada del catalogo que expone cada motor en /v1/operations. */
export interface Operation {
  id: string;
  label: string;
  description: string;
  engine: Engine;
  category: "clean" | "transform" | "protect";
  planRequired: Plan;
  inputs: OperationInput[];
}

export interface OperationInput {
  name: string;
  label: string;
  type: "field" | "fields" | "string" | "number" | "select" | "boolean";
  required: boolean;
  options?: { value: string; label: string }[];
}

/** Estrategia de masking. `reversible` decide como la etiqueta la UI. */
export interface MaskStrategy {
  id: string;
  label: string;
  reversible: boolean;
}

/** Una etapa de la receta que se manda a POST /v1/jobs. */
export interface RecipeStep {
  operationId: string;
  params: Record<string, unknown>;
}

/** Perfilado del archivo despues de subirlo, antes de configurar nada. */
export interface FileProfile {
  artifactId: string;
  rowsSampled: number;
  columns: ColumnProfile[];
}

export interface ColumnProfile {
  name: string;
  inferredType: "string" | "number" | "date" | "boolean";
  nullPct: number;
  distinctEstimate: number;
  piiCandidate: boolean;
}

/* =====================================================================
   Respuestas crudas del backend (snake_case).
   Se normalizan en lib/api/* y los componentes solo ven camelCase.
   ===================================================================== */

export interface PresetOption {
  value: string;
  display_name: string;
  available: boolean;
  locked_message?: string;
}

export interface DashboardResponse {
  user?: { plan?: Plan; email?: string };
  api_key?: { masked?: string };
  billing?: { status?: "active" | "past_due" | "canceled"; can_upgrade?: boolean };
  service?: { status?: "operational" | "degraded" | "down" };
  limits?: {
    files_per_month?: number;
    max_file_size_mb?: number;
    max_records_per_file?: number;
    custom_filters_allowed?: boolean;
  };
  usage?: {
    files_used?: number;
    records_processed?: number;
    duplicates_removed?: number;
  };
  /** Catalogo de operaciones con gating por plan. */
  presets?: PresetOption[];
  /** La lista de jobs viaja DENTRO del dashboard; no hay GET /jobs aparte. */
  recent_jobs?: JobResponse[];
  [key: string]: unknown;
}

export interface JobResponse {
  job_id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  format?: string;
  preset?: string;
  original_file_name?: string;
  file_size_mb?: number;
  total_records?: number;
  duplicates_removed?: number;
  records_filtered?: number;
  records_kept?: number;
  reduction_percentage?: number;
  stats?: {
    total_records?: number;
    duplicates_removed?: number;
    records_kept?: number;
    reduction_percentage?: number;
  };
  files_deleted?: boolean;
  files_deleted_at?: string | null;
  can_download?: boolean;
  download_url?: string | null;
  expires_at?: string | null;
  created_at?: string;
  started_at?: string | null;
  completed_at?: string | null;
  error?: string | null;
  [key: string]: unknown;
}

/** Envoltorio paginado de GET /api/v1/jobs. */
export interface JobListResponse {
  items: JobResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface JobPage {
  jobs: Job[];
  total: number;
  limit: number;
  offset: number;
}

/* =====================================================================
   Analytics — semilla de DataLytics.
   Su trabajo es el impacto acumulado, no el arranque de la consola.
   ===================================================================== */

export interface AnalyticsResponse {
  usage?: {
    files_processed_this_month?: number;
    files_processed_total?: number;
    usage_percentage?: number;
    last_reset_date?: string | null;
  };
  limits?: {
    files_per_month?: number | "unlimited";
    requests_per_hour?: number;
  };
  impact?: {
    total_jobs?: number;
    completed_jobs?: number;
    failed_jobs?: number;
    total_records_processed?: number;
    duplicates_removed?: number;
    records_filtered?: number;
    records_kept?: number;
    average_reduction_percentage?: number;
  };
  last_job?: {
    job_id: string;
    status: string;
    original_file_name?: string;
    created_at?: string;
    completed_at?: string | null;
  } | null;
  [key: string]: unknown;
}

export interface Analytics {
  filesThisMonth: number;
  filesTotal: number;
  usagePercentage: number;
  lastResetDate: string | null;
  filesPerMonth: number | null;
  isUnlimited: boolean;
  requestsPerHour: number | null;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  recordsProcessed: number;
  duplicatesRemoved: number;
  recordsFiltered: number;
  recordsKept: number;
  averageReductionPct: number;
  lastJob: { id: string; status: string; fileName: string | null; createdAt: string | null } | null;
}
