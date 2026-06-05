import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Promociones XV — Invitaciones Digitales",
  description: "Promociones del mes en invitaciones digitales para XV años",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
