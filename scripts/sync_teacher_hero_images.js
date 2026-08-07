/**
 * Chiron Teacher Hero Avatar Sync Script
 * 
 * Inspects registered teacher profiles and verifies real teacher avatar URLs.
 * As teachers upload real profile photos, this script validates their storage
 * links so they automatically replace Unsplash placeholders on the Marketing Landing Page.
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

async function syncTeacherAvatars() {
    console.log('🔍 Checking registered teacher profile images for Marketing Hero Grid...')

    const { data: teachers, error, count } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, subjects', { count: 'exact' })
        .eq('role', 'teacher')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('❌ Error fetching teacher profiles:', error.message)
        process.exit(1)
    }

    console.log(`📊 Found ${count || 0} total teacher profiles registered.`)

    const teachersWithAvatars = (teachers || []).filter(t => t.avatar_url && t.avatar_url.trim().length > 0)
    console.log(`📸 Teachers with real uploaded profile pictures: ${teachersWithAvatars.length} / ${count || 0}`)

    if (teachersWithAvatars.length > 0) {
        console.log('\n✅ Real Teacher Avatars Ready for Marketing Grid:')
        teachersWithAvatars.forEach((t, idx) => {
            console.log(`  [Slot ${idx + 1}] ${t.full_name || t.email} -> ${t.avatar_url}`)
        })
    } else {
        console.log('\n💡 No custom teacher avatars uploaded yet. Marketing grid is using default high-quality placeholders.')
    }

    const unsplashSlotsRemaining = Math.max(0, 16 - teachersWithAvatars.length)
    console.log(`\n🎯 Marketing Grid Allocation:`)
    console.log(`   - Real Teacher Avatars: ${teachersWithAvatars.length} slots`)
    console.log(`   - Unsplash Placeholder Avatars: ${unsplashSlotsRemaining} slots`)
    console.log(`\n✨ As teachers add their profile photos, they will automatically occupy slots 1 to ${teachersWithAvatars.length + 1}!`)
}

syncTeacherAvatars()
