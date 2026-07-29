"use client"

import Link from "next/link"
import { Users, ChevronRight, GraduationCap, Heart, CalendarCheck, ShieldCheck, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-10 py-4 border-b border-border bg-card">
        <div className="flex items-center">
          <Logo size={36} variant="full" />
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-muted-foreground">Already have an account?</span>
          <Button variant="outline" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Hero Visual */}
        <div className="hidden lg:flex w-1/2 relative bg-[#14171A] flex-col justify-end p-16">
          <div className="relative z-10 max-w-lg">
            <div className="mb-6">
              <Logo size={56} variant="full" showSubtext={true} />
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Personal Tutoring & Client Management.
            </h1>
            <p className="text-lg text-gray-300 font-light leading-relaxed mb-8">
              Chiron empowers professional educators and their client pairs with seamless lesson scheduling, session tracking, and Ghana Mobile Money payments.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <ShieldCheck className="size-3.5" /> Closed-Beta Invites
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <CreditCard className="size-3.5" /> Mobile Money Payouts
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Role Selector */}
        <div className="w-full lg:w-1/2 bg-card flex items-center justify-center p-6 lg:p-16">
          <div className="max-w-md w-full">
            {/* Mobile Hero */}
            <div className="lg:hidden text-center mb-10">
              <Logo size={48} variant="full" className="mx-auto mb-4" />
              <h1 className="text-3xl font-extrabold tracking-tight mb-3">Welcome to Chiron</h1>
              <p className="text-muted-foreground">Personal tutoring & client management platform by Theia.</p>
            </div>

            <div className="hidden lg:block mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight mb-2">Get Started</h2>
              <p className="text-muted-foreground">Select your role to continue</p>
            </div>

            {/* Role Cards */}
            <div className="flex flex-col gap-4">
              {/* Client / Parent Card */}
              <Link
                href="/signup/parent"
                className="group relative flex items-start gap-5 p-6 rounded-2xl border-2 border-border bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="size-14 rounded-xl bg-emerald-700/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Heart className="size-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    Client / Parent
                    <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Register as a learner or parent to schedule classes and manage mobile money payments.
                  </p>
                </div>
              </Link>

              {/* Educator Card */}
              <Link
                href="/signup/teacher"
                className="group relative flex items-start gap-5 p-6 rounded-2xl border-2 border-border bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="size-14 rounded-xl bg-emerald-700/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <GraduationCap className="size-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    Professional Educator
                    <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Manage your active teaching clients, issue closed-beta invite links, and receive automated MoMo payouts.
                  </p>
                </div>
              </Link>
            </div>

            {/* Features */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-4 text-center">Why Chiron?</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="size-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-primary">
                    <Users className="size-5" />
                  </div>
                  <span className="text-xs font-medium">Direct Clients</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="size-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-primary">
                    <CalendarCheck className="size-5" />
                  </div>
                  <span className="text-xs font-medium">Smart Schedules</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="size-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-primary">
                    <CreditCard className="size-5" />
                  </div>
                  <span className="text-xs font-medium">MoMo Payouts</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-8">
              By continuing, you agree to Chiron's <a className="underline hover:text-primary" href="#">Terms of Service</a> and <a className="underline hover:text-primary" href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
