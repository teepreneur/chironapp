import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authErr } = await supabase.auth.getUser()

        if (authErr || !user) {
            return NextResponse.json({ error: 'Unauthorized. Please log in again.' }, { status: 401 })
        }

        const body = await request.json()
        const {
            full_name, bio, subjects, city, country, avatar_url,
            momo_number, momo_network, hourly_rate
        } = body

        // Prepare clean payload containing only valid profiles columns
        const updatePayload: Record<string, any> = {
            updated_at: new Date().toISOString()
        }

        if (full_name !== undefined) updatePayload.full_name = full_name
        if (bio !== undefined) updatePayload.bio = bio
        if (subjects !== undefined) updatePayload.subjects = Array.isArray(subjects) ? subjects : []
        if (city !== undefined) updatePayload.city = city
        if (country !== undefined) updatePayload.country = country
        if (avatar_url !== undefined) updatePayload.avatar_url = avatar_url
        if (momo_number !== undefined) updatePayload.momo_number = momo_number
        if (momo_network !== undefined) updatePayload.momo_network = momo_network

        // Use service role admin client if available to bypass client RLS restrictions
        let dbClient = supabase
        if (supabaseUrl && serviceRoleKey) {
            dbClient = createAdminClient(supabaseUrl, serviceRoleKey) as any
        }

        const { data, error } = await dbClient
            .from('profiles')
            .update(updatePayload)
            .eq('id', user.id)
            .select()
            .single()

        if (error) {
            console.error('[Profile Update API Error]:', error)
            return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully!',
            profile: data
        })

    } catch (err: any) {
        console.error('[Profile Update Route Exception]:', err)
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
    }
}
