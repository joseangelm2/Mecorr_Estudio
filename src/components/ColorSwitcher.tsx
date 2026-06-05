"use client";

import { useState, useEffect } from "react";

interface Theme {
  id: string;
  label: string;
  primary: string;
  dark: string;
  swatch: string;
}

const THEMES: Theme[] = [
  { id: "rosagold",  label: "Rosa Gold",  primary: "#a8686a", dark: "#96585a", swatch: "#a8686a" },
  { id: "azul",      label: "Azul",        primary: "#12397A", dark: "#0e2d61", swatch: "#12397A" },
  { id: "lila",      label: "Lila",        primary: "#8d77ab", dark: "#7a6598", swatch: "#8d77ab" },
  { id: "rojo",      label: "Rojo",        primary: "#ff3131", dark: "#e02b2b", swatch: "#ff3131" },
  { id: "negro",     label: "Negro",       primary: "#424242", dark: "#333333", swatch: "#424242" },
  { id: "mariposas", label: "Mariposas",   primary: "#b4882d", dark: "#9e7726", swatch: "#b4882d" },
];

interface ColorSwitcherProps {
  defaultTheme?: string;
}

export default function ColorSwitcher({ defaultTheme = "rosagold" }: ColorSwitcherProps) {
  const [active, setActive] = useState(defaultTheme);

  function applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.style.setProperty("--inv-primary", theme.primary);
    root.style.setProperty("--inv-primary-dark", theme.dark);
    root.style.setProperty("--inv-border", theme.primary);
    setActive(theme.id);
  }

  useEffect(() => {
    const initial = THEMES.find((t) => t.id === defaultTheme) ?? THEMES[0];
    applyTheme(initial);
  }, [defaultTheme]);

  return (
    <div className="color-switcher">
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
