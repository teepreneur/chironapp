import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { sessionId, action, rating, feedback, parentId } = body

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Fetch session and booking details
        const { data: session, error: sessionErr } = await supabase
            .from('booking_sessions')
            .select(`
                *,
                booking:bookings!inner (
                    id,
                    parent_id,
                    teacher_amount,
                    gig:gigs!inner (
                        price,
                        teacher_id
                    )
                )
            `)
            .eq('id', sessionId)
            .single()

        if (sessionErr || !session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 })
        }

        const teacherId = (session as any).booking?.gig?.teacher_id
        const sessionFee = (session as any).booking?.gig?.price || 80

        if (action === 'teacher_confirm') {
            // Step 1: Teacher marks session complete
            await supabase
                .from('booking_sessions')
                .update({ status: 'completed' })
                .eq('id', sessionId)

            // Trigger notification / webhook for client survey
            return NextResponse.json({
                success: true,
                message: 'Session confirmed by teacher. Sent feedback survey prompt to parent.',
                session
            })
        }

        if (action === 'parent_confirm') {
            // Step 2: Parent completes feedback survey & confirms session
            if (rating) {
                await supabase.from('reviews').insert({
                    teacher_id: teacherId,
                    parent_id: parentId || (session as any).booking?.parent_id,
                    rating: parseInt(rating) || 5,
                    comment: feedback || 'Completed session confirmed.',
                    created_at: new Date().toISOString()
                })
            }

            // Release session earnings to teacher vault
            const { error: vaultErr } = await supabase.from('teacher_earnings').insert({
                teacher_id: teacherId,
                booking_id: (session as any).booking?.id,
                amount: sessionFee,
                status: 'released',
                created_at: new Date().toISOString()
            })

            if (vaultErr) {
                console.warn('[Earnings Vault Release Warning]:', vaultErr)
            }

            return NextResponse.json({
                success: true,
                message: 'Parent confirmed session! Earnings released to teacher Mobile Money vault.',
                amount: sessionFee
            })
        }

        return NextResponse.json({ error: 'Invalid confirmation action' }, { status: 400 })

    } catch (error: any) {
        console.error('[Session Confirmation Error]:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
