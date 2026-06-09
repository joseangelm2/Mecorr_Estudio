import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeCorr Estudio | Soluciones Digitales",
  description: "Invitaciones digitales para XV años, sitios web y soluciones digitales a medida.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
