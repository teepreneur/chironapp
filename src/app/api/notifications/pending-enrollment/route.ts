import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

// Create admin client for sending emails via Supabase
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
)

export async function POST(request: NextRequest) {
    try {
        const { teacherEmail, teacherName, studentName, gigTitle, parentName } = await request.json()

        if (!teacherEmail || !studentName || !gigTitle) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Get teacher profile by email
        const { data: teacherProfile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', teacherEmail)
            .single()

        if (teacherProfile) {
            // Create in-app notification
            await supabaseAdmin.from('notifications').insert({
                user_id: teacherProfile.id,
                type: 'new_enrollment',
                title: 'New Enrollment Request',
                message: `${studentName} has requested to enroll in "${gigTitle}". Parent: ${parentName || 'Unknown'}. Please review and approve.`,
                action_url: '/teacher/students?filter=pending'
            })
        }

        // Integrate actual email sending with Resend
        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY)
                await resend.emails.send({
                    from: 'Chiron <hello@chironlearning.com>',
                    to: teacherEmail,
                    subject: `New Enrollment Request: ${gigTitle}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 12px;">
                            <h2 style="color: #0b6e4f;">New Enrollment Request</h2>
                            <p>Hi ${teacherName || 'Teacher'},</p>
                            <p>Great news! <strong>${studentName}</strong> has requested to enroll in your course "<strong>${gigTitle}</strong>".</p>
                            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 0;"><strong>Student / Learner:</strong> ${studentName}</p>
                                <p style="margin: 5px 0 0 0;"><strong>Client / Parent:</strong> ${parentName || 'Unknown'}</p>
                            </div>
                            <p>Please log in to your dashboard to review the request and approve the enrollment.</p>
                            <div style="margin-top: 30px;">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://app.chironlearning.com'}/teacher/clients" 
                                   style="background-color: #0b6e4f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                    Review Request
                                </a>
                            </div>
                            <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;" />
                            <p style="font-size: 12px; color: #666;">
                                You are receiving this because a client requested an enrollment in your course on Chiron.
                            </p>
                        </div>
                    `
                })
                console.log(`[Notification] Resend email successfully sent to ${teacherEmail}`)
            } catch (emailError) {
                console.error('Error sending email via Resend:', emailError)
                // We don't fail the whole request if email fails, as the in-app notification was created
            }
        } else {
            console.warn('[Notification] RESEND_API_KEY missing. Skipping email sending.')
        }

        return NextResponse.json({
            success: true,
            message: 'Notification processed successfully'
        })
    } catch (error) {
        console.error('Notification error:', error)
        return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 })
    }
}
