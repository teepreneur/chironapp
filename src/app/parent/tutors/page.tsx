import { createClient } from "@/lib/supabase/server"
import TutorsList from "./_components/tutors-list"

export default async function FindTutorsPage() {
    const supabase = await createClient()

    // Fetch current user's profile for location-based matching
    const { data: { user } } = await supabase.auth.getUser()
    let parentLocation: { country: string | null; city: string | null; class_mode: string | null } = {
        country: null,
        city: null,
        class_mode: null
    }

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('country, city, class_mode')
            .eq('id', user.id)
            .single()

        if (profile) {
            parentLocation = {
                country: (profile as any).country || null,
                city: (profile as any).city || null,
                class_mode: (profile as any).class_mode || null
            }
        }
    }

    // Fetch active gigs with teacher details
    const { data: gigs } = await supabase
        .from('gigs')
        .select('*, teacher:profiles(id, full_name, avatar_url, bio, subjects, country, city, class_mode, verified_at)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    // Fetch verified teacher profiles
    const { data: teacherProfiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, bio, subjects, country, city, class_mode, verified_at')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false })

    const activeGigTeacherIds = new Set((gigs || []).map((g: any) => g.teacher?.id || g.teacher_id))

    // Create profile-based gig entries for verified teachers who haven't published a gig yet
    const teacherProfileGigs = (teacherProfiles || [])
        .filter((t: any) => !activeGigTeacherIds.has(t.id))
        .map((t: any) => ({
            id: `teacher-profile-${t.id}`,
            teacher_id: t.id,
            title: `${t.full_name || 'Verified Educator'} — Private Tutoring`,
            subject: t.subjects?.[0] || 'General Studies',
            description: t.bio || 'Experienced private educator available for lessons.',
            price: 80,
            status: 'active',
            class_mode: t.class_mode || 'both',
            total_sessions: 4,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            teacher: t
        }))

    const combinedGigs = [...(gigs || []), ...teacherProfileGigs]

    return (
        <TutorsList initialGigs={combinedGigs as any} parentLocation={parentLocation} />
    )
}
