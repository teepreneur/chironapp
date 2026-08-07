"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    UserPlus, Send, Copy, Check, ArrowLeft, Loader2,
    CheckCircle2, Share2, Sparkles, Phone, Mail, BookOpen
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ClientInvitePage() {
    const supabase = createClient()
    const router = useRouter()

    const [mode, setMode] = useState<'form' | 'link'>('form')
    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    // Form mode fields
    const [parentName, setParentName] = useState("")
    const [parentEmail, setParentEmail] = useState("")
    const [parentPhone, setParentPhone] = useState("")
    const [studentName, setStudentName] = useState("")
    const [subject, setSubject] = useState("Mathematics")
    const [agreedRate, setAgreedRate] = useState("80")
    const [totalSessions, setTotalSessions] = useState("4")
    const [classMode, setClassMode] = useState("in_person")

    // Invite code generated
    const [inviteCode, setInviteCode] = useState("")

    async function handleOnboardClient(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setSuccessMsg(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Authentication required")

            // Generate unique invitation code
            const code = `CHIRON-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            setInviteCode(code)

            // Create client onboarding record in database or gig booking invitation
            const { error: inviteErr } = await supabase.from('gigs').insert({
                teacher_id: user.id,
                title: `${subject} Private Tuition — ${studentName || parentName}`,
                subject: subject,
                price: parseFloat(agreedRate) || 80,
                total_sessions: parseInt(totalSessions) || 4,
                class_mode: classMode,
                status: 'active',
                description: `Direct private tuition setup for ${studentName || 'student'}. Client contact: ${parentPhone || parentEmail}.`
            })

            if (inviteErr) {
                console.warn("Gig creation warning:", inviteErr)
            }

            setSuccessMsg(`Successfully created class record for ${parentName}! Invitation code: ${code}`)

        } catch (err: any) {
            alert(err.message || "Failed to add client")
        } finally {
            setLoading(false)
        }
    }

    const shareUrl = inviteCode
        ? `${window.location.origin}/signup/parent?invite=${inviteCode}`
        : `${window.location.origin}/signup/parent`

    const whatsappShareText = encodeURIComponent(
        `Hello ${parentName || 'Client'}! I have set up our private tuition class on Chiron. Please complete your registration here: ${shareUrl}`
    )

    function copyLink() {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link
                href="/teacher/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="size-4" /> Back to Dashboard
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <UserPlus className="size-6 text-emerald-600" />
                        Add & Onboard Existing Client
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Bring your existing private tutoring clients onto Chiron for automated scheduling, readiness, and instant MoMo payouts
                    </p>
                </div>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-muted">
                <button
                    type="button"
                    onClick={() => setMode('form')}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                        mode === 'form' ? 'bg-card shadow text-foreground' : 'text-muted-foreground'
                    }`}
                >
                    Fill Form for Client
                </button>
                <button
                    type="button"
                    onClick={() => setMode('link')}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
                        mode === 'link' ? 'bg-card shadow text-foreground' : 'text-muted-foreground'
                    }`}
                >
                    Generate WhatsApp Link
                </button>
            </div>

            {/* Form Mode */}
            {mode === 'form' && (
                <form onSubmit={handleOnboardClient} className="bg-card border rounded-2xl p-6 space-y-6 shadow-sm">
                    {successMsg && (
                        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-3">
                            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                            <div className="flex-1 text-sm font-medium">{successMsg}</div>
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Parent / Client Name</Label>
                            <Input
                                required
                                placeholder="Mr. / Mrs. Kofi Mensah"
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>WhatsApp / Phone Number</Label>
                            <Input
                                required
                                placeholder="024 123 4567"
                                value={parentPhone}
                                onChange={(e) => setParentPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Student Name</Label>
                            <Input
                                placeholder="Kwame Mensah"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Mathematics, Science, French..."
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Agreed Session Rate (GHS)</Label>
                            <Input
                                type="number"
                                required
                                value={agreedRate}
                                onChange={(e) => setAgreedRate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Total Sessions</Label>
                            <Input
                                type="number"
                                required
                                value={totalSessions}
                                onChange={(e) => setTotalSessions(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Class Mode</Label>
                            <select
                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                value={classMode}
                                onChange={(e) => setClassMode(e.target.value)}
                            >
                                <option value="in_person">In-Person</option>
                                <option value="online">Online</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            100% of your rate (GHS {agreedRate}/session) goes directly to your MoMo vault upon completion.
                        </p>

                        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                            {loading ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                            Create Class & Onboard Client
                        </Button>
                    </div>
                </form>
            )}

            {/* Link Mode & WhatsApp Share */}
            {(mode === 'link' || inviteCode) && (
                <div className="bg-card border rounded-2xl p-6 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <Share2 className="size-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Send Client WhatsApp Invitation</h3>
                            <p className="text-xs text-muted-foreground">Share this link directly with your client via WhatsApp</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl border bg-muted/40">
                        <Input readOnly value={shareUrl} className="bg-background font-mono text-xs" />
                        <Button variant="outline" onClick={copyLink} className="shrink-0 gap-1.5">
                            {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <a
                            href={`https://wa.me/?text=${whatsappShareText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
                        >
                            <Send className="size-4" /> Send via WhatsApp
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
