
-- Casino offers table
CREATE TABLE public.casino_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  casino_name text NOT NULL,
  bonus_text text NOT NULL,
  description text,
  affiliate_link text NOT NULL,
  banner_url text,
  is_active boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.casino_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active offers" ON public.casino_offers
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Casinos table
CREATE TABLE public.casinos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  affiliate_link text NOT NULL,
  logo_url text,
  is_top boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.casinos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active casinos" ON public.casinos
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Bot users table
CREATE TABLE public.bot_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id bigint NOT NULL UNIQUE,
  username text,
  first_name text,
  welcome_variant integer NOT NULL DEFAULT 1,
  joined_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bot_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for bot_users" ON public.bot_users
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
