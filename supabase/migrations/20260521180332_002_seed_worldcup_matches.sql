/*
  # Seed World Cup 2026 Matches
  
  Insert 72 group stage matches with times converted to UTC-3 (Argentina timezone)
  Grouped by Group A through L
*/

INSERT INTO matches (round, match_number, group_name, home_team, away_team, kickoff_time, ground) VALUES
-- Group A
('Group A', 1, 'Group A', 'Mexico', 'South Africa', '2026-06-11 21:00:00+00', 'Mexico City'),
('Group A', 2, 'Group A', 'South Korea', 'Czech Republic', '2026-06-12 04:00:00+00', 'Guadalajara (Zapopan)'),
('Group A', 3, 'Group A', 'Czech Republic', 'South Africa', '2026-06-18 16:00:00+00', 'Atlanta'),
('Group A', 4, 'Group A', 'Mexico', 'South Korea', '2026-06-19 01:00:00+00', 'Guadalajara (Zapopan)'),
('Group A', 5, 'Group A', 'Czech Republic', 'Mexico', '2026-06-25 01:00:00+00', 'Mexico City'),
('Group A', 6, 'Group A', 'South Africa', 'South Korea', '2026-06-25 01:00:00+00', 'Monterrey (Guadalupe)'),

-- Group B
('Group B', 7, 'Group B', 'Canada', 'Bosnia & Herzegovina', '2026-06-12 19:00:00+00', 'Toronto'),
('Group B', 8, 'Group B', 'Qatar', 'Switzerland', '2026-06-13 19:00:00+00', 'San Francisco Bay Area (Santa Clara)'),
('Group B', 9, 'Group B', 'Switzerland', 'Bosnia & Herzegovina', '2026-06-18 19:00:00+00', 'Los Angeles (Inglewood)'),
('Group B', 10, 'Group B', 'Canada', 'Qatar', '2026-06-18 22:00:00+00', 'Vancouver'),
('Group B', 11, 'Group B', 'Switzerland', 'Canada', '2026-06-24 19:00:00+00', 'Vancouver'),
('Group B', 12, 'Group B', 'Bosnia & Herzegovina', 'Qatar', '2026-06-24 19:00:00+00', 'Seattle'),

-- Group C
('Group C', 13, 'Group C', 'Brazil', 'Morocco', '2026-06-13 22:00:00+00', 'New York/New Jersey (East Rutherford)'),
('Group C', 14, 'Group C', 'Haiti', 'Scotland', '2026-06-14 01:00:00+00', 'Boston (Foxborough)'),
('Group C', 15, 'Group C', 'Scotland', 'Morocco', '2026-06-19 22:00:00+00', 'Boston (Foxborough)'),
('Group C', 16, 'Group C', 'Brazil', 'Haiti', '2026-06-20 00:30:00+00', 'Philadelphia'),
('Group C', 17, 'Group C', 'Scotland', 'Brazil', '2026-06-24 22:00:00+00', 'Miami (Miami Gardens)'),
('Group C', 18, 'Group C', 'Morocco', 'Haiti', '2026-06-24 22:00:00+00', 'Atlanta'),

-- Group D
('Group D', 19, 'Group D', 'USA', 'Paraguay', '2026-06-13 01:00:00+00', 'Los Angeles (Inglewood)'),
('Group D', 20, 'Group D', 'Australia', 'Turkey', '2026-06-14 04:00:00+00', 'Vancouver'),
('Group D', 21, 'Group D', 'USA', 'Australia', '2026-06-19 19:00:00+00', 'Seattle'),
('Group D', 22, 'Group D', 'Turkey', 'Paraguay', '2026-06-20 03:00:00+00', 'San Francisco Bay Area (Santa Clara)'),
('Group D', 23, 'Group D', 'Turkey', 'USA', '2026-06-26 02:00:00+00', 'Los Angeles (Inglewood)'),
('Group D', 24, 'Group D', 'Paraguay', 'Australia', '2026-06-26 02:00:00+00', 'San Francisco Bay Area (Santa Clara)'),

-- Group E
('Group E', 25, 'Group E', 'Germany', 'Curaçao', '2026-06-14 17:00:00+00', 'Houston'),
('Group E', 26, 'Group E', 'Ivory Coast', 'Ecuador', '2026-06-14 23:00:00+00', 'Philadelphia'),
('Group E', 27, 'Group E', 'Germany', 'Ivory Coast', '2026-06-20 20:00:00+00', 'Toronto'),
('Group E', 28, 'Group E', 'Ecuador', 'Curaçao', '2026-06-20 23:00:00+00', 'Kansas City'),
('Group E', 29, 'Group E', 'Curaçao', 'Ivory Coast', '2026-06-25 20:00:00+00', 'Philadelphia'),
('Group E', 30, 'Group E', 'Ecuador', 'Germany', '2026-06-25 20:00:00+00', 'New York/New Jersey (East Rutherford)'),

-- Group F
('Group F', 31, 'Group F', 'Netherlands', 'Japan', '2026-06-14 20:00:00+00', 'Dallas (Arlington)'),
('Group F', 32, 'Group F', 'Sweden', 'Tunisia', '2026-06-15 02:00:00+00', 'Monterrey (Guadalupe)'),
('Group F', 33, 'Group F', 'Netherlands', 'Sweden', '2026-06-20 17:00:00+00', 'Houston'),
('Group F', 34, 'Group F', 'Tunisia', 'Japan', '2026-06-21 04:00:00+00', 'Monterrey (Guadalupe)'),
('Group F', 35, 'Group F', 'Japan', 'Sweden', '2026-06-25 23:00:00+00', 'Dallas (Arlington)'),
('Group F', 36, 'Group F', 'Tunisia', 'Netherlands', '2026-06-25 23:00:00+00', 'Kansas City'),

