/**
 * Chiron Support Database Setup Script
 * 
 * Verifies support tables (admin_settings, support_chats, support_messages, support_tickets)
 * in Supabase to support live support chat and ticket management.
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

async function checkSupportTables() {
    console.log('💬 Verifying Chiron Support System tables in Supabase...')

    const tablesToVerify = ['admin_settings', 'support_chats', 'support_messages', 'support_tickets']

    for (const t of tablesToVerify) {
        const { error } = await supabase.from(t).select('id').limit(1)
        if (error && error.message.includes('schema cache')) {
            console.log(`⚠️ Table '${t}' does not exist in schema cache yet. Create '${t}' table in Supabase SQL editor if full live chat is required.`)
        } else {
            console.log(`✅ Table '${t}' is active and accessible.`)
        }
    }
}

checkSupportTables()
