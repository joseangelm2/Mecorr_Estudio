import type { Metadata } from "next";
import {
  Carattere,
  Bellefair,
  Cormorant_Garamond,
  Old_Standard_TT,
} from "next/font/google";
import "./esmeralda.css";

const carattere = Carattere({ variable: "--font-carattere", subsets: ["latin"], weight: "400" });
const bellefair = Bellefair({ variable: "--font-bellefair", subsets: ["latin"], weight: "400" });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const oldStandard = Old_Standard_TT({ variable: "--font-old-standard", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Mis XV — Esmeralda",
  description: "Te Invito a Mi Día Más Especial",
};

export default function EsmeraldaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${carattere.variable} ${bellefair.variable} ${cormorant.variable} ${oldStandard.variable}`}>
      <body>{children}</body>
    </html>
  );
}
