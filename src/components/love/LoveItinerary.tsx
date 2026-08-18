import type { Project } from "@/types/invitation";

const DEFAULT_EVENTS = [
  { description: "Misa",          time: "5:00 PM",  icon: "misa.png" },
  { description: "Recepción",     time: "7:00 PM",  icon: "recepcion.png" },
  { description: "Coctelería",    time: "8:00 PM",  icon: "coctel.png" },
  { description: "Cena",          time: "9:00 PM",  icon: "comida.png" },
  { description: "Vals",          time: "10:20 PM", icon: "vals.png" },
  { description: "Baile",         time: "11:30 PM", icon: "baile.png" },
  { description: "Fin del Evento",time: "3:00 AM",  icon: "fin.png" },
];

interface Props {
  project: Project;
}

export default function LoveItinerary({ project }: Props) {
  if (!project.show_itinerary || !project.itinerary.length) return null;

  const events = project.itinerary.map((e, i) => ({
    ...e,
    icon: e.icon || DEFAULT_EVENTS[i % DEFAULT_EVENTS.length]?.icon || "misa.png",
  }));

  return (
    <div className="itinerario show-p-y">
      <h2 className="subtitulo">Programa del Evento</h2>
      <img src="/images/love/9_separador.png" className="separador" alt="" />
      <div style={{ marginTop: "4vw" }}>
        {events.map((ev, i) => {
          const dir = i % 2 === 0 ? "izquierda" : "derecha";
          const iconSrc =
            ev.icon?.startsWith("http") || ev.icon?.startsWith("/")
              ? ev.icon
              : `/images/love/${ev.icon}`;
          return (
            <div key={i} className={`evento ${dir}`}>
              <div className="icono">
                <div className="circulo">
                  <img src={iconSrc} alt={ev.description} />
                </div>
              </div>
              <div className="item">
                <h4 className="nombre">{ev.description}</h4>
                <p className="hora">{ev.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
