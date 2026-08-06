import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://data-link.dev"),
  title: {
    default: "Data_Link — limpia, convierte y protege tus datos",
    template: "%s · Data_Link",
  },
  description:
    "Deduplica millones de registros en segundos. Tu archivo original no sobrevive al proceso.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
