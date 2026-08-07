"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle2, Loader2, Sparkles, MessageSquare } from "lucide-react"

interface PostSessionSurveyProps {
    sessionId: string
    teacherName: string
    subject: string
    onConfirmed?: () => void
}

export function PostSessionSurvey({
    sessionId,
    teacherName,
    subject,
    onConfirmed
}: PostSessionSurveyProps) {
    const [rating, setRating] = useState(5)
    const [feedback, setFeedback] = useState("")
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false)

    async function handleConfirmSession() {
        setLoading(true)
        try {
            const response = await fetch('/api/sessions/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    action: 'parent_confirm',
                    rating,
                    feedback
                })
            })
            const data = await response.json()
            if (data.success) {
                setCompleted(true)
                if (onConfirmed) onConfirmed()
            } else {
                alert(data.error || 'Failed to submit feedback')
            }
        } catch (e) {
            console.error("Survey submission error:", e)
        } finally {
            setLoading(false)
        }
    }

    if (completed) {
        return (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="size-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-300">Session Confirmed!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Thank you for your feedback! {teacherName}&apos;s earnings have been credited to their Mobile Money vault.
                </p>
            </div>
        )
    }

    return (
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b pb-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <MessageSquare className="size-5" />
                </div>
                <div>
                    <h3 className="font-bold text-base">Class Session Feedback Survey</h3>
                    <p className="text-xs text-muted-foreground">Confirm completed {subject} lesson with {teacherName}</p>
                </div>
            </div>

            {/* Rating Stars */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">How was today&apos;s class?</label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 transition-transform hover:scale-125"
                        >
                            <Star
                                className={`size-7 ${
                                    star <= rating
                                        ? 'text-amber-500 fill-amber-500'
                                        : 'text-slate-300 dark:text-slate-700'
                                }`}
                            />
                        </button>
                    ))}
                    <span className="text-xs font-bold text-muted-foreground ml-2">{rating} / 5 Stars</span>
                </div>
            </div>

            {/* Feedback textarea */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Additional Feedback (Optional)</label>
                <Textarea
                    placeholder="Share any comments about student progress, topics covered, or lesson quality..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                />
            </div>

            <Button
                onClick={handleConfirmSession}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 py-2.5"
            >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                Confirm Class Completed & Release Educator Payment
            </Button>
        </div>
    )
}
