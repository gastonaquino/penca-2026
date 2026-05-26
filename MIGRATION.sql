-- World Cup 2026 Penca - Database Schema Migration
-- Execute this in Supabase SQL Editor when ready

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create matches table
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

-- Create predictions table
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

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_predictions_user_match ON predictions(user_id, match_id);
CREATE INDEX IF NOT EXISTS idx_matches_kickoff_time ON matches(kickoff_time);
CREATE INDEX IF NOT EXISTS idx_matches_round ON matches(round);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS predictions_updated_at ON predictions;
CREATE TRIGGER predictions_updated_at BEFORE UPDATE ON predictions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$ BEGIN INSERT INTO profiles (id, username, display_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)), COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))); RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert World Cup 2026 matches (in UTC-3 timezone)
INSERT INTO matches (round, match_number, group_name, home_team, away_team, kickoff_time, ground) VALUES
('Matchday 1', 1, 'Group A', 'Mexico', 'South Africa', '2026-06-11 21:00:00+00', 'Mexico City'),
('Matchday 1', 2, 'Group A', 'South Korea', 'Czech Republic', '2026-06-12 04:00:00+00', 'Guadalajara (Zapopan)'),
('Matchday 8', 3, 'Group A', 'Czech Republic', 'South Africa', '2026-06-18 16:00:00+00', 'Atlanta'),
('Matchday 8', 4, 'Group A', 'Mexico', 'South Korea', '2026-06-19 01:00:00+00', 'Guadalajara (Zapopan)'),
('Matchday 14', 5, 'Group A', 'Czech Republic', 'Mexico', '2026-06-25 01:00:00+00', 'Mexico City'),
('Matchday 14', 6, 'Group A', 'South Africa', 'South Korea', '2026-06-25 01:00:00+00', 'Monterrey (Guadalupe)'),
('Matchday 2', 7, 'Group B', 'Canada', 'Bosnia & Herzegovina', '2026-06-12 19:00:00+00', 'Toronto'),
('Matchday 3', 8, 'Group B', 'Qatar', 'Switzerland', '2026-06-13 19:00:00+00', 'San Francisco Bay Area (Santa Clara)'),
('Matchday 8', 9, 'Group B', 'Switzerland', 'Bosnia & Herzegovina', '2026-06-18 19:00:00+00', 'Los Angeles (Inglewood)'),
('Matchday 8', 10, 'Group B', 'Canada', 'Qatar', '2026-06-18 22:00:00+00', 'Vancouver'),
('Matchday 14', 11, 'Group B', 'Switzerland', 'Canada', '2026-06-24 19:00:00+00', 'Vancouver'),
('Matchday 14', 12, 'Group B', 'Bosnia & Herzegovina', 'Qatar', '2026-06-24 19:00:00+00', 'Seattle'),
('Matchday 3', 13, 'Group C', 'Brazil', 'Morocco', '2026-06-13 22:00:00+00', 'New York/New Jersey (East Rutherford)'),
('Matchday 3', 14, 'Group C', 'Haiti', 'Scotland', '2026-06-14 01:00:00+00', 'Boston (Foxborough)'),
('Matchday 9', 15, 'Group C', 'Scotland', 'Morocco', '2026-06-19 22:00:00+00', 'Boston (Foxborough)'),
('Matchday 9', 16, 'Group C', 'Brazil', 'Haiti', '2026-06-20 00:30:00+00', 'Philadelphia'),
('Matchday 14', 17, 'Group C', 'Scotland', 'Brazil', '2026-06-24 22:00:00+00', 'Miami (Miami Gardens)'),
('Matchday 14', 18, 'Group C', 'Morocco', 'Haiti', '2026-06-24 22:00:00+00', 'Atlanta'),
('Matchday 2', 19, 'Group D', 'USA', 'Paraguay', '2026-06-13 01:00:00+00', 'Los Angeles (Inglewood)'),
('Matchday 3', 20, 'Group D', 'Australia', 'Turkey', '2026-06-14 04:00:00+00', 'Vancouver'),
('Matchday 9', 21, 'Group D', 'USA', 'Australia', '2026-06-19 19:00:00+00', 'Seattle'),
('Matchday 9', 22, 'Group D', 'Turkey', 'Paraguay', '2026-06-20 03:00:00+00', 'San Francisco Bay Area (Santa Clara)'),
('Matchday 15', 23, 'Group D', 'Turkey', 'USA', '2026-06-26 02:00:00+00', 'Los Angeles (Inglewood)'),
('Matchday 15', 24, 'Group D', 'Paraguay', 'Australia', '2026-06-26 02:00:00+00', 'San Francisco Bay Area (Santa Clara)'),
('Matchday 4', 25, 'Group E', 'Germany', 'Curaçao', '2026-06-14 17:00:00+00', 'Houston'),
('Matchday 4', 26, 'Group E', 'Ivory Coast', 'Ecuador', '2026-06-14 23:00:00+00', 'Philadelphia'),
('Matchday 10', 27, 'Group E', 'Germany', 'Ivory Coast', '2026-06-20 20:00:00+00', 'Toronto'),
('Matchday 10', 28, 'Group E', 'Ecuador', 'Curaçao', '2026-06-20 23:00:00+00', 'Kansas City'),
('Matchday 15', 29, 'Group E', 'Curaçao', 'Ivory Coast', '2026-06-25 20:00:00+00', 'Philadelphia'),
('Matchday 15', 30, 'Group E', 'Ecuador', 'Germany', '2026-06-25 20:00:00+00', 'New York/New Jersey (East Rutherford)'),
('Matchday 4', 31, 'Group F', 'Netherlands', 'Japan', '2026-06-14 20:00:00+00', 'Dallas (Arlington)'),
('Matchday 4', 32, 'Group F', 'Sweden', 'Tunisia', '2026-06-15 02:00:00+00', 'Monterrey (Guadalupe)'),
('Matchday 10', 33, 'Group F', 'Netherlands', 'Sweden', '2026-06-20 17:00:00+00', 'Houston'),
('Matchday 10', 34, 'Group F', 'Tunisia', 'Japan', '2026-06-21 04:00:00+00', 'Monterrey (Guadalupe)'),
('Matchday 15', 35, 'Group F', 'Japan', 'Sweden', '2026-06-25 23:00:00+00', 'Dallas (Arlington)'),
('Matchday 15', 36, 'Group F', 'Tunisia', 'Netherlands', '2026-06-25 23:00:00+00', 'Kansas City'),
('Matchday 5', 37, 'Group G', 'Belgium', 'Egypt', '2026-06-15 19:00:00+00', 'Seattle'),
('Matchday 5', 38, 'Group G', 'Iran', 'New Zealand', '2026-06-16 01:00:00+00', 'Los Angeles (Inglewood)'),
('Matchday 11', 39, 'Group G', 'Belgium', 'Iran', '2026-06-21 19:00:00+00', 'Los Angeles (Inglewood)'),
('Matchday 11', 40, 'Group G', 'New Zealand', 'Egypt', '2026-06-22 01:00:00+00', 'Vancouver'),
('Matchday 16', 41, 'Group G', 'Egypt', 'Iran', '2026-06-27 03:00:00+00', 'Seattle'),
('Matchday 16', 42, 'Group G', 'New Zealand', 'Belgium', '2026-06-27 03:00:00+00', 'Vancouver'),
('Matchday 5', 43, 'Group H', 'Spain', 'Cape Verde', '2026-06-15 16:00:00+00', 'Atlanta'),
('Matchday 5', 44, 'Group H', 'Saudi Arabia', 'Uruguay', '2026-06-15 22:00:00+00', 'Miami (Miami Gardens)'),
('Matchday 11', 45, 'Group H', 'Spain', 'Saudi Arabia', '2026-06-21 16:00:00+00', 'Atlanta'),
('Matchday 11', 46, 'Group H', 'Uruguay', 'Cape Verde', '2026-06-21 22:00:00+00', 'Miami (Miami Gardens)'),
('Matchday 16', 47, 'Group H', 'Cape Verde', 'Saudi Arabia', '2026-06-26 23:00:00+00', 'Houston'),
('Matchday 16', 48, 'Group H', 'Uruguay', 'Spain', '2026-06-27 00:00:00+00', 'Guadalajara (Zapopan)'),
('Matchday 6', 49, 'Group I', 'France', 'Senegal', '2026-06-16 19:00:00+00', 'New York/New Jersey (East Rutherford)'),
('Matchday 6', 50, 'Group I', 'Iraq', 'Norway', '2026-06-16 22:00:00+00', 'Boston (Foxborough)'),
('Matchday 12', 51, 'Group I', 'France', 'Iraq', '2026-06-22 21:00:00+00', 'Philadelphia'),
('Matchday 12', 52, 'Group I', 'Norway', 'Senegal', '2026-06-23 00:00:00+00', 'New York/New Jersey (East Rutherford)'),
('Matchday 16', 53, 'Group I', 'Norway', 'France', '2026-06-26 19:00:00+00', 'Boston (Foxborough)'),
('Matchday 16', 54, 'Group I', 'Senegal', 'Iraq', '2026-06-26 19:00:00+00', 'Toronto'),
('Matchday 6', 55, 'Group J', 'Argentina', 'Algeria', '2026-06-17 00:00:00+00', 'Kansas City'),
('Matchday 6', 56, 'Group J', 'Austria', 'Jordan', '2026-06-17 04:00:00+00', 'San Francisco Bay Area (Santa Clara)'),
('Matchday 12', 57, 'Group J', 'Argentina', 'Austria', '2026-06-22 17:00:00+00', 'Dallas (Arlington)'),
('Matchday 12', 58, 'Group J', 'Jordan', 'Algeria', '2026-06-23 03:00:00+00', 'San Francisco Bay Area (Santa Clara)'),
('Matchday 17', 59, 'Group J', 'Algeria', 'Austria', '2026-06-28 02:00:00+00', 'Kansas City'),
('Matchday 17', 60, 'Group J', 'Jordan', 'Argentina', '2026-06-28 02:00:00+00', 'Dallas (Arlington)'),
('Matchday 7', 61, 'Group K', 'Portugal', 'DR Congo', '2026-06-17 17:00:00+00', 'Houston'),
('Matchday 7', 62, 'Group K', 'Uzbekistan', 'Colombia', '2026-06-18 02:00:00+00', 'Mexico City'),
('Matchday 13', 63, 'Group K', 'Portugal', 'Uzbekistan', '2026-06-23 17:00:00+00', 'Houston'),
('Matchday 13', 64, 'Group K', 'Colombia', 'DR Congo', '2026-06-24 02:00:00+00', 'Guadalajara (Zapopan)'),
('Matchday 17', 65, 'Group K', 'Colombia', 'Portugal', '2026-06-27 23:30:00+00', 'Miami (Miami Gardens)'),
('Matchday 17', 66, 'Group K', 'DR Congo', 'Uzbekistan', '2026-06-27 23:30:00+00', 'Atlanta'),
('Matchday 7', 67, 'Group L', 'England', 'Croatia', '2026-06-17 20:00:00+00', 'Dallas (Arlington)'),
('Matchday 7', 68, 'Group L', 'Ghana', 'Panama', '2026-06-17 23:00:00+00', 'Toronto'),
('Matchday 13', 69, 'Group L', 'England', 'Ghana', '2026-06-23 20:00:00+00', 'Boston (Foxborough)'),
('Matchday 13', 70, 'Group L', 'Panama', 'Croatia', '2026-06-23 23:00:00+00', 'Toronto'),
('Matchday 17', 71, 'Group L', 'Panama', 'England', '2026-06-27 21:00:00+00', 'New York/New Jersey (East Rutherford)'),
('Matchday 17', 72, 'Group L', 'Croatia', 'Ghana', '2026-06-27 21:00:00+00', 'Philadelphia');
