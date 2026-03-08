
-- User points table
CREATE TABLE public.user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  first_spin_done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own points" ON public.user_points
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own points" ON public.user_points
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own points" ON public.user_points
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Spin history table
CREATE TABLE public.spin_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points_won INTEGER NOT NULL DEFAULT 0,
  prize_label TEXT NOT NULL,
  spun_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.spin_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spins" ON public.spin_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spins" ON public.spin_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points_awarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT TO authenticated USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert referrals" ON public.referrals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = referred_id);

CREATE POLICY "Users can update own referrals" ON public.referrals
  FOR UPDATE TO authenticated USING (auth.uid() = referrer_id);
