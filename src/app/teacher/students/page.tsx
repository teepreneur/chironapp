"use client"

import { ComingSoonOverlay } from "@/components/ui/coming-soon-overlay"
import { Users } from "lucide-react"

export default function TeacherStudentsPage() {
    return (
        <ComingSoonOverlay
            title="Student Roster & Insights"
            description="A dedicated student portal for tracking learning progress, attendance history, and notes per student is coming soon. All active student bookings can currently be managed from your main dashboard."
            icon={Users}
            expectedScope="Coming soon"
            backPath="/teacher/dashboard"
        />
    )
}
