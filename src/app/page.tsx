import Link from "next/link";

interface Invitation {
  title: string;
  description: string[];
  image: string;
  imageAlt: string;
  accent: string;
  reversed: boolean;
  demoHref: string;
  demoLabel?: string;
  internalRoute?: string;
}

const invitations: Invitation[] = [
  {
    title: "Esmeralda",
    description: [
      "Esta invitación digital de XV años se enfoca en la elegancia, la foto principal la rodea un círculo animado que sorprenderá a tus invitados, con decoración en toda la invitación, tus invitados quedarán encantados con esta invitación.",
    ],
    image: "/promo/esmeralda.webp",
    imageAlt: "Muestra de invitación digital Esmeralda",
    accent: "accent-green",
    reversed: true,
    demoHref: "/esmeralda",
    demoLabel: "Ver el demo",
    internalRoute: "/esmeralda",
  },
  {
    title: "Sobre Animado",
    description: [
      "Invitación con animación de sobre al abrirse para revelar el contenido. Itinerario animado, cuenta regresiva y confirmación de asistencia por WhatsApp. Disponible en 6 paletas de color: Rosa Gold, Azul, Lila, Rojo, Negro y Mariposas — cambia de color directamente en el demo.",
    ],
    image: "/promo/sobreros.png",
    imageAlt: "Muestra de invitación Sobre Animado",
    accent: "accent-sobrose",
    reversed: false,
    demoHref: "/sobre",
    demoLabel: "Ver demo con selector de color",
    internalRoute: "/sobre",
  },
  {
    title: "Love",
    description: [
      "Esta invitación digital de XV años está enfocado en mostrar lindas fotos, lo que más luce en esta invitación digital, son las fotos, manteniendo un aire fresco y juvenil. Esta invitación funciona muy bien con fondos vibrantes, si quieres presumir y sorprender a tus invitados de la mejor manera, esta es tu invitación de XV años perfecta.",
    ],
    image: "/promo/rubi.webp",
    imageAlt: "Muestra de invitación Love",
    accent: "accent-red",
    reversed: true,
    demoHref: "/love",
    demoLabel: "Ver el demo",
    internalRoute: "/love",
  },
  {
    title: "Zafiro",
    description: [
      "Esta invitación digital de XV años combina elegancia y dinamismo con efectos visuales impactantes y una paleta de colores actual.",
      "Con tipografía y gráficos sofisticados, ofrece personalización y un toque vanguardista, ideal para sorprender a tus invitados.",
    ],
    image: "/promo/zafiro.webp",
    imageAlt: "Muestra de invitación Zafiro",
    accent: "accent-purple",
    reversed: false,
    demoHref: "/zafiro",
    demoLabel: "Ver el demo",
    internalRoute: "/zafiro",
  },
  {
    title: "Pink",
    description: [
      "Esta elegante invitación digital de XV años se destaca por su sofisticación y formalidad, emulando la distinción de una invitación hecha en papel. Los detalles refinados y la tipografía cuidadosamente seleccionada reflejan el prestigio del evento, mientras que los fondos sutiles y elegantes complementan a la perfección las imágenes destacadas.",
    ],
    image: "/promo/amatista.webp",
    imageAlt: "Muestra de invitación Pink",
    accent: "accent-pink",
    reversed: true,
    demoHref: "/pink",
    demoLabel: "Ver el demo",
    internalRoute: "/pink",
  },
  {
    title: "Cenicienta",
    description: [
      "Esta invitación digital de XV años con temática de Cenicienta sorprenderá a todos tus invitados por su elegancia, cuidamos cada detalle de colores al diseñar esta invitación, si tu evento será de esta temática quedarás encantada con tu invitación.",
    ],
    image: "/promo/celalic.png",
    imageAlt: "Muestra de invitación Cenicienta",
    accent: "accent-blue1",
    reversed: true,
    demoHref: "/cenicienta",
    demoLabel: "Ver el demo",
    internalRoute: "/cenicienta",
  },
  {
    title: "Rosa Gold",
    description: [
      "Esta invitación digital de XV años en color rosa es de las más elegantes, se utilizó tipografía de alta gama resaltando el nombre de la quinceañera, incluye su itinerario y galería de fotos, confirmación de asistencia por medio de formulario, si quieres sorprender a tus invitados esta es tu opción.",
    ],
    image: "/promo/rosapastel.png",
    imageAlt: "Muestra de invitación Rosa Gold",
    accent: "accent-pinkk",
    reversed: false,
    demoHref: "/rosagold",
    demoLabel: "Ver el demo",
    internalRoute: "/rosagold",
  },
  {
    title: "Hogwarts",
    description: [
      "Bienvenidos a Hogwarts, invitación con temática de Harry Potter para XV, sorprenderás a tus invitados con esta elegante invitación donde la magia y los sueños se vuelven realidad.",
      "Con tipografía y gráficos sofisticados, ofrece personalización y un toque mágico, ideal para sorprender a tus invitados.",
    ],
    image: "/promo/harrys.png",
    imageAlt: "Muestra de invitación Hogwarts",
    accent: "accent-harry",
    reversed: true,
    demoHref: "/hogwarts",
    demoLabel: "Ver el demo",
    internalRoute: "/hogwarts",
  },
  {
    title: "Sello Rosa",
    description: [
      "Esta invitación digital de XV años sorprenderá a todos tus invitados empezando con un sello en el sobre con el nombre de la quinceañera, mariposas rosas con movimiento en tu invitación, es personalizada con el nombre y los pases para cada uno de tus invitados. (Esta invitación sólo se puede ver en celular)",
    ],
    image: "/promo/sellorosa.png",
    imageAlt: "Muestra de invitación Sello Rosa",
    accent: "accent-sellorosa",
    reversed: false,
    demoHref: "/sellorosa",
    demoLabel: "Ver el demo",
    internalRoute: "/sellorosa",
  },
];

