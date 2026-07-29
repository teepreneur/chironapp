-- Chiron Rebuild: Schema Extensions & Generalization

-- 1. Extend Profiles for All Teaching Levels & Payouts
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS teaching_levels text[] DEFAULT '{primary,secondary}',
  ADD COLUMN IF NOT EXISTS institution_affiliation text,
  ADD COLUMN IF NOT EXISTS credentials_by_level jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS momo_number text,
  ADD COLUMN IF NOT EXISTS momo_network text DEFAULT 'mtn';

-- 2. Unified Clients Table (Supports both adult self-learners & parents/guardians)
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

-- Enable RLS on clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view their own clients"
  ON public.clients FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can manage their own clients"
  ON public.clients FOR ALL
  USING (auth.uid() = teacher_id);

-- 3. Extend Gigs/Courses table
ALTER TABLE public.gigs 
  ADD COLUMN IF NOT EXISTS teaching_level text DEFAULT 'primary',
  ADD COLUMN IF NOT EXISTS billing_cycle text DEFAULT 'per_session';

-- 4. Closed-Beta Client Invites
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

CREATE POLICY "Teachers can view their client invites"
  ON public.client_invites FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can manage their client invites"
  ON public.client_invites FOR ALL
  USING (auth.uid() = teacher_id);

CREATE POLICY "Public invite code lookup"
  ON public.client_invites FOR SELECT
  USING (true);

-- 5. Session Notes & Attendance
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

CREATE POLICY "Teachers can view and manage their session notes"
  ON public.session_notes FOR ALL
  USING (auth.uid() = teacher_id);
