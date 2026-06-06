"use client";

import { useState, useEffect } from "react";
import { THEMES } from "@/lib/themes";
import type { Theme } from "@/lib/themes";

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
    root.style.setProperty("--inv-primary-light", theme.light ?? theme.primary);
    root.style.setProperty("--inv-filter", theme.filterValue);
    root.style.setProperty("--inv-filter-light", theme.filterLight);
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
