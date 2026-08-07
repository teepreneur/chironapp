import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import twilio from 'twilio'

export const dynamic = 'force-dynamic'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'

const client = accountSid && authToken ? twilio(accountSid, authToken) : null

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const todayStr = new Date().toISOString().split('T')[0]

        // Fetch scheduled sessions for today and upcoming days
        const { data: sessions, error } = await supabase
            .from('booking_sessions')
            .select(`
                id,
                session_date,
                session_time,
                session_number,
                status,
                booking:bookings!inner (
                    gig:gigs!inner (
                        title,
                        subject,
                        teacher_id
                    ),
                    student:students (name),
                    parent:profiles!bookings_parent_id_fkey (full_name, phone)
                )
            `)
            .in('status', ['scheduled', 'confirmed'])
            .gte('session_date', todayStr)

        if (error) {
            console.error('[Reminders Cron Error]:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        let sentCount = 0

        for (const s of (sessions || [])) {
            const parentPhone = (s as any).booking?.parent?.phone
            const parentName = (s as any).booking?.parent?.full_name || 'Client'
            const studentName = (s as any).booking?.student?.name || 'Student'
            const classTitle = (s as any).booking?.gig?.title || 'Tuition Session'

            if (parentPhone && client) {
                try {
                    const formattedPhone = parentPhone.startsWith('whatsapp:')
                        ? parentPhone
                        : `whatsapp:${parentPhone.replace(/\s+/g, '')}`

                    const messageText = `Hello ${parentName}! 📚 Reminder from Chiron: Your ${classTitle} class for ${studentName} is scheduled on ${s.session_date} at ${s.session_time || '10:00 AM'}. Please ensure student readiness!`

                    await client.messages.create({
                        from: twilioWhatsAppNumber,
                        to: formattedPhone,
                        body: messageText
                    })

                    sentCount++
                } catch (msgErr) {
                    console.warn(`[Twilio Warning] Could not send to ${parentPhone}:`, msgErr)
                }
            }
        }

        return NextResponse.json({
            success: true,
            sessionsCount: sessions?.length || 0,
            remindersSent: sentCount,
            message: `Processed WhatsApp reminders for upcoming classes.`
        })

    } catch (err: any) {
        console.error('[WhatsApp Reminders Scheduler Error]:', err)
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
    }
}
