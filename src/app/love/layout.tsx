import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./love.css";

export const metadata: Metadata = {
  title: "Mis XV — Lidia",
  description: "Te Invito a Mi Día Más Especial",
};

export default function LoveLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" id="html">
      <body>{children}</body>
    </html>
  );
}