function DemoLink({ href, label, internal }: { href: string; label: string; internal?: boolean }) {
  if (internal) {
    return (
      <Link href={href} className="btn-demo btn-primary">
        {label}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn-demo btn-primary">
      {label}
    </a>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <header>
        <a href="https://www.mecorr.com.mx" className="logo" target="_blank" rel="noopener noreferrer">
          <img src="/promo/logo_mecorr2.png" alt="MeCorr | Soluciones Digitales" />
        </a>
      </header>

      {/* Spacer for fixed header */}
      <div style={{ marginTop: 120 }} />

      {/* Invitation sections */}
      {invitations.map((inv, i) => (
        <section key={i} className="promo-section">
          <h2>{inv.title}</h2>
          <div className={`section-body ${inv.accent} accent ${inv.reversed ? "reverse" : ""}`}>
            {/* Info panel */}
            <div className="info-panel">
              {inv.description.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              <div className="buttons-row">
                <DemoLink
                  href={inv.internalRoute ?? inv.demoHref}
                  label={inv.demoLabel ?? "Ver el demo"}
                  internal={!!inv.internalRoute}
                />
              </div>
            </div>

            {/* Preview image */}
            <div className="main-image">
              <img src={inv.image} alt={inv.imageAlt} />
            </div>
          </div>
        </section>
      ))}

      {/* Floating WhatsApp */}
      <a
        className="whatsapp-float"
        href="https://api.whatsapp.com/send?phone=525579410833&text=Hola%2C%20me%20interesa%20una%20invitaci%C3%B3n%20digital"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/promo/whatsapp.webp" alt="WhatsApp" />
      </a>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-cols">
            <div className="footer-col">
              <h3>Información de Contacto</h3>
              <a href="mailto:contacto@mecorr.com.mx">
                <img src="/promo/icons/mail.svg" alt="Email" />
                contacto@mecorr.com.mx
              </a>
              <a href="tel:+525579410833">
                <img src="/promo/icons/brand-whatsapp.svg" alt="Teléfono" />
                +52 55 7941 0833
              </a>
              <a href="https://www.mecorr.com.mx" target="_blank" rel="noopener noreferrer">
                <img src="/promo/icons/world-www.svg" alt="Web" />
                mecorr.com.mx
              </a>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}
