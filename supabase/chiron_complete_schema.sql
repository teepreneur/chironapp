-- ========================================================
-- CHIRON COMPLETE DATABASE SCHEMA (ALL 17 TABLES)
-- Copy & Run this script in the Supabase SQL Editor
-- ========================================================

-- 1. PROFILES TABLE (User accounts for Teachers, Parents, Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  role text DEFAULT 'parent' CHECK (role IN ('parent', 'teacher', 'admin')),
  bio text,
  subjects text[],
  teaching_levels text[] DEFAULT '{primary,secondary}',
  institution_affiliation text,
  credentials_by_level jsonb DEFAULT '{}'::jsonb,
  momo_number text,
  momo_network text DEFAULT 'mtn',
  paystack_subaccount_code text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  avatar_url text,
  city text,
  country text DEFAULT 'Ghana',
  hourly_rate numeric,
  class_mode text DEFAULT 'online' CHECK (class_mode IN ('online', 'in_person', 'hybrid')),
  phone_number text,
  whatsapp_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Auto-create profile trigger on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'parent')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        role = COALESCE(EXCLUDED.role, profiles.role);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles viewable by all" ON public.profiles;
CREATE POLICY "Public profiles viewable by all" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. STUDENTS TABLE (Children/Learners registered under Parents)
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text,
  grade_level text,
  dob date,
  location text,
  learning_goals text,
  favorite_subjects text[],
  disliked_subjects text[],
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Parents manage own students" ON public.students;
CREATE POLICY "Parents manage own students" ON public.students FOR ALL USING (auth.uid() = parent_id);

-- 3. CLIENTS TABLE (Tutor-added Clients & Learners)
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_type text NOT NULL CHECK (client_type IN ('self_learner', 'parent_guardian')),
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text,
  learner_name text NOT NULL,
  teaching_level text NOT NULL,
  notes text,
  invite_code text UNIQUE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers manage own clients" ON public.clients;
CREATE POLICY "Teachers manage own clients" ON public.clients FOR ALL USING (auth.uid() = teacher_id);

-- 4. CLIENT INVITES TABLE (Direct Client Invite Links)
CREATE TABLE IF NOT EXISTS public.client_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  invite_code text UNIQUE NOT NULL,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_email text,
  proposed_subject text NOT NULL,
  proposed_rate numeric NOT NULL,
  teaching_level text DEFAULT 'primary',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.client_invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public invite lookup" ON public.client_invites;
CREATE POLICY "Public invite lookup" ON public.client_invites FOR SELECT USING (true);
DROP POLICY IF EXISTS "Teachers manage client invites" ON public.client_invites;
CREATE POLICY "Teachers manage client invites" ON public.client_invites FOR ALL USING (auth.uid() = teacher_id);

-- 5. GIGS / COURSES TABLE (Tuition Class Listings)
CREATE TABLE IF NOT EXISTS public.gigs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  price numeric NOT NULL,
  teaching_level text DEFAULT 'primary',
  billing_cycle text DEFAULT 'per_session',
  total_sessions integer DEFAULT 4,
  session_duration integer DEFAULT 60,
  meeting_platform text DEFAULT 'Google Meet',
  meeting_link text,
  cover_image text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Gigs viewable by all" ON public.gigs;
CREATE POLICY "Gigs viewable by all" ON public.gigs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Teachers manage own gigs" ON public.gigs;
CREATE POLICY "Teachers manage own gigs" ON public.gigs FOR ALL USING (auth.uid() = teacher_id);

-- 6. BOOKINGS TABLE (Class Contracts & Parent Enrollments)
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id uuid REFERENCES public.gigs(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  total_sessions integer DEFAULT 1,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'payment_failed')),
  payment_reference text,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own bookings" ON public.bookings;
CREATE POLICY "Users view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = parent_id OR auth.uid() IN (SELECT teacher_id FROM public.gigs WHERE id = gig_id));

-- 7. BOOKING SESSIONS TABLE (Individual Live Class Dates)
CREATE TABLE IF NOT EXISTS public.booking_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  session_number integer NOT NULL,
  session_date date NOT NULL,
  session_time time NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'rescheduled', 'cancelled')),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.booking_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sessions viewable by all" ON public.booking_sessions;
