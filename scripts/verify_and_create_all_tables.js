/**
 * Chiron Database Audit & Table Verification Script
 * Checks all 17 tables required by Chiron in Supabase.
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8')
    envConfig.split('\n').forEach(line => {
        const [key, val] = line.split('=')
        if (key && val) process.env[key.trim()] = val.trim().replace(/^["']|["']$/g, '')
    })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const allTables = [
    { name: 'profiles', description: 'User accounts (Teachers, Parents, Admins)' },
    { name: 'students', description: 'Learner/Child records linked to parents' },
    { name: 'clients', description: 'Teacher-managed client records' },
    { name: 'client_invites', description: 'Direct shareable client invitation links' },
    { name: 'gigs', description: 'Tuition class listings & subject rates' },
    { name: 'bookings', description: 'Class enrollment contracts & payments' },
    { name: 'booking_sessions', description: 'Individual live class dates & time slots' },
    { name: 'session_notes', description: 'Post-class progress & attendance notes' },
    { name: 'materials', description: 'Lesson worksheets, PDFs, homework & quizzes' },
    { name: 'roadmaps', description: 'AI personalised learning roadmaps' },
    { name: 'teacher_earnings', description: 'Escrow earnings vault & session releases' },
    { name: 'teacher_payouts', description: 'Mobile Money & Bank payout requests' },
    { name: 'conversations', description: 'In-app chat thread containers' },
    { name: 'messages', description: 'In-app chat messages' },
    { name: 'notifications', description: 'Realtime alerts & WhatsApp notification triggers' },
    { name: 'reviews', description: 'Parent ratings & reviews' },
    { name: 'support_chats', description: 'Live admin support chat threads' },
    { name: 'support_messages', description: 'Live admin support messages' },
    { name: 'support_tickets', description: 'Support tickets' },
    { name: 'admin_settings', description: 'Platform configuration settings' },
    { name: 'early_access_signups', description: 'Marketing waitlist signups' }
]

async function auditTables() {
    console.log('🔍 Auditing Chiron Supabase Database Tables...\n')
    let activeCount = 0
    let missingCount = 0

    for (const t of allTables) {
        const { error } = await supabase.from(t.name).select('id').limit(1)
        if (error && (error.message.includes('schema cache') || error.code === 'PGRST205')) {
            console.log(`❌ [MISSING] Table: '${t.name}' - ${t.description}`)
            missingCount++
        } else {
            console.log(`✅ [ACTIVE]  Table: '${t.name}' - ${t.description}`)
            activeCount++
        }
    }

    console.log(`\n📊 Audit Summary: ${activeCount} Active / ${missingCount} Missing out of ${allTables.length} Total Tables`)
}

auditTables()
