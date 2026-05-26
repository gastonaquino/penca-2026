/*
  # World Cup 2026 Penca - Initial Schema
  
  1. Tables: profiles, matches, predictions with RLS
  2. Security: Row Level Security enabled
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round text NOT NULL,
  match_number integer,
  group_name text,
  home_team text NOT NULL,
  away_team text NOT NULL,
  home_score integer,
  away_score integer,
  kickoff_time timestamptz NOT NULL,
  ground text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view matches" ON matches FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  home_score integer NOT NULL,
  away_score integer NOT NULL,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predictions" ON predictions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own predictions" ON predictions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own predictions" ON predictions FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE UNIQUE INDEX IF NOT EXISTS idx_predictions_user_match ON predictions(user_id, match_id);
CREATE INDEX IF NOT EXISTS idx_matches_kickoff_time ON matches(kickoff_time);
CREATE INDEX IF NOT EXISTS idx_matches_round ON matches(round);
CREATE INDEX IF NOT EXISTS idx_matches_group ON matches(group_name);

CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS predictions_updated_at ON predictions;
CREATE TRIGGER predictions_updated_at BEFORE UPDATE ON predictions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$ BEGIN INSERT INTO profiles (id, username, display_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)), COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))); RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
