import { apiFetch } from "./client";
import type { Engine, MaskStrategy, Operation } from "@/lib/types";

/**
 * Catalogo de capacidades. La shell se dibuja con esto: un motor puede
 * publicar una operacion nueva sin que el front se redespliegue.
 * core aun no lo expone — cuando lo haga, agregalo a `engines`.
 */
export async function listOperations(engines: Engine[] = ["core"]): Promise<Operation[]> {
  const batches = await Promise.all(
    engines.map((engine) =>
      apiFetch<Operation[]>("/v1/operations", { engine })
        .then((ops) => ops.map((op) => ({ ...op, engine })))
        .catch(() => [] as Operation[]),
    ),
  );
  return batches.flat();
}

export function listStrategies(engine: Engine = "transform") {
  return apiFetch<MaskStrategy[]>("/v1/strategies", { engine });
}
