import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const internalUrl = process.env.SUPABASE_INTERNAL_URL

function serverFetch(url: RequestInfo | URL, init?: RequestInit) {
  if (internalUrl && typeof url === 'string' && url.startsWith(publicUrl)) {
    url = url.replace(publicUrl, internalUrl)
  }
  return fetch(url, init)
}

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    publicUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: serverFetch },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component — ignore cookie set errors
          }
        },
      },
    }
  )
}
