export interface Profile {
  id: string;
  username: string;
  email?: string;
  invite_key?: string;
  is_admin?: boolean;
  is_enabled?: boolean;
  created_at?: string;
}

export interface Match {
  id?: string;
  round: string;
  match_number?: number;
  group_name?: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  kickoff_time: string;
  ground?: string;
  is_enabled?: boolean;
  created_at?: string;
}

export interface Prediction {
  id?: string;
  user_id?: string;
  match_id: string;
  home_score: number;
  away_score: number;
  points?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MatchWithPrediction extends Match {
  prediction?: Prediction;
  is_locked: boolean;
}

export interface StandingEntry {
  user_id: string;
  username: string;
  total_points: number;
  exact_scores: number;
  goal_difference: number;
  correct_winner: number;
  predictions_count: number;
}
