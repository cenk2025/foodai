// Signed admin session cookie.
//
// Cookie value: `<base64url payload>.<base64url HMAC-SHA256>` where payload is
// `{ sub, exp }`. Uses Web Crypto so the same code runs in middleware (edge)
// and in route handlers / server actions (node).

export const ADMIN_COOKIE = 'admin_session'
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 // 24 hours

type AdminSessionPayload = { sub: string; exp: number }

const encoder = new TextEncoder()

function getSecret(): string {
    const secret = process.env.ADMIN_SESSION_SECRET
    if (!secret || secret.length < 32) {
        throw new Error('ADMIN_SESSION_SECRET must be set (at least 32 characters)')
    }
    return secret
}

function toBase64Url(bytes: Uint8Array): string {
    let bin = ''
    for (const b of bytes) bin += String.fromCharCode(b)
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(input: string): Uint8Array<ArrayBuffer> {
    const b64 = input.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
    return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}

async function hmacKey(): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'raw',
        encoder.encode(getSecret()),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify'],
    )
}

export async function createAdminSessionToken(sub: string): Promise<string> {
    const payload: AdminSessionPayload = {
        sub,
        exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
    }
    const body = toBase64Url(encoder.encode(JSON.stringify(payload)))
    const sig = await crypto.subtle.sign('HMAC', await hmacKey(), encoder.encode(body))
    return `${body}.${toBase64Url(new Uint8Array(sig))}`
}

// Returns the payload when the token is authentic and unexpired, else null.
// Never throws on malformed input.
export async function verifyAdminSessionToken(
    token: string | undefined,
): Promise<AdminSessionPayload | null> {
    if (!token) return null
    const [body, sig, extra] = token.split('.')
    if (!body || !sig || extra !== undefined) return null
    try {
        // crypto.subtle.verify is constant-time with respect to the signature.
        const ok = await crypto.subtle.verify(
            'HMAC',
            await hmacKey(),
            fromBase64Url(sig),
            encoder.encode(body),
        )
        if (!ok) return null
        const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as AdminSessionPayload
        if (typeof payload.sub !== 'string' || typeof payload.exp !== 'number') return null
        if (payload.exp <= Math.floor(Date.now() / 1000)) return null
        return payload
    } catch {
        return null
    }
}
