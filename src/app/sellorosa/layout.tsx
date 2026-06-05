import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Raleway } from "next/font/google";
import "./sellorosa.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mis XV — Ximena",
  description: "Te Invito a Mi Día Más Especial",
};

export default function SelloRosaLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" id="html" className={raleway.variable}>
      <body>{children}</body>
    </html>
  );
}
