# Chiron — Teacher Management & Fintech Platform
> Built by **Theia**

**Chiron** is an all-in-one teacher management and fintech platform designed for educators across Ghana — spanning preschool, primary, secondary, university, and professional levels. Chiron empowers teachers to manage lessons, student relationships, scheduling, and direct mobile money payouts.

---

## 🚀 Key Features (Phase 1 MVP)

- **Teacher & Client Portals**: Dual dashboard infrastructure for educators and parent/client onboarding.
- **Closed-Beta Client Invites**: Import and onboard existing teacher-client pairs directly.
- **Lesson & Schedule Management**: Track recurring sessions, attendance, and session notes.
- **Mobile Money Payments (MTN MoMo Rail)**: Seamless mobile money payment prompts via Paystack Ghana.
- **Teacher Earnings & Payouts**: Income overview, transaction records, and automated mobile money payouts.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI / Design**: React 19, TailwindCSS, Radix UI / shadcn components
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL & SSR Auth)
- **Notifications**: Twilio (WhatsApp API) & Resend (Email)
- **Document Engine**: jsPDF & jsPDF-autotable

---

## ⚙️ Getting Started Locally

1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/teepreneur/Chiron.git
   cd Chiron
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.local` template and fill in your keys:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   NEXT_PUBLIC_WHATSAPP_NUMBER=233544198026
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view Chiron in your browser.

---

## 📄 License
Copyright © 2026 **Theia**. All rights reserved.
