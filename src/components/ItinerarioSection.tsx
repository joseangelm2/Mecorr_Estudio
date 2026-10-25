"use client";

import { useEffect, useRef } from "react";

interface TimelineItem {
  title: string;
  time: string;
  icon?: string;
  iconSrc?: string;
  description?: string;
}

interface Props {
  /** Carpeta base de las imágenes (cada demo usa la suya). Por defecto, la raíz /images. */
  assetBase?: string;
  itinerary?: TimelineItem[];
}

const defaultItems = (base: string): TimelineItem[] => [
  { title: "Ceremonia Religiosa", time: "15:00", icon: `${base}/iglesia.png` },
  { title: "Recepción", time: "18:00", icon: `${base}/recep.png` },
];

const defaultIcons = (base: string) => [
  `${base}/iglesia.png`,
  `${base}/recep.png`,
  `${base}/calendario.png`,
  `${base}/formal.png`,
];

function resolveIcon(item: TimelineItem, index: number, base: string): string {
  const src = item.iconSrc ?? item.icon ?? "";
  const icons = defaultIcons(base);
  return src || icons[index % icons.length];
}

export default function ItinerarioSection({ assetBase = "/images", itinerary = defaultItems(assetBase) }: Props) {
  const items = itinerary;
  const timelineRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleScroll() {
      const timeline = timelineRef.current;
      if (!timeline) return;

      const listItems = timeline.querySelectorAll("li");
      const inner = timeline.querySelector<HTMLElement>(".inner");

      if (inner) {
        const containerBottom =
          timeline.getBoundingClientRect().bottom - window.innerHeight * 0.5;
        inner.style.height = Math.max(0, containerBottom) + "px";
      }

      listItems.forEach((el) => {
        const elemTop = el.getBoundingClientRect().top;
        const elemBottom = elemTop + window.innerHeight * 0.5;
        const docViewBottom = window.innerHeight;
        if (elemBottom <= docViewBottom && elemTop >= 0) {
          el.classList.add("active");
        } else if (elemBottom > docViewBottom) {
          el.classList.remove("active");
        }
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="itinerario"
      className="padding-section"
      style={{ backgroundColor: "rgba(255,255,255,.5)" }}
    >
      <div
        className="container"
        style={{ maxWidth: "100%", padding: "0 15px" }}
      >
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="mb-10 text-center wow fadeInUp">
              <img src={`${assetBase}/flores-01.png`} width="160" alt="" />
            </div>
            <h1 className="titulo mb-60 color-titulos text-center wow fadeInUp">
              Itinerario
            </h1>
            <div className="timeline-container wow fadeInUp">
              <ul
                ref={timelineRef}
                className="vertical-scrollable-timeline"
                id="vertical-scrollable-timeline"
              >
                <div className="list-progress">
                  <div className="inner"></div>
                </div>
                {items.map((item, i) => (
                  <li key={i}>
                    <p className="color-titulos" style={{ fontSize: "22px" }}>
                      {item.title}
                    </p>
                    <p className="mb-30 color-textos">
                      <strong>{item.time}</strong>
                    </p>
                    <div className="icon-holder">
                      <div className="text-center">
                        <img src={resolveIcon(item, i, assetBase)} width="60" alt={item.title} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
