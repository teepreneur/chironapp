# Implementation Plan: Forking STEAM Spark → Building Chiron (by Theia)

## Overview & Scope
We have created a dedicated, independent repository for **Chiron** at `file:///Users/user/Documents/Software%20Development/Chiron` by cloning the STEAM Spark codebase. The original **STEAM Spark** repository remains 100% untouched and intact.

Per your instructions, this document provides the **Stage 1 Audit** and **Stage 2 Proposal** for your review and approval prior to writing any implementation code.

---

## Stage 1 — Codebase Audit

### 1. Existing System Architecture
- **Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Supabase Auth & PostgreSQL, Twilio (WhatsApp API), Resend (Email), jsPDF/jsPDF-autotable, TailwindCSS, Radix/shadcn UI components.
- **Current App Structure**:
  - **Public / Onboarding**: `/signup/parent`, `/signup/teacher`, `/login`, `/tutor/[id]`, `/marketing`
  - **Parent Portal**: Dashboard, Tutor Discovery, Booking & Payment (`/parent/book/[id]`), Children Management, AI Learning Roadmaps (`/parent/roadmaps`).
  - **Teacher Portal**: Dashboard, Course Creator (`/teacher/gigs`), Availability Calendar (`/teacher/calendar`), Earnings, Teaching Materials, Students list.
  - **Admin Portal**: User Management (Parents/Teachers), Booking Management, Finance & Payouts, Live Support Tickets.
  - **API Engine**: `/api/payments/initialize`, `/api/payments/verify`, `/api/payments/webhook`, `/api/notifications/whatsapp`, `/api/admin/payouts`.

### 2. Cleanly Reusable Components & Modules
- **Authentication & SSR Infrastructure**: `@supabase/ssr` middleware, cookie handling, role-based session protection.
- **Calendar & Availability Engine**: `teacher_availability` schema and `availability-manager.tsx` component.
- **Session Tracking Logic**: `booking_sessions` table and automatic schedule generator.
- **Notification Rail**: Twilio WhatsApp API integration (`/api/notifications/whatsapp`) and email notification hooks.
- **PDF Engine**: `jsPDF` engine (reusable for generating client receipts, session summaries, and teacher income statements).
- **Design Primitives**: `shadcn/ui` UI component suite (`Button`, `Card`, `Dialog`, `Select`, `Input`, `Table`, `Badge`, `Sheet`).

### 3. STEAM / Ages 5–18 Assumptions Requiring Rework
- **Subject Domain Limitation**: Hardcoded to STEAM fields (Science, Technology, Engineering, Art, Math). Needs expansion to all teaching disciplines (Languages, Humanities, Accounting, Music, Vocational, etc.).
- **Child-Parent Ownership Model**: `students` table currently assumes minors linked to parents (e.g. grade levels "Grade 3", "JHS 2"). Must be generalized to support **Learners / Clients** across all levels (Preschool, Primary, Secondary, University, Adult/Professional).
- **Public Search / Discovery Default**: STEAM Spark defaults to open public tutor searching (`/parent/tutors`). Chiron MVP focuses on **Teacher-first closed-beta onboarding** (inviting existing client pairs).
- **Visual Aesthetic & Branding**: STEAM Spark uses illustrative gradients, multi-colored icons, Lexend typography, and kid-focused copy. Chiron requires a hyper-minimal fintech design system: Emerald `#0B6E4F`, Ink `#14171A`, geometric typography (Inter/Poppins), and a flat C-ring logo.

---

## Stage 2 — Architecture & Schema Proposal

### 1. Supabase Database Schema Plan (Diff-Style)

