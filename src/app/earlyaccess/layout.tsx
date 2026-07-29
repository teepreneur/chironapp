import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import '../globals.css'

const lexend = Lexend({
    subsets: ['latin'],
    variable: '--font-lexend',
})

export const metadata: Metadata = {
    title: 'Early Access | Chiron (by Theia)',
    description: 'Request early access access for Chiron by Theia.',
}

export default function EarlyAccessLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={`${lexend.variable} font-sans min-h-screen bg-white`}>
            {children}
        </div>
    )
}
