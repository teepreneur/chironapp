"use client"

import { ComingSoonOverlay } from "@/components/ui/coming-soon-overlay"
import { MessageSquare } from "lucide-react"

export default function TeacherMessagesPage() {
    return (
        <ComingSoonOverlay
            title="Direct Parent Messaging"
            description="In-app direct messaging with parents is under active development. You will receive booking notifications and student information directly via WhatsApp and your dashboard."
            icon={MessageSquare}
            expectedScope="Coming in the next version"
            backPath="/teacher/dashboard"
        />
    )
}
