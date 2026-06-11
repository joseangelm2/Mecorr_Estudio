import type { Project } from "@/types/invitation";

interface Props {
  project: Project
}

const DEFAULT_EVENTS = [
  { name: "Misa",           time: "05:00 PM", icon: "/images/magical/misa.png",      side: "izquierda" },
  { name: "Recepción",      time: "07:00 PM", icon: "/images/magical/recepcion.png", side: "derecha" },
  { name: "Coctelería",     time: "08:00 PM", icon: "/images/magical/coctel.png",    side: "izquierda" },
  { name: "Cena",           time: "09:00 PM", icon: "/images/magical/comida.png",    side: "derecha" },
  { name: "Vals",           time: "10:20 PM", icon: "/images/magical/vals.png",      side: "izquierda" },
  { name: "Baile",          time: "11:30 PM", icon: "/images/magical/baile.png",     side: "derecha" },
  { name: "Fin del Evento", time: "03:00 AM", icon: "/images/magical/fin.png",       side: "izquierda" },
];

function resolveIcon(icon: string | undefined): string {
  if (!icon) return "/images/magical/misa.png";
  if (icon.startsWith("http") || icon.startsWith("/")) return icon;
  return `/images/magical/${icon}`;
}

export default function MagicalItinerario({ project }: Props) {
  const events = project.itinerary?.length
    ? project.itinerary.map((ev, i) => ({
        name: ev.title,
        time: ev.time,
        icon: resolveIcon(ev.icon ?? ev.iconSrc),
        side: i % 2 === 0 ? "izquierda" : "derecha",
      }))
    : DEFAULT_EVENTS;

  return (
    <div className="itinerario show-p-y no-print" style={{ marginTop: "-3%" }}>
      <h2>Programa del Evento</h2>
      <div>
        {events.map((ev, i) => (
          <div key={i} className={`evento ${ev.side}`} style={i === 0 ? { marginTop: "0" } : undefined}>
            {ev.side === "izquierda" ? (
              <>
                <div className="icono show-n-x">
                  <div className="circulo">
                    <img src={ev.icon} className="invertir-img-itinerario" alt={ev.name} />
                  </div>
                </div>
                <div className="item show-p-x">
                  <h4 className="nombre texto">{ev.name}</h4>
                  <p className="hora texto">{ev.time}</p>
                </div>
              </>
            ) : (
              <>
                <div className="item show-n-x">
                  <h4 className="nombre texto">{ev.name}</h4>
                  <p className="hora texto">{ev.time}</p>
                </div>
                <div className="icono show-p-x">
                  <div className="circulo">
                    <img src={ev.icon} className="invertir-img-itinerario" alt={ev.name} />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
