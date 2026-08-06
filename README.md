# data-link-console

Front de **data-link.dev**. Repo propio, separado del portal principal.
Sirve a dos motores: `core` (deduplicacion) y `transform` (masking / ETL / Parquet).

## Arrancar

```bash
npm install
cp .env.example .env.local   # llenar NEXT_PUBLIC_CORE_API_URL y AUTH_SECRET
npm run dev
```

`AUTH_SECRET`: `openssl rand -base64 32`

## Principios

- **El motor es detalle de implementacion.** No hay `/app/core` ni `/app/transform`.
  Adentro solo hay archivos, operaciones y trabajos; la receta decide a que motor
  va cada etapa. La identidad de producto vive en las paginas publicas.
- **La shell se dibuja desde el catalogo.** `lib/api/operations.ts` lee
  `/v1/operations` de cada motor. Un motor puede publicar una operacion nueva sin
  que este repo se redespliegue.
- **Auth client-side.** `middleware.ts` no protege rutas; `AppShell` si. Mismo
  criterio que v-secrets.
- **Un solo punto conoce las URLs.** `lib/api/client.ts`. Meter transform es
  agregar una variable de entorno.
- **402 no es error.** `ApiError.isPlanLimit` lo convierte en upsell.

## Mapa de migracion

| Archivo actual | Destino |
|---|---|
| `DataLinkConsole.tsx` | se disuelve entre `AppShell` y las paginas |
| `DashboardSummary.tsx` | `components/shell/PlanBadge.tsx` + `/app/usage` |
| `ProcessFileCard.tsx` | `/app/new` + `components/process/*` |
| `RecentJobTable.tsx` | `/app/jobs` + `components/jobs/JobsTable.tsx` |
| `currentJobResult.tsx` | `/app/jobs/[id]` |
| `apikeycard.tsx` | `/app/keys` |
| `UpgradeCard.tsx` | `/app/billing` |
| `SignupCard.tsx` | `/(auth)/signup` |
| `dataLinkApi.ts` | `lib/api/*` por dominio |
| `data-link.css` | `app/globals.css` (tokens) + CSS Modules por componente |

Al copiar: normalizar todo a **PascalCase**. El build de Vercel corre en Linux y
un import con la capitalizacion equivocada revienta ahi aunque funcione en macOS.

## Falta en backend

- `/v1/operations` y `/v1/strategies` en core (transform ya los tiene)
- `POST /v1/artifacts` con presigned URL + `/v1/artifacts/{id}/profile`
- que `/api/v1/dashboard` declare de que motor reporta
