"use client"

import { ComingSoonOverlay } from "@/components/ui/coming-soon-overlay"
import { Calendar } from "lucide-react"

export default function TeacherCalendarPage() {
    return (
        <ComingSoonOverlay
            title="Interactive Schedule & Availability Calendar"
            description="We're crafting an interactive calendar for managing custom weekly slots and availability. Your scheduled booking sessions are fully visible directly on your Teacher Dashboard."
            icon={Calendar}
            expectedScope="Coming soon"
            backPath="/teacher/dashboard"
        />
    )
}
