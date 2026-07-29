import { ReactNode } from "react"
import { Metadata } from "next"
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/json-ld"

export const metadata: Metadata = {
    title: "Chiron | Personal Tutoring & Client Management by Theia",
    description: "Chiron provides professional educators and client pairs with a streamlined tutoring, scheduling, session tracking, and mobile money payment platform.",
    keywords: ["Chiron", "tutoring Ghana", "client management", "education platform", "mobile money payments", "private tutoring"],
    authors: [{ name: "Theia" }],
    creator: "Theia",
    metadataBase: new URL("https://chironlearning.com"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_GH",
        url: "https://chironlearning.com",
        siteName: "Chiron",
        title: "Chiron | Personal Tutoring & Client Management by Theia",
        description: "Streamlined tutoring, closed-beta client invites, scheduling, and direct mobile money payments.",
        images: [
            {
                url: "/brand/chiron-lockup.svg",
                width: 580,
                height: 200,
                alt: "Chiron by Theia",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Chiron | Personal Tutoring & Client Management",
        description: "Streamlined tutoring, closed-beta client invites, scheduling, and direct mobile money payments.",
        images: ["/brand/chiron-lockup.svg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
}

export default function MarketingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f1923]">
            <OrganizationJsonLd />
            <WebsiteJsonLd />
            {children}
        </div>
    )
}

