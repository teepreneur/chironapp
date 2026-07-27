"use client"

import React from "react"
import Link from "next/link"
import { Sparkles, ArrowLeft, MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ComingSoonOverlayProps {
    title: string
    description: string
    icon?: React.ElementType
    expectedScope?: string
    backPath?: string
    backText?: string
}

export function ComingSoonOverlay({
    title,
    description,
    icon: Icon = Sparkles,
    expectedScope = "Coming in an upcoming update",
    backPath = "/parent/dashboard",
    backText = "Back to Dashboard"
}: ComingSoonOverlayProps) {
    const whatsappSupportNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "233544198026"
    const whatsappUrl = `https://wa.me/${whatsappSupportNumber}?text=${encodeURIComponent(`Hi STEAMSpark, I have a question about ${title}`)}`

    return (
        <div className="relative w-full min-h-[70vh] flex items-center justify-center p-4 md:p-8">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
                <div className="w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50 dark:opacity-30" />
            </div>

            <div className="relative max-w-xl w-full bg-card/80 backdrop-blur-md border border-border/80 rounded-2xl p-8 md:p-10 shadow-xl text-center flex flex-col items-center gap-6">
                {/* Icon Header */}
                <div className="relative">
                    <div className="size-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                        <Icon className="size-10" />
                    </div>
                    <span className="absolute -top-2 -right-2 inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md">
                        <Clock className="size-3" /> Coming Soon
                    </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                        {title}
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mx-auto">
                        {description}
                    </p>
                </div>

                {/* Scope Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted/60 text-xs font-semibold text-muted-foreground border border-border">
                    <Sparkles className="size-3.5 text-amber-500" />
                    <span>{expectedScope}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
                    <Button asChild variant="outline" className="w-full sm:w-auto font-bold gap-2">
                        <Link href={backPath}>
                            <ArrowLeft className="size-4" /> {backText}
                        </Link>
                    </Button>
                    <Button asChild className="w-full sm:w-auto font-bold gap-2 bg-green-600 hover:bg-green-700 text-white">
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                            <MessageSquare className="size-4" /> Chat on WhatsApp
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    )
}
