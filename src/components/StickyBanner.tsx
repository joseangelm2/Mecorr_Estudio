"use client";

import { useEffect } from "react";

interface StickyBannerProps {
  guestName?: string;
}

export default function StickyBanner({ guestName = "" }: StickyBannerProps) {
  useEffect(() => {
    function handleScroll() {
      const cintillo = document.getElementById("cintillo");
      if (!cintillo) return;
      if (window.scrollY > 300) {
        cintillo.classList.add("cintillo-scrolled");
      } else {
        cintillo.classList.remove("cintillo-scrolled");
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="cintillo" className="invitado color-principal">
      <div className="container" style={{ maxWidth: "100%", padding: "0 15px" }}>
        <p
          className="mb-0 text-white text-center"
          style={{ fontSize: "20px" }}
        >
          {guestName}
        </p>
      </div>
    </section>
  );
}
