import type { Metadata } from 'next'
import {
  Raleway, Albert_Sans, Beau_Rivage, Mea_Culpa,
  Carattere, Bellefair, Cormorant_Garamond, Old_Standard_TT,
  Dancing_Script, Tangerine, DM_Sans,
} from 'next/font/google'

const raleway     = Raleway({ variable: '--font-raleway',      subsets: ['latin'], weight: ['400', '600', '700'] })
const albert      = Albert_Sans({ variable: '--font-albert',   subsets: ['latin'], weight: ['200', '300', '400', '500'] })
const beau        = Beau_Rivage({ variable: '--font-beau',      subsets: ['latin'], weight: '400' })
const meaCulpa    = Mea_Culpa({ variable: '--font-meaculpa',   subsets: ['latin'], weight: '400' })
const carattere   = Carattere({ variable: '--font-carattere',  subsets: ['latin'], weight: '400' })
const bellefair   = Bellefair({ variable: '--font-bellefair',  subsets: ['latin'], weight: '400' })
const cormorant   = Cormorant_Garamond({ variable: '--font-cormorant', subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const oldStandard = Old_Standard_TT({ variable: '--font-old-standard', subsets: ['latin'], weight: ['400', '700'] })
const dancing     = Dancing_Script({ variable: '--font-dancing',   subsets: ['latin'], weight: ['400', '700'] })
const tangerine   = Tangerine({ variable: '--font-tangerine',      subsets: ['latin'], weight: ['400', '700'] })
const dmSans      = DM_Sans({ variable: '--font-dm-sans',          subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Invitación',
  description: 'Te Invito a Mi Día Más Especial',
}

export default function InvitationLayout({ children }: { children: React.ReactNode }) {
  const fonts = [
    raleway.variable, albert.variable, beau.variable, meaCulpa.variable,
    carattere.variable, bellefair.variable, cormorant.variable, oldStandard.variable,
    dancing.variable, tangerine.variable, dmSans.variable,
  ].join(' ')

  return (
    <div id="body" className={`bg-invitacion ${fonts}`}>
      {children}
    </div>
  )
}
