import { NextResponse } from 'next/server'
import { getAdminUserId } from '@/lib/admin-auth'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: Request) {
    // Check admin session
    const adminUserId = await getAdminUserId()
    if (!adminUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { currentPassword, newPassword, confirmPassword } = body

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        return NextResponse.json({ error: 'Kaikki kentät ovat pakollisia' }, { status: 400 })
    }
    if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: 'Uudet salasanat eivät täsmää' }, { status: 400 })
    }
    if (typeof newPassword !== 'string' || newPassword.length < 12) {
        return NextResponse.json({ error: 'Salasanan on oltava vähintään 12 merkkiä pitkä' }, { status: 400 })
    }

    // Verify current password by trying to sign in with Supabase
    const verifyRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: currentPassword }),
    })

    if (!verifyRes.ok) {
        return NextResponse.json({ error: 'Nykyinen salasana on väärä' }, { status: 400 })
    }

    // Update password via Admin API
    const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${adminUserId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ password: newPassword }),
    })

    if (!updateRes.ok) {
        return NextResponse.json({ error: 'Salasanan päivitys epäonnistui' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Salasana vaihdettu onnistuneesti' })
}
