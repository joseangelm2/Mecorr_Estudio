import type { Metadata } from "next";
import "./sobre.css";

export const metadata: Metadata = {
  title: "Mis XV Años — Invitación Digital",
  description: "Te invito a mi día más especial",
};

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="body" className="bg-invitacion">
      {children}
    </div>
  );
}
