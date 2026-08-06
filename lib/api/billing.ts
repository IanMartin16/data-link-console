import { apiFetch } from "./client";

export function createCheckoutSession() {
  return apiFetch<{ url?: string; checkout_url?: string }>(
    "/api/v1/billing/create-checkout-session",
    { method: "POST" },
  );
}

/** Portal de Stripe. El backend responde `portal_url`, no `url`. */
export async function openBillingPortal() {
  const data = await apiFetch<{ portal_url?: string }>("/api/v1/billing/portal-session", {
    method: "POST",
  });
  if (!data.portal_url) throw new Error("Billing portal URL was not returned.");
  window.location.href = data.portal_url;
}
