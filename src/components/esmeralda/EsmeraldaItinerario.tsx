import type { Project } from "@/types/invitation";

interface Props {
  project: Project;
}

function resolveIcon(icon: string | undefined): string {
  if (!icon) return "/images/esmeralda/iglesia.png";
  if (icon.startsWith("http") || icon.startsWith("/")) return icon;
  return `/images/esmeralda/${icon}`;
}

export default function EsmeraldaItinerario({ project }: Props) {
  if (!project.show_itinerary || !project.itinerary.length) return null;

  const events = project.itinerary.map((ev, i) => ({
    name: ev.title,
    time: ev.time,
    icon: resolveIcon(ev.icon ?? ev.iconSrc),
    side: i % 2 === 0 ? "izquierda" : "derecha",
  }));

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
