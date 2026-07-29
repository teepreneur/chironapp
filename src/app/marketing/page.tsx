import {
    Users, ChevronRight, GraduationCap,
    Heart, ShieldCheck, Calendar, CreditCard, Check,
    Sparkles, ArrowRight, BookOpen, Layers
} from "lucide-react"
import { Logo } from "@/components/ui/logo"

const APP_URL = ""

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center">
                            <Logo size={36} variant="full" />
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" href="#clients">Clients & Parents</a>
                            <a className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" href="#educators">Educators</a>
                            <a className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors" href="#features">Features</a>
                        </nav>
                        <div className="flex items-center gap-3">
                            <a
                                href={`${APP_URL}/login`}
                                className="hidden sm:flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-bold transition-colors hover:bg-accent"
                            >
                                Login
                            </a>
                            <a
                                href={`${APP_URL}/`}
                                className="flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-36 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="flex flex-col gap-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 self-center lg:self-start rounded-full bg-card border border-border px-4 py-1.5 text-xs font-bold shadow-sm">
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-muted-foreground">Powered by Theia • Personal Tutoring Platform</span>
                            </div>
                            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl text-foreground">
                                Tutoring & Client <br />
                                <span className="text-primary">Management</span>
                            </h1>
                            <p className="text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-light">
                                Chiron connects professional teachers with their client pairs. Streamline scheduling, lesson tracking, closed-beta invites, and direct Mobile Money payments.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                                <a
                                    href={`${APP_URL}/signup/parent`}
                                    className="w-full sm:w-auto flex h-14 items-center justify-center rounded-2xl bg-primary px-8 text-lg font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-105"
                                >
                                    Client & Parent Registration
                                </a>
                                <a
                                    href={`${APP_URL}/signup/teacher`}
                                    className="w-full sm:w-auto flex h-14 items-center justify-center rounded-2xl bg-card border-2 border-border px-8 text-lg font-bold text-foreground transition-all hover:border-primary hover:text-primary"
                                >
                                    Educator Portal
                                </a>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-muted-foreground mt-2">
                                <div className="flex items-center gap-1.5">
                                    <Check className="size-4 text-primary" />
                                    <span>Closed-Beta Invites</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Check className="size-4 text-primary" />
                                    <span>Ghana Mobile Money</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Check className="size-4 text-primary" />
                                    <span>All Academic Levels</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit">
                                    <Users className="size-6" />
                                </div>
                                <h3 className="text-lg font-bold">Closed-Beta Client Invites</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Teachers issue direct invite codes and WhatsApp links to existing client & student pairs.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit">
                                    <CreditCard className="size-6" />
                                </div>
                                <h3 className="text-lg font-bold">Ghana Mobile Money Payouts</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Seamless GHS Mobile Money charges via MTN, Telecel, and AirtelTigo with direct teacher payouts.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit">
                                    <Calendar className="size-6" />
                                </div>
                                <h3 className="text-lg font-bold">Smart Calendar & Sessions</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Automated session generation, reschedule tracking, and attendance notes.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit">
                                    <Layers className="size-6" />
                                </div>
                                <h3 className="text-lg font-bold">All Academic Disciplines</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    From preschool literacy to SHS, university, adult professional, languages, and sciences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-card py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <Logo size={32} variant="full" />
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Chiron by Theia. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
