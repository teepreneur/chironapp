"use client"

import { ComingSoonOverlay } from "@/components/ui/coming-soon-overlay"
import { Map } from "lucide-react"

export default function ParentRoadmapsPage() {
    return (
        <ComingSoonOverlay
            title="AI Learning Roadmaps"
            description="We're building personalized AI-generated STEAM learning roadmaps for your child. In the meantime, tutors will construct tailored learning goals directly during sessions."
            icon={Map}
            expectedScope="Launching post-beta"
            backPath="/parent/dashboard"
        />
    )
}
