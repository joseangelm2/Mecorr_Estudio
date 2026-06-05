"use client";

import { useState, useEffect } from "react";

interface Theme {
  id: string;
  label: string;
  primary: string;
  dark: string;
  swatch: string;
  filterValue: string;
}

const THEMES: Theme[] = [
  { id: "rosagold",  label: "Rosa Gold",  primary: "#a8686a", dark: "#96585a", swatch: "#a8686a", filterValue: "hue-rotate(0deg) saturate(1)" },
  { id: "azul",      label: "Azul",        primary: "#12397A", dark: "#0e2d61", swatch: "#12397A", filterValue: "hue-rotate(210deg) saturate(2) brightness(0.85)" },
  { id: "lila",      label: "Lila",        primary: "#8d77ab", dark: "#7a6598", swatch: "#8d77ab", filterValue: "hue-rotate(260deg) saturate(1.3)" },
  { id: "rojo",      label: "Rojo",        primary: "#ff3131", dark: "#e02b2b", swatch: "#ff3131", filterValue: "hue-rotate(350deg) saturate(1.8)" },
  { id: "negro",     label: "Negro",       primary: "#424242", dark: "#333333", swatch: "#424242", filterValue: "grayscale(1) brightness(0.45)" },
  { id: "mariposas",  label: "Mariposas",    primary: "#b4882d", dark: "#9e7726", swatch: "#b4882d",  filterValue: "hue-rotate(38deg) saturate(1.4)" },
  { id: "blancooro",  label: "Blanco Oro",   primary: "#F4C430", dark: "#d4a800", swatch: "#FFD700",  filterValue: "hue-rotate(46deg) saturate(1.5) brightness(1.15)" },
];

interface ColorSwitcherProps {
  defaultTheme?: string;
  variant?: "fixed" | "inline";
}

export default function ColorSwitcher({ defaultTheme = "rosagold", variant = "fixed" }: ColorSwitcherProps) {
  const [active, setActive] = useState(defaultTheme);

  function applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.style.setProperty("--inv-primary", theme.primary);
    root.style.setProperty("--inv-primary-dark", theme.dark);
    root.style.setProperty("--inv-border", theme.primary);
    root.style.setProperty("--inv-filter", theme.filterValue);
    setActive(theme.id);
  }

  useEffect(() => {
    const initial = THEMES.find((t) => t.id === defaultTheme) ?? THEMES[0];
    applyTheme(initial);
  }, [defaultTheme]);

  return (
    <div className={`color-switcher${variant === "inline" ? " color-switcher--inline" : ""}`}>
      <div className="color-switcher-label">Paleta</div>
      <div className="color-switcher-swatches">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            className={`color-swatch${active === theme.id ? " active" : ""}`}
            style={{ background: theme.swatch }}
            title={theme.label}
            aria-label={`Tema ${theme.label}`}
            onClick={() => applyTheme(theme)}
          />
        ))}
      </div>
    </div>
  );
}
