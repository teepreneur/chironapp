"use client"

import { ComingSoonOverlay } from "@/components/ui/coming-soon-overlay"
import { FolderOpen } from "lucide-react"

export default function TeacherMaterialsPage() {
    return (
        <ComingSoonOverlay
            title="Course Materials & Resource Sharing"
            description="Cloud storage for sharing session notes, PDFs, and links directly with your enrolled students is coming soon! Tutors currently share learning materials via WhatsApp or Google Drive links."
            icon={FolderOpen}
            expectedScope="Coming soon"
            backPath="/teacher/dashboard"
        />
    )
}
