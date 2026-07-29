-- ==========================================
-- CHIRON COMPLETE DATABASE INITIALIZATION
-- Run this script in the SQL Editor of a NEW Supabase Project
-- ==========================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
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
  verification_status text DEFAULT 'pending',
  avatar_url text,
  city text,
  country text DEFAULT 'Ghana',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Auto-create profile trigger on auth signup
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
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Gigs / Courses Table
CREATE TABLE IF NOT EXISTS public.gigs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  price_per_session numeric NOT NULL,
  teaching_level text DEFAULT 'primary',
  billing_cycle text DEFAULT 'per_session',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Gigs viewable by all" ON public.gigs;
CREATE POLICY "Gigs viewable by all" ON public.gigs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Teachers manage own gigs" ON public.gigs;
CREATE POLICY "Teachers manage own gigs" ON public.gigs FOR ALL USING (auth.uid() = teacher_id);

-- 3. Students / Learners Table
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text,
  grade_level text,
  dob date,
  location text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Parents manage own students" ON public.students;
CREATE POLICY "Parents manage own students" ON public.students FOR ALL USING (auth.uid() = parent_id);

-- 4. Unified Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  client_type text NOT NULL CHECK (client_type IN ('self_learner', 'parent_guardian')),
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text,
  learner_name text NOT NULL,
  teaching_level text NOT NULL CHECK (teaching_level IN ('preschool', 'primary', 'secondary', 'university', 'adult_professional')),
  notes text,
  invite_code text UNIQUE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers view own clients" ON public.clients;
CREATE POLICY "Teachers view own clients" ON public.clients FOR SELECT USING (auth.uid() = teacher_id);
DROP POLICY IF EXISTS "Teachers manage own clients" ON public.clients;
CREATE POLICY "Teachers manage own clients" ON public.clients FOR ALL USING (auth.uid() = teacher_id);

-- 5. Closed-Beta Client Invites
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
DROP POLICY IF EXISTS "Teachers view client invites" ON public.client_invites;
CREATE POLICY "Teachers view client invites" ON public.client_invites FOR SELECT USING (auth.uid() = teacher_id);
DROP POLICY IF EXISTS "Teachers manage client invites" ON public.client_invites;
CREATE POLICY "Teachers manage client invites" ON public.client_invites FOR ALL USING (auth.uid() = teacher_id);
DROP POLICY IF EXISTS "Public invite lookup" ON public.client_invites;
CREATE POLICY "Public invite lookup" ON public.client_invites FOR SELECT USING (true);

-- 6. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id uuid REFERENCES public.gigs(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- 7. Booking Sessions & Session Notes
CREATE TABLE IF NOT EXISTS public.booking_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  session_number integer NOT NULL,
  scheduled_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'rescheduled', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.booking_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Session view" ON public.booking_sessions;
CREATE POLICY "Session view" ON public.booking_sessions FOR SELECT USING (true);

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

-- 8. Payments & Teacher Payouts
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'GHS',
  status text DEFAULT 'success',
  paystack_reference text UNIQUE NOT NULL,
  paid_at timestamptz DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Payments viewable" ON public.payments;
CREATE POLICY "Payments viewable" ON public.payments FOR SELECT USING (true);

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

-- 9. Teacher Availability
CREATE TABLE IF NOT EXISTS public.teacher_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day_of_week text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true
);

ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Availability viewable by all" ON public.teacher_availability;
CREATE POLICY "Availability viewable by all" ON public.teacher_availability FOR SELECT USING (true);
DROP POLICY IF EXISTS "Teachers manage availability" ON public.teacher_availability;
CREATE POLICY "Teachers manage availability" ON public.teacher_availability FOR ALL USING (auth.uid() = teacher_id);

-- 10. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  link text,
  action_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 11. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reviews viewable by all" ON public.reviews;
CREATE POLICY "Reviews viewable by all" ON public.reviews FOR SELECT USING (true);
