"use client"

import { Button } from "@/components/ui/button"
import { Zap, Plus, DollarSign, MessageSquare, Share2 } from "lucide-react"
import Link from "next/link"
import { ShareButton } from "@/components/share-button"

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "233544198026"
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Chiron Support, I am an educator with a question!")}`

interface QuickActionsProps {
    userId?: string
    fullName?: string
}

export function QuickActions({ userId, fullName }: QuickActionsProps) {
    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <Zap className="text-primary size-5" />
                <h2 className="text-lg font-bold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-4 hover:border-primary/50 hover:shadow-md transition-all group" asChild>
                    <Link href="/teacher/gigs/new">
                        <div className="bg-primary/10 group-hover:bg-primary group-hover:text-white w-10 h-10 rounded-lg flex items-center justify-center text-primary transition-colors">
                            <Plus size={24} />
                        </div>
                        <span className="font-semibold text-sm">Create Course</span>
                    </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-4 hover:border-primary/50 hover:shadow-md transition-all group" asChild>
                    <Link href="/teacher/earnings">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-primary group-hover:bg-primary group-hover:text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
                            <DollarSign size={24} />
                        </div>
                        <span className="font-semibold text-sm">Earnings Overview</span>
                    </Link>
                </Button>

                {/* Share Profile Action */}
                {userId && (
                    <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-start gap-4 hover:border-emerald-500/50 hover:shadow-md transition-all group">
                        <div className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 w-10 h-10 rounded-lg flex items-center justify-center">
                            <Share2 size={24} />
                        </div>
                        <div className="flex flex-col text-left w-full">
                            <span className="font-semibold text-sm">Share Profile</span>
                            <ShareButton
                                title={`${fullName || 'Educator'} — Chiron Educator`}
                                text={`Check out my official teaching profile on Chiron!`}
                                url={`/tutor/${userId}`}
                                variant="ghost"
                                size="sm"
                                className="p-0 h-auto font-bold text-xs text-emerald-600 dark:text-emerald-400 hover:bg-transparent hover:underline justify-start mt-1"
                            />
                        </div>
                    </div>
                )}

                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-4 hover:border-green-500/50 hover:shadow-md transition-all group bg-green-50/20 border-green-200 dark:border-green-900/30" asChild>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <div className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
                            <MessageSquare size={24} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-semibold text-sm text-green-800 dark:text-green-300">WhatsApp Help</span>
                            <span className="text-xs text-green-600 dark:text-green-400 font-normal">Contact Admin</span>
                        </div>
                    </a>
                </Button>
            </div>
        </section>
    )
}
