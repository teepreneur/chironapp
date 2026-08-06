"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Users, ChevronRight, GraduationCap, ShieldCheck, Calendar,
  CreditCard, Check, Sparkles, ArrowRight, Wallet, TrendingUp,
  Share2, BookOpen, Star, Award, CheckCircle2, Lock, PiggyBank,
  CheckCircle, ArrowUpRight, PlayCircle
} from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

const APP_URL = ""

// Tutor image thumbnails for the Hero Grid
const tutorThumbnails = [
  { image: "/teachers/teacher_ama.png" },
  { image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=300&auto=format&fit=crop&q=80" },
  { image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80" },
]

export default function EducatorLandingPage() {
  const [hoursPerWeek, setHoursPerWeek] = useState(15)
  const [hourlyRate, setHourlyRate] = useState(80)

  const estimatedMonthlyEarnings = hoursPerWeek * hourlyRate * 4

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-emerald-500/20 selection:text-emerald-700">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center group">
              <Logo size={36} variant="full" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-sm font-semibold text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors" href="#why-chiron">Why Chiron</a>
              <a className="text-sm font-semibold text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors" href="#how-it-works">Teacher Journey</a>
              <a className="text-sm font-semibold text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors" href="#stories">Success Stories</a>
              <a className="text-sm font-semibold text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors" href="#earnings">Earnings & Payouts</a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="hidden sm:flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-bold transition-all hover:bg-accent hover:border-emerald-700/30"
              >
                Login
              </a>
              <a
                href="/signup/teacher"
                className="flex h-10 items-center justify-center rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 text-sm shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02]"
              >
                Join as an Educator
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-emerald-500/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-foreground mb-6">
                Build Your Tutoring Business.<br />
                <span className="text-emerald-700 dark:text-emerald-400">Earn on Your Own Terms.</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-normal mb-8 max-w-xl">
                Chiron empowers teachers with everything needed to build a verified profile, advertise services, secure private clients, manage classes, and receive instant Mobile Money payouts.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                <Button size="lg" className="h-14 px-8 text-base font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl shadow-emerald-700/25 rounded-2xl transition-all hover:scale-105" asChild>
                  <Link href="/signup/teacher">
                    Join as an Educator <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold rounded-2xl border-2" asChild>
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>0% Agency Commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Instant MoMo Payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Direct Client Control</span>
                </div>
              </div>
            </div>

            {/* Right Column: Tutors Grid */}
            <div className="lg:col-span-6">
              <div className="relative max-w-md mx-auto lg:max-w-none">
                {/* Glowing background aura */}
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-3xl blur-2xl -z-10" />
                
                <div className="rounded-3xl border border-border bg-card/80 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Experienced Educator Network
                      </span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      25+ Verified Tutors
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 sm:gap-3.5">
                    {tutorThumbnails.map((tutor, idx) => (
                      <div 
                        key={idx} 
                        className="group relative aspect-square rounded-2xl overflow-hidden border border-border/80 bg-muted hover:border-emerald-500/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <img 
                          src={tutor.image} 
                          alt="Tutor Thumbnail" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1.5 right-1.5 size-2 sm:size-2.5 rounded-full bg-emerald-500 ring-2 ring-background shadow-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Chiron Section */}
      <section id="why-chiron" className="py-20 bg-card/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              <span className="text-emerald-700 dark:text-emerald-400">Chiron Gives You Total Control.</span>
            </h2>
            <p className="text-lg text-muted-foreground font-normal">
              No more giving away 40-50% commission or waiting 60 days for delayed payments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-4 hover:border-emerald-700/30 transition-all">
              <div className="size-14 rounded-2xl bg-emerald-700/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <TrendingUp className="size-7" />
              </div>
              <h3 className="text-xl font-bold">100% Earnings Protection</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Set your exact hourly or monthly package rate. You keep 100% of your requested fee without arbitrary middleman cuts.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-4 hover:border-emerald-700/30 transition-all">
              <div className="size-14 rounded-2xl bg-emerald-700/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <Wallet className="size-7" />
              </div>
              <h3 className="text-xl font-bold">Instant Mobile Money Payouts</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Direct payouts to your MTN MoMo, Telecel Cash, or AirtelTigo wallet. Completed lessons pay out immediately into your earnings vault.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm space-y-4 hover:border-emerald-700/30 transition-all">
              <div className="size-14 rounded-2xl bg-emerald-700/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <Share2 className="size-7" />
              </div>
              <h3 className="text-xl font-bold">Self-Marketing & Direct Invites</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get a custom public profile URL and branded share cards. Invite your own existing client pairs via WhatsApp with custom access codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 5-Step Teacher Journey */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-2 block">The Educator Journey</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              How Chiron Works For You
            </h2>
            <p className="text-lg text-muted-foreground">
              From creating your profile to receiving your first Mobile Money payout.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3 relative">
              <div className="size-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-base mb-4 shadow-md shadow-emerald-700/20">
                1
              </div>
              <h3 className="text-lg font-bold">Build Your Profile</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upload your degree, subject expertise, bio, and set your custom hourly/package rate.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3 relative">
              <div className="size-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-base mb-4 shadow-md shadow-emerald-700/20">
                2
              </div>
              <h3 className="text-lg font-bold">Advertise Yourself</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Share your personal Chiron profile link on WhatsApp, LinkedIn, and social media with branded cards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3 relative">
              <div className="size-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-base mb-4 shadow-md shadow-emerald-700/20">
                3
              </div>
              <h3 className="text-lg font-bold">Secure Clients</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get booked directly by student pairs. You keep 100% of your rate without agency cuts.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3 relative">
              <div className="size-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-base mb-4 shadow-md shadow-emerald-700/20">
                4
              </div>
              <h3 className="text-lg font-bold">Manage Classes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use your smart calendar for session reminders, attendance logs, and student notes.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-6 rounded-2xl border border-emerald-700/40 bg-emerald-500/5 shadow-sm space-y-3 relative">
              <div className="size-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-base mb-4 shadow-md shadow-emerald-700/20">
                5
              </div>
              <h3 className="text-lg font-bold">Paid & Savings Vault</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get automated MoMo payouts directly to your MTN/Telecel wallet. Set savings goals and withdraw anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Educator Success Stories */}
      <section id="stories" className="py-24 bg-card/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-2 block">Success Stories</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Real Teachers. Real Financial Growth.
            </h2>
            <p className="text-lg text-muted-foreground font-normal">
              Hear from educators who transformed their teaching careers on Chiron.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-base text-foreground italic leading-relaxed">
                  "I used to give away 40% of my private tutoring income to middleman agencies. On Chiron, I set my own rate, keep 100% of my fees, and earned over ₵4,800 in my first 60 days."
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border/60">
                <div className="relative size-12 rounded-full overflow-hidden shrink-0 border-2 border-emerald-600">
                  <Image src="/teachers/teacher_ama.png" alt="Ama Kwakye" fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Ama Kwakye</h4>
                  <p className="text-xs text-muted-foreground">Mathematics & Physics • Accra</p>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">Earns ₵4,800/mo on Chiron</p>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-base text-foreground italic leading-relaxed">
                  "The instant Mobile Money payouts are a total gamechanger. The moment a student session ends, my payment lands straight into my MTN Mobile Money wallet."
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border/60">
                <div className="size-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                  KM
                </div>
                <div>
                  <h4 className="font-bold text-base">Kofi Mensah</h4>
                  <p className="text-xs text-muted-foreground">Robotics & Coding • Kumasi</p>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">Earns ₵5,200/mo on Chiron</p>
                </div>
              </div>
            </div>

            {/* Story 3 */}
            <div className="p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-base text-foreground italic leading-relaxed">
                  "I shared my Chiron profile link on WhatsApp and onboarded 8 private student pairs in less than three weeks. Chiron handles all my scheduling and billing."
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border/60">
                <div className="size-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                  EB
                </div>
                <div>
                  <h4 className="font-bold text-base">Esi Baidoo</h4>
                  <p className="text-xs text-muted-foreground">French & Literature • Takoradi</p>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">Earns ₵3,900/mo on Chiron</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Earnings Calculator Section */}
      <section id="earnings" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Financial Growth Engine</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Calculate Your Potential Earnings on Chiron
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You decide your hourly rate and how many hours you want to teach per week. With zero agency commissions, every cedi you earn is yours.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-emerald-700/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Direct MTN, Telecel & AirtelTigo Payouts</h4>
                    <p className="text-xs text-muted-foreground">No delayed bank transfers or manual cheque processing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-6 rounded-full bg-emerald-700/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Chiron Savings Vault</h4>
                    <p className="text-xs text-muted-foreground">Automatically set aside a portion of earnings for savings goals.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator Card */}
            <div className="p-8 rounded-3xl bg-card border-2 border-emerald-700/30 shadow-xl space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <PiggyBank className="size-6 text-emerald-700 dark:text-emerald-400" />
                  Earnings Calculator
                </h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-700/10 text-emerald-700 dark:text-emerald-400">0% Platform Cut</span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span>Hourly Rate (GHS)</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">₵{hourlyRate} / hr</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="200"
                    step="10"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full accent-emerald-700 h-2 bg-accent rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span>Teaching Hours per Week</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{hoursPerWeek} hrs / week</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="1"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full accent-emerald-700 h-2 bg-accent rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-700/10 border border-emerald-700/20 text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estimated Monthly Income</span>
                <div className="text-4xl sm:text-5xl font-black text-emerald-700 dark:text-emerald-400">
                  ₵{estimatedMonthlyEarnings.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ month</span>
                </div>
                <p className="text-xs text-muted-foreground">100% paid out directly to your Mobile Money account</p>
              </div>

              <Button size="lg" className="w-full h-12 font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl" asChild>
                <Link href="/signup/teacher">Start Earning with Chiron</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-emerald-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Build Your Independent Tutoring Business?
          </h2>
          <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto font-light">
            Join over 25+ founding educators impacting students across Ghana while growing their income on Chiron.
          </p>
          <div className="pt-2">
            <Button size="lg" className="h-14 px-10 text-base font-bold bg-white hover:bg-emerald-50 text-emerald-900 shadow-2xl rounded-2xl transition-all hover:scale-105" asChild>
              <Link href="/signup/teacher">
                Create Your Educator Profile <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size={36} variant="full" />
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="/login" className="hover:text-foreground transition-colors">Teacher Login</a>
            <a href="/signup/teacher" className="hover:text-foreground transition-colors">Educator Registration</a>
            <a href="mailto:support@chironlearning.com" className="hover:text-foreground transition-colors">Contact Support</a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Chiron by Theia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
