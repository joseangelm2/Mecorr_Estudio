import type { Metadata } from "next";
import { Albert_Sans, Beau_Rivage } from "next/font/google";
import "./cenicienta.css";

const albert = Albert_Sans({
  variable: "--font-albert",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

const beau = Beau_Rivage({
  variable: "--font-beau",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Mis XV — Cenicienta",
  description: "Te Invito a Mi Día Más Especial",
};

export default function CenicientaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${albert.variable} ${beau.variable}`}>
      <body>{children}</body>
    </html>
  );
}