-- Group G
('Group G', 37, 'Group G', 'Belgium', 'Egypt', '2026-06-15 19:00:00+00', 'Seattle'),
('Group G', 38, 'Group G', 'Iran', 'New Zealand', '2026-06-16 01:00:00+00', 'Los Angeles (Inglewood)'),
('Group G', 39, 'Group G', 'Belgium', 'Iran', '2026-06-21 19:00:00+00', 'Los Angeles (Inglewood)'),
('Group G', 40, 'Group G', 'New Zealand', 'Egypt', '2026-06-22 01:00:00+00', 'Vancouver'),
('Group G', 41, 'Group G', 'Egypt', 'Iran', '2026-06-27 03:00:00+00', 'Seattle'),
('Group G', 42, 'Group G', 'New Zealand', 'Belgium', '2026-06-27 03:00:00+00', 'Vancouver'),

-- Group H
('Group H', 43, 'Group H', 'Spain', 'Cape Verde', '2026-06-15 16:00:00+00', 'Atlanta'),
('Group H', 44, 'Group H', 'Saudi Arabia', 'Uruguay', '2026-06-15 22:00:00+00', 'Miami (Miami Gardens)'),
('Group H', 45, 'Group H', 'Spain', 'Saudi Arabia', '2026-06-21 16:00:00+00', 'Atlanta'),
('Group H', 46, 'Group H', 'Uruguay', 'Cape Verde', '2026-06-21 22:00:00+00', 'Miami (Miami Gardens)'),
('Group H', 47, 'Group H', 'Cape Verde', 'Saudi Arabia', '2026-06-26 23:00:00+00', 'Houston'),
('Group H', 48, 'Group H', 'Uruguay', 'Spain', '2026-06-27 00:00:00+00', 'Guadalajara (Zapopan)'),

-- Group I
('Group I', 49, 'Group I', 'France', 'Senegal', '2026-06-16 19:00:00+00', 'New York/New Jersey (East Rutherford)'),
('Group I', 50, 'Group I', 'Iraq', 'Norway', '2026-06-16 22:00:00+00', 'Boston (Foxborough)'),
('Group I', 51, 'Group I', 'France', 'Iraq', '2026-06-22 21:00:00+00', 'Philadelphia'),
('Group I', 52, 'Group I', 'Norway', 'Senegal', '2026-06-23 00:00:00+00', 'New York/New Jersey (East Rutherford)'),
('Group I', 53, 'Group I', 'Norway', 'France', '2026-06-26 19:00:00+00', 'Boston (Foxborough)'),
('Group I', 54, 'Group I', 'Senegal', 'Iraq', '2026-06-26 19:00:00+00', 'Toronto'),

-- Group J
('Group J', 55, 'Group J', 'Argentina', 'Algeria', '2026-06-17 00:00:00+00', 'Kansas City'),
('Group J', 56, 'Group J', 'Austria', 'Jordan', '2026-06-17 04:00:00+00', 'San Francisco Bay Area (Santa Clara)'),
('Group J', 57, 'Group J', 'Argentina', 'Austria', '2026-06-22 17:00:00+00', 'Dallas (Arlington)'),
('Group J', 58, 'Group J', 'Jordan', 'Algeria', '2026-06-23 03:00:00+00', 'San Francisco Bay Area (Santa Clara)'),
('Group J', 59, 'Group J', 'Algeria', 'Austria', '2026-06-28 02:00:00+00', 'Kansas City'),
('Group J', 60, 'Group J', 'Jordan', 'Argentina', '2026-06-28 02:00:00+00', 'Dallas (Arlington)'),

-- Group K
('Group K', 61, 'Group K', 'Portugal', 'DR Congo', '2026-06-17 17:00:00+00', 'Houston'),
('Group K', 62, 'Group K', 'Uzbekistan', 'Colombia', '2026-06-18 02:00:00+00', 'Mexico City'),
('Group K', 63, 'Group K', 'Portugal', 'Uzbekistan', '2026-06-23 17:00:00+00', 'Houston'),
('Group K', 64, 'Group K', 'Colombia', 'DR Congo', '2026-06-24 02:00:00+00', 'Guadalajara (Zapopan)'),
('Group K', 65, 'Group K', 'Colombia', 'Portugal', '2026-06-27 23:30:00+00', 'Miami (Miami Gardens)'),
('Group K', 66, 'Group K', 'DR Congo', 'Uzbekistan', '2026-06-27 23:30:00+00', 'Atlanta'),

-- Group L
('Group L', 67, 'Group L', 'England', 'Croatia', '2026-06-17 20:00:00+00', 'Dallas (Arlington)'),
('Group L', 68, 'Group L', 'Ghana', 'Panama', '2026-06-17 23:00:00+00', 'Toronto'),
('Group L', 69, 'Group L', 'England', 'Ghana', '2026-06-23 20:00:00+00', 'Boston (Foxborough)'),
('Group L', 70, 'Group L', 'Panama', 'Croatia', '2026-06-23 23:00:00+00', 'Toronto'),
('Group L', 71, 'Group L', 'Panama', 'England', '2026-06-27 21:00:00+00', 'New York/New Jersey (East Rutherford)'),
('Group L', 72, 'Group L', 'Croatia', 'Ghana', '2026-06-27 21:00:00+00', 'Philadelphia');
