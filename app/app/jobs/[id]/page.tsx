import JobDetail from "@/components/jobs/JobDetail";

export const metadata = { title: "Job" };

/**
 * Ruta dinamica: recibe `params`, no el job. En Next 15 params es una promesa.
 * La pagina solo resuelve el id; los datos los trae el componente cliente.
 */
export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobDetail jobId={id} />;
}
