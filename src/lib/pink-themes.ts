export interface PinkTheme {
  id: string;
  name: string;
  variables: Record<string, string>;
}

export const PINK_THEMES: PinkTheme[] = [
  {
    id: "dorado-rosa",
    name: "Dorado Rosa",
    variables: {
      "--color-principal": "#c48602",
      "--color-secundario": "#f7d080",
      "--color-acento": "#e8b4c8",
      "--texto-claro": "#ffffff",
      "--texto-oscuro": "#2a1a0a",
    },
  },
  {
    id: "rosa-dorado",
    name: "Rosa Dorado",
    variables: {
      "--color-principal": "#d4608a",
      "--color-secundario": "#f4a0c0",
      "--color-acento": "#c9a84c",
      "--texto-claro": "#ffffff",
      "--texto-oscuro": "#2a0a18",
    },
  },
  {
    id: "champagne",
    name: "Champagne",
    variables: {
      "--color-principal": "#b8860b",
      "--color-secundario": "#f0d080",
      "--color-acento": "#e8c8b0",
      "--texto-claro": "#fff8f0",
      "--texto-oscuro": "#1a1006",
    },
  },
  {
    id: "coral-dorado",
    name: "Coral Dorado",
    variables: {
      "--color-principal": "#c0604a",
      "--color-secundario": "#f0a090",
      "--color-acento": "#c9a84c",
      "--texto-claro": "#ffffff",
      "--texto-oscuro": "#2a0e0a",
    },
  },
];

export const DEFAULT_PINK_THEME = PINK_THEMES[0];