CREATE POLICY "Sessions viewable by all" ON public.booking_sessions FOR SELECT USING (true);

-- 8. SESSION NOTES TABLE (Attendance & Lesson Reports)
CREATE TABLE IF NOT EXISTS public.session_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.booking_sessions(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  attendance text NOT NULL CHECK (attendance IN ('attended', 'cancelled_by_client', 'rescheduled')),
  topics_covered text,
  next_steps text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.session_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers manage session notes" ON public.session_notes;
CREATE POLICY "Teachers manage session notes" ON public.session_notes FOR ALL USING (auth.uid() = teacher_id);

-- 9. MATERIALS TABLE (PDF Worksheets, Homework & AI Quizzes)
CREATE TABLE IF NOT EXISTS public.materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  file_url text,
  type text DEFAULT 'worksheet' CHECK (type IN ('worksheet', 'quiz', 'pdf', 'homework')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Materials viewable by all" ON public.materials;
CREATE POLICY "Materials viewable by all" ON public.materials FOR SELECT USING (true);

-- 10. ROADMAPS TABLE (AI Personalised Learning Plans)
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  gig_id uuid REFERENCES public.gigs(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject text NOT NULL,
  milestones jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Roadmaps viewable by student parent" ON public.roadmaps;
CREATE POLICY "Roadmaps viewable by student parent" ON public.roadmaps FOR SELECT USING (true);

-- 11. TEACHER EARNINGS TABLE (Escrow Payout Release Vault)
CREATE TABLE IF NOT EXISTS public.teacher_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES public.booking_sessions(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text DEFAULT 'released' CHECK (status IN ('held', 'released')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.teacher_earnings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers view own earnings" ON public.teacher_earnings;
CREATE POLICY "Teachers view own earnings" ON public.teacher_earnings FOR SELECT USING (auth.uid() = teacher_id);

-- 12. TEACHER PAYOUTS TABLE (Mobile Money / Bank Withdrawals)
CREATE TABLE IF NOT EXISTS public.teacher_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  momo_number text NOT NULL,
  momo_network text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  transfer_code text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.teacher_payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers view own payouts" ON public.teacher_payouts;
CREATE POLICY "Teachers view own payouts" ON public.teacher_payouts FOR SELECT USING (auth.uid() = teacher_id);

-- 13. CONVERSATIONS & MESSAGES TABLES (In-App Messaging)
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own conversations" ON public.conversations;
CREATE POLICY "Users view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = teacher_id OR auth.uid() = parent_id);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Messages viewable by conversation participants" ON public.messages;
CREATE POLICY "Messages viewable by conversation participants" ON public.messages FOR SELECT USING (true);

-- 14. NOTIFICATIONS TABLE (Realtime Alerts & Reminders)
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 15. REVIEWS TABLE (Parent Feedback & Ratings)
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  content text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reviews viewable by all" ON public.reviews;
CREATE POLICY "Reviews viewable by all" ON public.reviews FOR SELECT USING (true);

-- 16. SUPPORT SYSTEM TABLES (Live Admin Support & Tickets)
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read admin settings" ON public.admin_settings;
CREATE POLICY "Public read admin settings" ON public.admin_settings FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.support_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'closed')),
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.support_chats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own support chats" ON public.support_chats;
CREATE POLICY "Users manage own support chats" ON public.support_chats FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES public.support_chats(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_bot boolean DEFAULT false,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Messages viewable by chat owner" ON public.support_messages;
CREATE POLICY "Messages viewable by chat owner" ON public.support_messages FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage support tickets" ON public.support_tickets;
CREATE POLICY "Users manage support tickets" ON public.support_tickets FOR ALL USING (auth.uid() = user_id);

-- 17. EARLY ACCESS SIGNUPS TABLE (Marketing Page Waitlist)
CREATE TABLE IF NOT EXISTS public.early_access_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  role text DEFAULT 'parent',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insertion for early access" ON public.early_access_signups;
CREATE POLICY "Allow insertion for early access" ON public.early_access_signups FOR INSERT WITH CHECK (true);
