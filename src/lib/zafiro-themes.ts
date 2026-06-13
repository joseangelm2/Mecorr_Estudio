export interface ZafiroTheme {
  id: string;
  name: string;
  variables: Record<string, string>;
}

export const ZAFIRO_THEMES: ZafiroTheme[] = [
  {
    id: "morado-dorado",
    name: "Morado Dorado",
    variables: {
      "--color-principal": "#775197",
      "--color-secundario": "#c9a0dc",
      "--color-acento": "#c9a84c",
      "--texto-claro": "#ffffff",
      "--texto-oscuro": "#1e0a2e",
    },
  },
  {
    id: "azul-dorado",
    name: "Azul Dorado",
    variables: {
      "--color-principal": "#1a3a6b",
      "--color-secundario": "#7eaad4",
      "--color-acento": "#c9a84c",
      "--texto-claro": "#ffffff",
      "--texto-oscuro": "#0a1a2e",
    },
  },
  {
    id: "marino-dorado",
    name: "Marino Dorado",
    variables: {
      "--color-principal": "#0d2340",
      "--color-secundario": "#4a7fa5",
      "--color-acento": "#d4a017",
      "--texto-claro": "#f0f4ff",
      "--texto-oscuro": "#0a1020",
    },
  },
  {
    id: "esmeralda-dorado",
    name: "Esmeralda Dorado",
    variables: {
      "--color-principal": "#1a5c3a",
      "--color-secundario": "#5aa87a",
      "--color-acento": "#c9a84c",
      "--texto-claro": "#ffffff",
      "--texto-oscuro": "#0a1e14",
    },
  },
];

export const DEFAULT_ZAFIRO_THEME = ZAFIRO_THEMES[0];
