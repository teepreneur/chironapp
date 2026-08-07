/**
 * Chiron Supabase Storage Buckets Creator Script
 * 
 * Creates and configures the required public storage buckets for:
 * 1. verification_docs (CV / Resume, Government ID / Passport)
 * 2. avatars (Professional Teacher Photos & Avatars)
 * 3. gig-media (Class worksheets, lesson media, PDFs)
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

const requiredBuckets = [
    { id: 'verification_docs', name: 'verification_docs', public: true },
    { id: 'avatars', name: 'avatars', public: true },
    { id: 'gig-media', name: 'gig-media', public: true }
]

async function setupStorageBuckets() {
    console.log('📦 Setting up Supabase Storage Buckets for Chiron...')

    for (const b of requiredBuckets) {
        const { data, error } = await supabase.storage.createBucket(b.id, {
            public: b.public,
            fileSizeLimit: 10485760 // 10MB
        })

        if (error) {
            if (error.message && error.message.includes('already exists')) {
                console.log(`ℹ️ Bucket '${b.id}' already exists.`)
            } else {
                console.error(`❌ Error creating bucket '${b.id}':`, error.message)
            }
        } else {
            console.log(`✅ Successfully created public bucket: '${b.id}'`)
        }
    }

    // Verify all active buckets
    const { data: buckets } = await supabase.storage.listBuckets()
    console.log('\n🎉 Active Storage Buckets in Supabase:')
    if (buckets && buckets.length > 0) {
        buckets.forEach(b => {
            console.log(`   - Bucket: ${b.id} | Public: ${b.public}`)
        })
    } else {
        console.log('   No buckets returned.')
    }
}

setupStorageBuckets()
