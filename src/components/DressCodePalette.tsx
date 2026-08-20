import type { Project } from "@/types/invitation";

interface DressPaletteEntry {
  name: string;
  colors: string[];
}

interface Props {
  project: Project;
}

export default function DressCodePalette({ project }: Props) {
  const showPalette = project.extra_config?.show_dress_palette === true;
  const palette = (project.extra_config?.dress_palette as DressPaletteEntry[] | undefined) ?? [];
  const imageUrl = (project.extra_config?.dress_code_image_url as string) || null;

  if (!(showPalette && palette.length > 0) && !imageUrl) return null;

  return (
    <>
      {showPalette && palette.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "16px", marginTop: "20px" }}>
          {palette.map((entry, i) => {
            const bg = entry.colors.length === 1
              ? entry.colors[0]
              : `linear-gradient(to right, ${entry.colors.join(", ")})`;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: bg,
                    border: "2px solid rgba(0,0,0,0.1)",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "12px", maxWidth: "70px", textAlign: "center" }}>{entry.name}</span>
              </div>
            );
          })}
        </div>
      )}
      {imageUrl && (
        <div style={{ marginTop: "24px" }}>
          <img src={imageUrl} alt="Referencia de vestimenta" style={{ maxWidth: "100%", borderRadius: "12px" }} />
        </div>
      )}
    </>
  );
}
