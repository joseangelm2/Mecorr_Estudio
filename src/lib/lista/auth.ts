import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.LISTA_JWT_SECRET ?? 'dev-secret-change-in-prod'
const EXPIRES_IN = '30m'

export interface ListaTokenPayload {
  slug: string
  iat?: number
  exp?: number
}

export function signToken(slug: string): string {
  return jwt.sign({ slug }, JWT_SECRET, { expiresIn: EXPIRES_IN })
}

export function verifyToken(token: string): ListaTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as ListaTokenPayload
  } catch {
    return null
  }
}

/** Extrae el token del header Authorization: Bearer <token> */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}
