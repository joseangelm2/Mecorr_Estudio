import type { Project } from "@/types/invitation";

interface Props {
  project?: Project;
}

export default function EsmeraldaDecorations({ project }: Props) {
  const regaloSrc = (project?.extra_config?.regalo_url as string) || "/images/esmeralda/regalo.png";
  const estrellaSrc = (project?.extra_config?.estrella_url as string) || "/images/esmeralda/estrella.png";
  // 5 decorativos distintos (v1-v5) — cada uno con su propio override independiente.
  const v1Src = (project?.extra_config?.decorativo1_url as string) || "/images/esmeralda/v1.png";
  const v2Src = (project?.extra_config?.decorativo2_url as string) || "/images/esmeralda/v2.png";
  const v3Src = (project?.extra_config?.decorativo3_url as string) || "/images/esmeralda/v3.png";
  const v4Src = (project?.extra_config?.decorativo4_url as string) || "/images/esmeralda/v4.png";
  const v5Src = (project?.extra_config?.decorativo5_url as string) || "/images/esmeralda/v5.png";

  return (
    <div className="decorations no-print">
      {/* Regalos */}
      <img className="item1" src={regaloSrc} alt="" />
      <img className="item2" src={regaloSrc} alt="" />
      <img className="item3" src={regaloSrc} alt="" />
      <img className="item4" src={regaloSrc} alt="" />
      <img className="item5" src={regaloSrc} alt="" />
      {/* Estrellas */}
      <img className="item11" src={estrellaSrc} alt="" />
      <img className="item12" src={estrellaSrc} alt="" />
      <img className="item13" src={estrellaSrc} alt="" />
      <img className="item14" src={estrellaSrc} alt="" />
      <img className="item15" src={estrellaSrc} alt="" />
      {/* Razhos / v-shapes */}
      <img className="item21" src={v3Src} alt="" />
      <img className="item22" src={v1Src} alt="" />
      <img className="item23" src={v2Src} alt="" />
      <img className="item24" src={v4Src} alt="" />
      <img className="item25" src={v5Src} alt="" />
      <img className="item26" src={v1Src} alt="" />
    </div>
  );
}