```sql
-- 1. Extend Profiles for All Teaching Levels & Payouts
ALTER TABLE profiles 
  ADD COLUMN teaching_levels text[] DEFAULT '{primary,secondary}', -- 'preschool', 'primary', 'secondary', 'university', 'adult_professional'
  ADD COLUMN institution_affiliation text,
  ADD COLUMN credentials_by_level jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN momo_number text,
  ADD COLUMN momo_network text DEFAULT 'mtn'; -- 'mtn', 'telecel', 'airteltigo'

-- 2. Generalize Students/Clients into a Unified Learners Table
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_type text NOT NULL CHECK (client_type IN ('self_learner', 'parent_guardian')),
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text,
  learner_name text NOT NULL,
  teaching_level text NOT NULL CHECK (teaching_level IN ('preschool', 'primary', 'secondary', 'university', 'adult_professional')),
  notes text,
  invite_code text UNIQUE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamptz DEFAULT now()
);

-- 3. Transition Gigs -> Lessons / Courses
ALTER TABLE gigs 
  ADD COLUMN teaching_level text DEFAULT 'primary',
  ADD COLUMN billing_cycle text DEFAULT 'per_session'; -- 'per_session', 'monthly_retainer', 'package'

-- 4. Closed-Beta Client Invites
CREATE TABLE client_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  invite_code text UNIQUE NOT NULL,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  proposed_subject text NOT NULL,
  proposed_rate numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at timestamptz DEFAULT now()
);

-- 5. Lightweight Session Notes & Attendance
CREATE TABLE session_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES booking_sessions(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  attendance text NOT NULL CHECK (attendance IN ('attended', 'cancelled_by_client', 'rescheduled')),
  topics_covered text,
  next_steps text,
  created_at timestamptz DEFAULT now()
);
```

### 2. Payment Processor Recommendation (Ghana Mobile Money Focus)

- **Recommendation**: **Paystack Ghana** (Primary Rail).
- **Trade-Off Analysis**:
  | Metric | Paystack Ghana | Flutterwave |
  | :--- | :--- | :--- |
  | **Ghana MoMo Direct Debit API** | Direct integration with MTN MoMo, Telecel Cash, and AirtelTigo. | Supported, but slightly higher timeout rate in Ghana. |
  | **Automated Teacher Payouts** | Transfers API directly to MoMo wallets (`type: "mobile_money"`). | Supported via Transfers API. |
  | **Developer Experience** | Official Node.js SDK, instant webhook event verification (`charge.success`). | Good SDK, but occasional webhook delay. |
  | **Existing Stack Compatibility** | Already configured in codebase (`src/app/api/payments/*`). | Requires new integration layer. |

- **Decision**: We recommend using **Paystack Ghana Mobile Money rail** for direct client MoMo prompts and automated teacher payout transfers.

### 3. Rebranding & Minimal Design System Plan

1. **Color Tokens (`src/app/globals.css` & `tailwind.config.ts`)**:
   - **Brand Accent (Emerald Green)**: `#0B6E4F` (Used strictly for logo, CTA buttons, active navigation, links).
   - **Ink (Near-Black)**: `#14171A` (Used for wordmarks, headers, body text).
   - **Background**: Flat crisp white / light gray canvas (`#FAFAFA`) without gradients or multi-colored overlays.
2. **Typography**: Replace Lexend with **Inter** or **Poppins** via `next/font/google`. Set lowercase "chiron" in the main logo lockup.
3. **SVG Logo Component (`src/components/ui/logo.tsx`)**:
   - Recreate the exact vector geometry from `chiron-icon.svg` (open C-ring) and `chiron-lockup.svg` (icon + lowercase "chiron" + "by Theia" subtext).
4. **Stripping STEAM Assets**:
   - Remove rocket, brain, palette, and multi-colored badge illustrations.
   - Update all site metadata, titles, and descriptions from STEAM Spark to **Chiron (by Theia)**.

---

## Stage 3 Implementation Outline (Awaiting Approval)

Upon your sign-off on Stage 1 & Stage 2, we will proceed with implementing **Phase 1 (MVP)** in the new `Chiron` repository:
1. Rebrand theme tokens, typography, logo component, metadata, and app icons.
2. Rebrand teacher and client onboarding flows (generalizing beyond STEAM/ages 5–18).
3. Build closed-beta client invite & import mechanism for existing teacher-client pairs.
4. Implement lesson scheduling, calendar management, and reschedule handling.
5. Integrate MTN MoMo mobile money payment collection via Paystack.
6. Build teacher income dashboard (earnings period, transaction history, payouts).
7. Implement lightweight student/session notes and attendance tracking.
8. Exclude public search, reviews, and background check flows (deferred to Phase 2/3 as requested).

---

## User Sign-Off Required

> [!IMPORTANT]
> Please review the Stage 1 Audit and Stage 2 Proposal above. Reply to approve or request any adjustments before we initiate the Stage 3 implementation phase.
