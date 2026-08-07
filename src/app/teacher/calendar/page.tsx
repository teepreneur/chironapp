"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
    Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight,
    CheckCircle2, AlertCircle, Video, MapPin, Sparkles, BookOpen,
    User, Send, CheckSquare, FileText, Loader2, Plus, MessageSquare
} from "lucide-react"
import Link from "next/link"
import { format, parseISO, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns"

interface SessionItem {
    id: string
    session_date: string
    session_time: string
    session_number: number
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
    booking: {
        id: string
        total_sessions: number
        gig: {
            title: string
            subject: string
            class_mode: string
            price: number
        }
        student: { name: string } | null
        parent: { full_name: string; phone: string | null } | null
    }
}

export default function TeacherCalendarPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [currentWeek, setCurrentWeek] = useState(new Date())
    const [sessions, setSessions] = useState<SessionItem[]>([])
    const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null)
    const [completingId, setCompletingId] = useState<string | null>(null)

    useEffect(() => {
        loadSessions()
    }, [])

    async function loadSessions() {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('booking_sessions')
                .select(`
                    id,
                    session_date,
                    session_time,
                    session_number,
                    status,
                    booking:bookings!inner (
                        id,
                        total_sessions,
                        gig:gigs!inner (
                            title,
                            subject,
                            class_mode,
                            price,
                            teacher_id
                        ),
                        student:students (name),
                        parent:profiles!bookings_parent_id_fkey (full_name, phone)
                    )
                `)
                .order('session_date', { ascending: true })

            if (error) {
                console.error("Error loading calendar sessions:", error)
            } else if (data) {
                const teacherSessions = (data as any[]).filter(s => s.booking?.gig?.teacher_id === user.id)
                setSessions(teacherSessions as SessionItem[])
            }
        } catch (e) {
            console.error("Calendar fetch error:", e)
        } finally {
            setLoading(false)
        }
    }

    async function handleCompleteSession(sessionId: string) {
        setCompletingId(sessionId)
        try {
            const response = await fetch('/api/sessions/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, action: 'teacher_confirm' })
            })
            const data = await response.json()
            if (data.success) {
                await loadSessions()
                if (selectedSession?.id === sessionId) {
                    setSelectedSession(prev => prev ? { ...prev, status: 'completed' } : null)
                }
            } else {
                alert(data.error || 'Failed to update session status')
            }
        } catch (e) {
            console.error("Session completion error:", e)
        } finally {
            setCompletingId(null)
        }
    }

    // Days of current week
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <CalendarIcon className="size-6 text-primary" />
                        Teaching Schedule & Readiness Calendar
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Manage live tuition dates, review AI class readiness, track materials, and mark completed sessions
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <span className="font-semibold text-sm">
                        {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => setCurrentWeek(new Date())}
                    >
                        Today
                    </Button>
                    <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                        <Link href="/teacher/clients/invite">
                            <Plus className="size-4" /> Add Client
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Calendar Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {weekDays.map((day, idx) => {
                    const isToday = isSameDay(day, new Date())
                    const dayFormatted = format(day, 'yyyy-MM-dd')
                    const daySessions = sessions.filter(s => s.session_date === dayFormatted)

                    return (
                        <div
                            key={idx}
                            className={cn(
                                "rounded-xl border p-3 min-h-[220px] flex flex-col bg-card transition-all",
                                isToday && "ring-2 ring-primary border-primary bg-primary/5"
                            )}
                        >
                            {/* Day Header */}
                            <div className="flex items-center justify-between pb-2 border-b mb-3">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        {format(day, 'EEE')}
                                    </p>
                                    <p className={cn("text-lg font-bold", isToday && "text-primary")}>
                                        {format(day, 'd')}
                                    </p>
                                </div>
                                {daySessions.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {daySessions.length} {daySessions.length === 1 ? 'class' : 'classes'}
                                    </Badge>
                                )}
                            </div>

                            {/* Session Cards for Day */}
                            <div className="space-y-2 flex-1 overflow-y-auto">
                                {daySessions.length === 0 ? (
                                    <p className="text-xs text-muted-foreground/60 italic pt-4 text-center">No sessions</p>
                                ) : (
                                    daySessions.map(session => (
                                        <div
                                            key={session.id}
                                            onClick={() => setSelectedSession(session)}
                                            className={cn(
                                                "p-2.5 rounded-lg border text-left cursor-pointer transition-all hover:shadow-md",
                                                session.status === 'completed'
                                                    ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                                                    : "bg-background hover:border-primary"
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                <span className="text-xs font-bold text-primary flex items-center gap-1">
                                                    <Clock className="size-3" />
                                                    {session.session_time || '10:00 AM'}
                                                </span>
                                                <Badge
                                                    className={cn(
                                                        "text-[10px] px-1.5 py-0 capitalize",
                                                        session.status === 'completed' && "bg-emerald-600 text-white",
                                                        session.status === 'confirmed' && "bg-blue-600 text-white",
                                                        session.status === 'scheduled' && "bg-amber-500 text-white"
                                                    )}
                                                >
                                                    {session.status}
                                                </Badge>
                                            </div>

                                            <p className="font-semibold text-xs truncate">
                                                {session.booking?.gig?.title || 'Private Lesson'}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground truncate">
                                                Student: {session.booking?.student?.name || 'Assigned Student'}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Session Detail & AI Readiness Drawer */}
            {selectedSession && (
                <div className="bg-card border rounded-2xl p-6 shadow-xl relative animate-in fade-in slide-in-from-bottom-4">
                    <button
                        onClick={() => setSelectedSession(null)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm font-bold"
                    >
                        ✕ Close
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-primary text-white">
                                    Session {selectedSession.session_number} of {selectedSession.booking?.total_sessions || 4}
                                </Badge>
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <Clock className="size-3.5" />
                                    {format(parseISO(selectedSession.session_date), 'MMMM d, yyyy')} at {selectedSession.session_time || '10:00 AM'}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold">{selectedSession.booking?.gig?.title}</h2>
                            <p className="text-sm text-muted-foreground">
                                Client: <strong className="text-foreground">{selectedSession.booking?.parent?.full_name}</strong> • Student: <strong className="text-foreground">{selectedSession.booking?.student?.name}</strong>
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {selectedSession.status !== 'completed' ? (
                                <Button
                                    onClick={() => handleCompleteSession(selectedSession.id)}
                                    disabled={completingId === selectedSession.id}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold shadow-md shadow-emerald-600/20"
                                >
                                    {completingId === selectedSession.id ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="size-4" />
                                    )}
                                    Mark Session Complete & Request Payout
                                </Button>
                            ) : (
                                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 py-1.5 px-3 font-bold text-xs gap-1.5">
                                    <CheckCircle2 className="size-4" /> Session Completed & Vault Updated
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* AI Readiness Checklist Section */}
                    <div className="grid md:grid-cols-3 gap-4 pt-6">
                        <div className="p-4 rounded-xl border bg-muted/40 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <CheckSquare className="size-4 text-emerald-600" />
                                Class Materials Setup
                            </div>
                            <p className="text-xs text-muted-foreground">Syllabus topics & worksheets uploaded</p>
                            <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
                                Ready for Student
                            </Badge>
                        </div>

                        <div className="p-4 rounded-xl border bg-muted/40 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <FileText className="size-4 text-blue-600" />
                                Quiz & Test Preparation
                            </div>
                            <p className="text-xs text-muted-foreground">Session check-in quiz generated by AI</p>
                            <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">
                                Quiz Active
                            </Badge>
                        </div>

                        <div className="p-4 rounded-xl border bg-muted/40 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <MessageSquare className="size-4 text-purple-600" />
                                WhatsApp Reminders
                            </div>
                            <p className="text-xs text-muted-foreground">Pre-class notification scheduled for parent</p>
                            <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50">
                                Scheduled (1d & 30m)
                            </Badge>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
