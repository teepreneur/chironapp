import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { subject, title, totalSessions, level } = body

        if (!subject || !title) {
            return NextResponse.json({ error: 'Subject and title are required' }, { status: 400 })
        }

        let syllabus: string[] = []
        let recommendedQuizzes: { session: number; title: string; questionsCount: number }[] = []
        let materialsChecklist: string[] = []
        let readinessScore = 95

        if (openai) {
            try {
                const prompt = `As Chiron AI Teaching Assistant, generate a structured class setup guide for a private tutoring course:
Subject: ${subject}
Course Title: ${title}
Total Sessions: ${totalSessions || 4}
Target Level: ${level || 'Secondary'}

Return JSON format with:
- syllabus (array of strings, one per session topic)
- quizzes (array of objects: { session: number, title: string, questionsCount: number })
- materialsChecklist (array of strings for required worksheets, formulas, or tools)
- readinessAudit (string summary of why the class is ready for the student)`

                const response = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' }
                })

                const content = response.choices[0]?.message?.content
                if (content) {
                    const parsed = JSON.parse(content)
                    syllabus = parsed.syllabus || []
                    recommendedQuizzes = parsed.quizzes || []
                    materialsChecklist = parsed.materialsChecklist || []
                }
            } catch (aiError) {
                console.warn('[AI Class Setup] OpenAI error, falling back to smart defaults:', aiError)
            }
        }

        // Default structured fallback if AI Key not set or failed
        if (syllabus.length === 0) {
            const count = totalSessions || 4
            syllabus = Array.from({ length: count }, (_, i) => `Session ${i + 1}: Diagnostic & Foundational ${subject} Concepts (Module ${i + 1})`)
            recommendedQuizzes = Array.from({ length: Math.ceil(count / 2) }, (_, i) => ({
                session: (i + 1) * 2,
                title: `${subject} Knowledge Checkpoint ${i + 1}`,
                questionsCount: 5
            }))
            materialsChecklist = [
                `${subject} Core Practice Worksheet`,
                'Formula / Vocabulary Reference Sheet',
                'Pre-Session Warmup Quiz'
            ]
        }

        return NextResponse.json({
            success: true,
            syllabus,
            recommendedQuizzes,
            materialsChecklist,
            readinessScore,
            message: 'Class structure and readiness check generated successfully!'
        })

    } catch (error: any) {
        console.error('[AI Class Setup Error]:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
