import { apiFetch } from "./client";

/** Signup no lleva credenciales: todavia no hay sesion ni key. */
export function signup(email: string) {
  return apiFetch<{ api_key?: string; email: string }>("/api/v1/auth/signup", {
    method: "POST",
    body: { email },
  });
}
