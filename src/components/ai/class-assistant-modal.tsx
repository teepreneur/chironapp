"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Sparkles, CheckCircle2, BookOpen, FileText, CheckSquare,
    Loader2, AlertCircle, ArrowRight
} from "lucide-react"

interface ClassAssistantModalProps {
    subject: string
    title: string
    totalSessions?: number
    level?: string
    onApplySetup?: (data: { syllabus: string[]; quizzes: any[]; materials: string[] }) => void
}

export function ClassAssistantModal({
    subject,
    title,
    totalSessions = 4,
    level = 'Secondary',
    onApplySetup
}: ClassAssistantModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{
        syllabus: string[]
        quizzes: { session: number; title: string; questionsCount: number }[]
        materialsChecklist: string[]
        readinessScore: number
    } | null>(null)

    async function handleGenerate() {
        setLoading(true)
        try {
            const response = await fetch('/api/ai/class-setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, title, totalSessions, level })
            })
            const data = await response.json()
            if (data.success) {
                setResult({
                    syllabus: data.syllabus,
                    quizzes: data.recommendedQuizzes,
                    materialsChecklist: data.materialsChecklist,
                    readinessScore: data.readinessScore
                })
            }
        } catch (e) {
            console.error("AI Class Setup Error:", e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => {
                    setOpen(true)
                    if (!result) handleGenerate()
                }}
                className="gap-2 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 font-bold"
            >
                <Sparkles className="size-4 text-emerald-600 animate-pulse" />
                Chiron AI Teaching Assistant: Class Readiness Check
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm font-bold"
                        >
                            ✕
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                <Sparkles className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Chiron AI Class Assistant</h3>
                                <p className="text-xs text-muted-foreground">
                                    Guiding your class setup, quizzes, materials, and readiness for {subject}
                                </p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                                <Loader2 className="size-8 animate-spin text-emerald-600" />
                                <p className="text-sm font-medium text-muted-foreground">
                                    Chiron AI is generating syllabus modules, quiz check-ins, and materials checklist...
                                </p>
                            </div>
                        ) : result ? (
                            <div className="space-y-6">
                                {/* Readiness Badge */}
                                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="size-6 text-emerald-600" />
                                        <div>
                                            <p className="font-bold text-sm text-emerald-900 dark:text-emerald-300">Class Readiness Audit Passed</p>
                                            <p className="text-xs text-emerald-700 dark:text-emerald-400">Student will have all necessary materials and schedule structure from Day 1.</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-600 text-white font-extrabold text-sm px-3 py-1">
                                        {result.readinessScore}% Ready
                                    </Badge>
                                </div>

                                {/* Generated Syllabus */}
                                <div>
                                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                        <BookOpen className="size-4 text-primary" /> Session Syllabus Breakdown
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.syllabus.map((item, idx) => (
                                            <li key={idx} className="p-2.5 rounded-lg border bg-muted/30 text-xs font-medium flex items-start gap-2">
                                                <span className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Recommended Quizzes */}
                                <div>
                                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                        <FileText className="size-4 text-blue-600" /> Quizzes & Checkpoints
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-2">
                                        {result.quizzes.map((q, idx) => (
                                            <div key={idx} className="p-2.5 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 text-xs space-y-1">
                                                <p className="font-bold">Session {q.session}: {q.title}</p>
                                                <p className="text-[11px] text-muted-foreground">{q.questionsCount} AI-generated check-in questions</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Materials Checklist */}
                                <div>
                                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                        <CheckSquare className="size-4 text-purple-600" /> Required Class Materials
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.materialsChecklist.map((m, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs font-medium py-1 px-2.5">
                                                ✓ {m}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t">
                                    <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                        onClick={() => {
                                            if (onApplySetup && result) {
                                                onApplySetup({
                                                    syllabus: result.syllabus,
                                                    quizzes: result.quizzes,
                                                    materials: result.materialsChecklist
                                                })
                                            }
                                            setOpen(false)
                                        }}
                                    >
                                        Apply Class Readiness Setup
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </>
    )
}
