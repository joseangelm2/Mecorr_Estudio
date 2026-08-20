import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const internalUrl = process.env.SUPABASE_INTERNAL_URL

function serverFetch(url: RequestInfo | URL, init?: RequestInit) {
  if (internalUrl && typeof url === 'string' && url.startsWith(publicUrl)) {
    url = url.replace(publicUrl, internalUrl)
  }
  return fetch(url, init)
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    publicUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: serverFetch },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sesión — actualiza cookies antes de verificar
  const { data: { user } } = await supabase.auth.getUser()

  const publicAdminPaths = ['/admin/login', '/admin/forgot-password', '/admin/reset-password']

  if (!user && !publicAdminPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
