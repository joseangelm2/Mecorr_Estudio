import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./sobre.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mis XV Años — Invitación Digital",
  description: "Te invito a mi día más especial",
};

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="body" className={`bg-invitacion ${raleway.variable}`}>
      {children}
    </div>
  );
}
