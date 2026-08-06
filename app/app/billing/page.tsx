import PlanPanel from "@/components/billing/PlanPanel";

export const metadata = { title: "Plan & billing" };

/**
 * page.tsx SIEMPRE: export default, sin props.
 * Next monta las paginas el mismo; no hay padre que les pase nada.
 */
export default function BillingPage() {
  return <PlanPanel />;
}
