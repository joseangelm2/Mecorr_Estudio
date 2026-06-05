import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./sobrelila.css";

const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Mis XV Años — Aime Ferreira",
  description: "Te invito a mi día más especial",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" id="html" className={raleway.variable}>
      <body id="body" className="bg-invitacion">{children}</body>
    </html>
  );
}
