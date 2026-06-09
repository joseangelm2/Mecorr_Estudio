import type { Metadata } from "next";
import { Cinzel, Sacramento, Playfair_Display } from "next/font/google";
import "./magical.css";

const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"], weight: ["400", "600", "700", "900"] });
const sacramento = Sacramento({ variable: "--font-sacramento", subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Mis XV — Magical",
  description: "Una noche mágica e inolvidable",
};

export default function MagicalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cinzel.variable} ${sacramento.variable} ${playfair.variable}`}>
      {children}
    </div>
  );
}
