"use client"

import { ComingSoonOverlay } from "@/components/ui/coming-soon-overlay"
import { MessageSquare } from "lucide-react"

export default function ParentMessagesPage() {
    return (
        <ComingSoonOverlay
            title="Direct In-App Messages"
            description="In-app messaging between parents and tutors is coming soon! All booking updates, payment notifications, and tutor contact details are currently delivered directly via your official Chiron WhatsApp line."
            icon={MessageSquare}
            expectedScope="Coming in the next version"
            backPath="/parent/dashboard"
        />
    )
}
