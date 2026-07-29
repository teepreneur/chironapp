import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

export const dynamic = 'force-dynamic'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'

// Initialize Twilio client
const client = accountSid && authToken ? twilio(accountSid, authToken) : null

// Message templates for different notification types
const templates = {
    booking_accepted: (vars: { gigTitle: string, teacherName: string, paymentLink: string }) =>
        `🎉 Great news! Your booking for "${vars.gigTitle}" with ${vars.teacherName} has been accepted!\n\nComplete your payment to confirm: ${vars.paymentLink}\n\nQuestions? Reply to this message.`,

    payment_received: (vars: { gigTitle: string, studentName: string, amount: string, parentName: string }) =>
        `💰 Payment received!\n\n${vars.parentName} has paid ${vars.amount} for "${vars.gigTitle}" (Learner: ${vars.studentName}).\n\nYou can now manage your sessions in the Chiron app.`,

    session_reminder: (vars: { gigTitle: string, studentName: string, time: string }) =>
        `⏰ Reminder: You have a session in 1 hour!\n\n"${vars.gigTitle}" with ${vars.studentName} at ${vars.time}.\n\nGood luck with your session!`,

    new_message: (vars: { senderName: string, preview: string }) =>
        `💬 New message from ${vars.senderName}:\n\n"${vars.preview}"\n\nReply in the Chiron app.`,

    custom_update: (vars: { message: string, title?: string }) =>
        `📢 Chiron Notice${vars.title ? `: ${vars.title}` : ''}\n\n${vars.message}\n\nNeed assistance? Reply directly to this message.`
}

type TemplateType = keyof typeof templates

export async function POST(req: NextRequest) {
    try {
        const { to, templateType, variables, customBody } = await req.json()

        if (!to) {
            return NextResponse.json(
                { error: 'Missing required field: to' },
                { status: 400 }
            )
        }

        if (!client) {
            console.error('Twilio client not configured - check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN')
            return NextResponse.json(
                { error: 'WhatsApp notifications not configured' },
                { status: 500 }
            )
        }

        let messageBody = ""

        if (customBody) {
            messageBody = customBody
        } else if (templateType && templates[templateType as TemplateType]) {
            const templateFn = templates[templateType as TemplateType]
            messageBody = templateFn(variables || {})
        } else {
            return NextResponse.json(
                { error: 'Invalid message request. Provide customBody or valid templateType.' },
                { status: 400 }
            )
        }

        // Format the destination number
        const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`

        // Send WhatsApp message via Twilio
        const message = await client.messages.create({
            from: twilioWhatsAppNumber,
            to: toNumber,
            body: messageBody
        })

        console.log(`WhatsApp message sent: ${message.sid} to ${to}`)

        return NextResponse.json({
            success: true,
            messageSid: message.sid,
            status: message.status
        })

    } catch (error: any) {
        console.error('WhatsApp send error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to send WhatsApp message' },
            { status: 500 }
        )
    }
}
