export interface LoveTheme {
  id: string;
  name: string;
  variables: Record<string, string>;
}

export const LOVE_THEMES: LoveTheme[] = [
  {
    id: "rosa-dorado",
    name: "Rosa Dorado",
    variables: {
      "--color-principal": "#c2185b",
      "--color-secundario": "#f48fb1",
      "--color-acento": "#d4a017",
      "--texto-claro": "#ffffff",
      "--texto-oscuro": "#3a1a2e",
    },
  },
  {
    id: "rojo-dorado",
    name: "Rojo Dorado",
    variables: {
      "--color-principal": "#b71c1c",
      "--color-secundario": "#ef9a9a",
      "--color-acento": "#d4a017",
      "--texto-claro": "#ffffff",
      "--texto-oscuro": "#2a0a0a",
    },
  },
  {
    id: "vino-dorado",
    name: "Vino Dorado",
    variables: {
      "--color-principal": "#6a1a3a",
      "--color-secundario": "#ce93b4",
      "--color-acento": "#c9a84c",
      "--texto-claro": "#fff8f8",
      "--texto-oscuro": "#2a0a1e",
    },
  },
  {
    id: "coral-dorado",
    name: "Coral Dorado",
    variables: {
      "--color-principal": "#d84315",
      "--color-secundario": "#ffab91",
      "--color-acento": "#f0b429",
      "--texto-claro": "#ffffff",
      "--texto-oscuro": "#2a0e0e",
    },
  },
];

export const DEFAULT_LOVE_THEME = LOVE_THEMES[0];
