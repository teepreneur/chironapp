"use client"

import { Button } from "@/components/ui/button"
import { Search, Map, CalendarPlus, UserPlus, MessageSquare } from "lucide-react"
import Link from "next/link"

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "15553146970"
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi STEAMSpark Support, I have a question!")}`

const actions = [
    { label: "Find Tutors", sub: "Browse experts", icon: Search, color: "bg-blue-50 text-primary dark:bg-blue-900/20", href: "/parent/tutors", comingSoon: false },
    { label: "Add Child", sub: "Manage family", icon: UserPlus, color: "bg-teal-50 text-teal-600 dark:bg-teal-900/20", href: "/parent/children", comingSoon: false },
    { label: "Book Session", sub: "Schedule now", icon: CalendarPlus, color: "bg-green-50 text-green-600 dark:bg-green-900/20", href: "/parent/tutors", comingSoon: false },
    { label: "Roadmaps", sub: "View progress", icon: Map, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20", href: "/parent/roadmaps", comingSoon: true },
]

export function ParentQuickActions() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {actions.map((action) => (
                <Button key={action.label} variant="outline" className="h-auto p-4 flex items-center justify-start gap-4 hover:border-primary/50 hover:shadow-md transition-all group relative" asChild>
                    <Link href={action.href}>
                        <div className={`size-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${action.color}`}>
                            <action.icon size={24} />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="font-bold leading-tight truncate">{action.label}</p>
                                {action.comingSoon && (
                                    <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded leading-none">
                                        Soon
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 font-normal">{action.sub}</p>
                        </div>
                    </Link>
                </Button>
            ))}

            {/* WhatsApp Support Direct Action */}
            <Button variant="outline" className="h-auto p-4 flex items-center justify-start gap-4 hover:border-green-500/50 hover:shadow-md transition-all group bg-green-50/30 dark:bg-green-950/10 border-green-200 dark:border-green-900/40" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <div className="size-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                        <MessageSquare size={24} />
                    </div>
                    <div className="text-left">
                        <p className="font-bold leading-tight text-green-800 dark:text-green-300">WhatsApp Help</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-normal">Chat with Admin</p>
                    </div>
                </a>
            </Button>
        </div>
    )
}
