import type { Metadata } from "next";
import { Albert_Sans, Dancing_Script, Tangerine, Bellefair, DM_Sans } from "next/font/google";
import "./elegance.css";

const albert = Albert_Sans({ variable: "--font-albert", subsets: ["latin"], weight: ["400", "500", "600"] });
const dancing = Dancing_Script({ variable: "--font-dancing", subsets: ["latin"], weight: ["400", "700"] });
const tangerine = Tangerine({ variable: "--font-tangerine", subsets: ["latin"], weight: ["400", "700"] });
const bellefair = Bellefair({ variable: "--font-bellefair", subsets: ["latin"], weight: "400" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

export const metadata: Metadata = { title: "Mis XV — Elegance", description: "Te Invito a Mi Día Más Especial" };

export default function EleganceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${albert.variable} ${dancing.variable} ${tangerine.variable} ${bellefair.variable} ${dmSans.variable}`}>
      {children}
    </div>
  );
}
