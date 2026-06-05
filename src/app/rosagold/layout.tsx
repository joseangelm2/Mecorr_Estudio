import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Raleway, Mea_Culpa } from "next/font/google";
import "./rosagold.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const meaCulpa = Mea_Culpa({
  variable: "--font-meaculpa",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Mis XV — Aime Ferreira",
  description: "Te Invito a Mi Día Más Especial",
};

export default function RosaGoldLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${raleway.variable} ${meaCulpa.variable}`}>
      <body>{children}</body>
    </html>
  );
}
