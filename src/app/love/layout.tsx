import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Dancing_Script, Old_Standard_TT, Bellefair } from "next/font/google";
import "./love.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const oldStandard = Old_Standard_TT({
  variable: "--font-old-standard",
  subsets: ["latin"],
  weight: ["400", "700"],
});
const bellefair = Bellefair({
  variable: "--font-bellefair",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Mis XV — Love",
  description: "Te Invito a Mi Día Más Especial",
};

export default function LoveLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${cormorant.variable} ${dancing.variable} ${oldStandard.variable} ${bellefair.variable}`}
    >
      {children}
    </div>
  );
}
