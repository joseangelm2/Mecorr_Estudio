import type { Metadata } from "next";
import { Albert_Sans, Beau_Rivage } from "next/font/google";
import "./zafiro.css";

const albert = Albert_Sans({ variable: "--font-albert", subsets: ["latin"], weight: ["200", "300", "400", "500"] });
const beau = Beau_Rivage({ variable: "--font-beau", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = { title: "Mis XV — Zafiro", description: "Te Invito a Mi Día Más Especial" };

export default function ZafiroLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${albert.variable} ${beau.variable}`}>{children}</div>;
}
