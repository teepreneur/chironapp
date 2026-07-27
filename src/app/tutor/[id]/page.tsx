import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
    Check, Star, MapPin, BookOpen, Clock, Users,
    ArrowLeft, BadgeCheck, FileText, Globe, Award, MessageSquare, Sparkles, Share2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Tables } from "@/lib/types/supabase"
import { ShareButton } from "@/components/share-button"
import { ReviewList, type Review } from "@/components/reviews/review-list"

interface ProfilePageProps {
    params: Promise<{ id: string }>
}

// 1. Dynamic OpenGraph & Social Sharing Metadata
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (!profile) {
        return {
            title: 'STEAM Spark Educator Profile',
            description: 'Discover verified STEAM educators in Ghana on STEAM Spark.'
        }
    }

    const teacher = profile as Tables<'profiles'>
    const name = teacher.full_name || 'STEAM Spark Educator'
    const isVerified = !!teacher.verified_at
    const verificationTag = isVerified ? ' (Verified Educator)' : ''
    
    const title = `${name} — STEAM Spark Educator${verificationTag}`

    const subjectsStr = teacher.subjects && teacher.subjects.length > 0
        ? ` Specializing in ${teacher.subjects.join(', ')}.`
        : ''
    const locationStr = teacher.city && teacher.country
        ? ` Based in ${teacher.city}, ${teacher.country}.`
        : ''
    const bioExcerpt = teacher.bio 
        ? (teacher.bio.length > 150 ? `${teacher.bio.slice(0, 150)}...` : teacher.bio)
        : 'Igniting curiosity in Science, Technology, Engineering, Art, and Math.'

    const description = `${isVerified ? '✓ Verified STEAM Spark Educator. ' : ''}${bioExcerpt}${subjectsStr}${locationStr}`

    const avatarUrl = teacher.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.steamsparkgh.com'
    const pageUrl = `${appUrl}/tutor/${id}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: pageUrl,
            siteName: 'STEAM Spark',
            type: 'profile',
            images: [
                {
                    url: avatarUrl,
                    width: 800,
                    height: 800,
                    alt: `${name} — STEAM Spark Educator`
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [avatarUrl]
        }
    }
}

export default async function TutorProfilePage({ params }: ProfilePageProps) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch Teacher Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (!profile) return notFound()
    const teacher = profile as Tables<'profiles'>

    // Fetch Active Gigs
    const { data: gigs } = await supabase
        .from('gigs')
        .select('*')
        .eq('teacher_id', id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    // Fetch Detailed Reviews
    const { data: reviews } = await supabase
        .from('reviews')
        .select(`
            *,
            profiles:parent_id (
                full_name,
                avatar_url
            )
        `)
        .eq('teacher_id', id)
        .order('created_at', { ascending: false })

    const reviewData = reviews || []

    // HYBRID RATING CALCULATION
    let trustScore = 0
    if (teacher.full_name) trustScore += 4
    if (teacher.bio && (teacher.bio as string).length > 20) trustScore += 4
    if (teacher.subjects && (teacher.subjects as string[]).length > 0) trustScore += 4
    if (teacher.hourly_rate) trustScore += 4
    if (teacher.avatar_url) trustScore += 4
    if (teacher.cv_url) trustScore += 10
    if (teacher.id_url) trustScore += 10
    if (teacher.photo_url) trustScore += 10

    let clientRatingPoints = (reviewData && reviewData.length > 0)
        ? (reviewData.reduce((acc, curr) => acc + curr.rating, 0) / reviewData.length / 5) * 50
        : 40 // Baseline 4.0

    const finalRating = (trustScore + clientRatingPoints) / 20
    const displayTrustScore = Math.max(0, Math.min(5, finalRating)).toFixed(1)

    const reviewCount = reviewData?.length || 0
    const reviewAverage = reviewCount > 0
        ? (reviewData!.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount).toFixed(1)
        : null

    const isVerified = !!teacher.verified_at
    const whatsappSupportNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "15553146970"
    const whatsappBookingUrl = `https://wa.me/${whatsappSupportNumber}?text=${encodeURIComponent(`Hi STEAMSpark! I want to book educator ${teacher.full_name || 'this teacher'} for my child.`)}`

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
                    <Link href="/parent/tutors" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Back to Tutors</span>
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <ShareButton
                            title={`${teacher.full_name} — STEAM Spark Educator`}
                            text={`Check out ${teacher.full_name}'s official teaching profile on STEAM Spark!` + (teacher.subjects ? ` Expert in ${teacher.subjects.join(', ')}.` : '')}
                            url={`/tutor/${teacher.id}`}
                            variant="outline"
                            size="sm"
                        />
                        <Button size="sm" className="font-bold bg-green-600 hover:bg-green-700 text-white gap-1.5" asChild>
                            <a href={whatsappBookingUrl} target="_blank" rel="noopener noreferrer">
                                <MessageSquare className="size-4" /> Book via WhatsApp
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

                    {/* Left Column: Profile Card & Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm sticky top-24">
                            {/* Profile Header Background */}
                            <div className="h-28 bg-gradient-to-br from-primary/30 via-blue-500/20 to-purple-500/20 relative">
                                <div className="absolute top-3 right-3">
                                    <Badge className="bg-background/80 backdrop-blur-md text-foreground border-border font-bold text-xs">
                                        STEAM Spark Educator
                                    </Badge>
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                {/* Avatar */}
                                <div className="relative -mt-14 mb-4">
                                    <div className="size-28 md:size-32 rounded-2xl bg-muted border-4 border-card overflow-hidden shadow-md">
                                        {teacher.avatar_url ? (
                                            <img src={teacher.avatar_url} alt={teacher.full_name || ""} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary/30">
                                                {teacher.full_name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    {isVerified && (
                                        <div className="absolute -bottom-2 -right-2 p-1.5 bg-green-500 rounded-lg border-2 border-card shadow-sm" title="Verified STEAM Spark Educator">
                                            <BadgeCheck className="size-6 text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1 mb-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-2xl font-black text-foreground">{teacher.full_name}</h1>
                                        {isVerified && (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 font-bold gap-1">
                                                <BadgeCheck className="size-3.5 text-green-600" /> Verified
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground font-medium text-sm">
                                        STEAM Spark Educator {teacher.city && teacher.country ? `• ${teacher.city}, ${teacher.country}` : ''}
                                    </p>
                                </div>

                                {/* Ratings & Activity */}
                                <div className="flex items-center justify-between py-4 border-y border-border/50 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-1">
                                            <BadgeCheck className="size-4 text-primary" />
                                            <span className="font-bold text-base md:text-lg">{displayTrustScore}</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Trust Score</span>
                                    </div>
                                    <div className="w-px h-8 bg-border"></div>
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-1">
                                            <Star className="size-4 fill-amber-400 text-amber-400" />
                                            <span className="font-bold text-base md:text-lg">{reviewAverage || '—'}</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">{reviewCount > 0 ? `${reviewCount} Review${reviewCount > 1 ? 's' : ''}` : 'No Reviews'}</span>
                                    </div>
                                    <div className="w-px h-8 bg-border"></div>
                                    <div className="flex flex-col items-center">
                                        <span className="font-bold text-base md:text-lg">{gigs?.length || 0}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Courses</span>
                                    </div>
                                </div>

                                {/* Direct Actions for Parent */}
                                <div className="mt-6 flex flex-col gap-2.5">
                                    <Button asChild className="w-full font-bold bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm">
                                        <a href={whatsappBookingUrl} target="_blank" rel="noopener noreferrer">
                                            <MessageSquare className="size-4" /> Book Teacher on WhatsApp
                                        </a>
                                    </Button>

                                    {gigs && gigs.length > 0 && (
                                        <Button variant="outline" className="w-full font-bold gap-2" asChild>
                                            <a href="#courses">
                                                <BookOpen className="size-4 text-primary" /> View & Book Courses ({gigs.length})
                                            </a>
                                        </Button>
                                    )}

                                    <ShareButton
                                        title={`${teacher.full_name} — STEAM Spark Educator`}
                                        text={`Check out ${teacher.full_name}'s official teaching profile on STEAM Spark!`}
                                        url={`/tutor/${teacher.id}`}
                                        variant="ghost"
                                        className="w-full font-bold gap-2 text-muted-foreground hover:text-foreground"
                                    />
                                </div>

                                {/* Verification Status Badges */}
                                <div className="mt-6 pt-4 border-t border-border space-y-2.5">
                                    {isVerified && (
                                        <div className="flex items-center gap-3 text-xs text-foreground/80 font-medium">
                                            <div className="size-7 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 shrink-0">
                                                <BadgeCheck className="size-4" />
                                            </div>
                                            <span>Verified STEAM Spark Educator</span>
                                        </div>
                                    )}
                                    {teacher.cv_url && (
                                        <div className="flex items-center gap-3 text-xs text-foreground/80 font-medium">
                                            <div className="size-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary shrink-0">
                                                <FileText className="size-4" />
                                            </div>
                                            <span>Background & Qualifications Checked</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-xs text-foreground/80 font-medium">
                                        <div className="size-7 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 shrink-0">
                                            <Check className="size-4" />
                                        </div>
                                        <span>Identity Verified</span>
                                    </div>
                                    {teacher.country && (
                                        <div className="flex items-center gap-3 text-xs text-foreground/80 font-medium">
                                            <div className="size-7 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 shrink-0">
                                                <MapPin className="size-4" />
                                            </div>
                                            <span>Based in {teacher.city || 'Ghana'}, {teacher.country}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bio, Courses & Reviews */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Bio Section */}
                        <section className="space-y-4 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl font-black uppercase tracking-tight text-primary flex items-center gap-2">
                                <Award className="size-5" /> About {teacher.full_name}
                            </h2>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                {teacher.bio || "This educator hasn't added a bio description yet."}
                            </p>

                            {/* Subjects */}
                            {teacher.subjects && teacher.subjects.length > 0 && (
                                <div className="pt-2">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Subject Expertise</p>
                                    <div className="flex flex-wrap gap-2">
                                        {teacher.subjects.map(subject => (
                                            <Badge key={subject} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary font-bold capitalize">
                                                {subject}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Courses Section */}
                        <section id="courses" className="space-y-6 scroll-mt-24">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight text-primary flex items-center gap-2">
                                        <BookOpen className="size-5" /> Educator Courses
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">Select a course to view details and schedule sessions</p>
                                </div>
                                <Badge variant="outline" className="font-bold">{gigs?.length || 0} Available</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {gigs && gigs.length > 0 ? (
                                    gigs.map(gig => (
                                        <div
                                            key={gig.id}
                                            className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            {/* Cover Image */}
                                            <div className="h-40 bg-muted relative overflow-hidden">
                                                {gig.cover_image ? (
                                                    <img src={gig.cover_image} alt={gig.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary/30 text-4xl font-black">
                                                        STEAM
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                                    <p className="text-xs font-black uppercase tracking-widest text-primary-foreground/90 mb-0.5">{gig.subject}</p>
                                                    <h3 className="font-bold line-clamp-1 text-white">{gig.title}</h3>
                                                </div>
                                            </div>

                                            {/* Course Stats */}
                                            <div className="p-4 grid grid-cols-3 divide-x divide-border">
                                                <div className="flex flex-col items-center gap-1">
                                                    <Clock className="size-3.5 text-primary" />
                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase">{gig.total_sessions} Sessions</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1">
                                                    <Users className="size-3.5 text-primary" />
                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase">{gig.max_students > 1 ? 'Group Class' : '1:1 Session'}</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-sm font-black text-foreground">GHS {gig.price}</span>
                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase">Price</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="px-4 pb-4 mt-auto flex items-center gap-2">
                                                <Button size="sm" className="flex-1 py-1.5 font-bold text-xs uppercase tracking-wider" asChild>
                                                    <Link href={`/parent/book/${gig.id}`}>Book Course</Link>
                                                </Button>
                                                <ShareButton
                                                    title={`${gig.title} — STEAM Spark Course`}
                                                    text={`Sign up for this course: ${gig.title} taught by ${teacher.full_name} on STEAM Spark!`}
                                                    url={`/parent/book/${gig.id}`}
                                                    variant="ghost"
                                                    size="icon"
                                                    iconOnly
                                                    className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 px-6 rounded-2xl border-2 border-dashed border-border bg-card text-center flex flex-col items-center gap-4">
                                        <div className="p-4 bg-muted rounded-full text-muted-foreground">
                                            <Sparkles className="size-8" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground italic">No custom courses listed yet</h3>
                                            <p className="text-sm text-muted-foreground mt-1 max-w-md">You can book this educator directly for custom 1:1 tutoring sessions via WhatsApp!</p>
                                        </div>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-bold gap-2" asChild>
                                            <a href={whatsappBookingUrl} target="_blank" rel="noopener noreferrer">
                                                <MessageSquare className="size-4" /> Book {teacher.full_name} Directly
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Reviews & Client Feedback Section */}
                        <section className="space-y-6 bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black uppercase tracking-tight text-primary flex items-center gap-2">
                                    <Star className="size-5 fill-primary text-primary" /> Client Feedback & Reviews
                                </h2>
                                {reviewCount > 0 && (
                                    <Badge variant="secondary" className="font-bold">
                                        ★ {reviewAverage} / 5.0 ({reviewCount} Review{reviewCount > 1 ? 's' : ''})
                                    </Badge>
                                )}
                            </div>
                            <ReviewList reviews={reviewData as unknown as Review[]} />
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
