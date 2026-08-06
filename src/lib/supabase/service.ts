import { createClient } from '@supabase/supabase-js'

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const internalUrl = process.env.SUPABASE_INTERNAL_URL

function serverFetch(url: RequestInfo | URL, init?: RequestInit) {
  if (internalUrl && typeof url === 'string' && url.startsWith(publicUrl)) {
    url = url.replace(publicUrl, internalUrl)
  }
  return fetch(url, init)
}

/** Cliente con service role key — solo para uso en API routes (server-side). */
export function createServiceClient() {
  return createClient(publicUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    global: { fetch: serverFetch },
  })
}
