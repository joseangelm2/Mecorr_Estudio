import { GOLD_IMG_FILTER } from '@/lib/elegance-themes'

export default function EleganceFooter() {
  return (
    <>
      <img
        className="foto-full"
        src="/images/elegance/Carruaje2.png"
        style={{ width: '50%', margin: '3% auto -3%', filter: GOLD_IMG_FILTER }}
        alt=""
      />
      <div className="despedida">¡Te Esperamos!</div>
    </>
  )
}
