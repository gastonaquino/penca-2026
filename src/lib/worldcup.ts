export interface Match {
  id?: string;
  round: string;
  match_number?: number;
  group_name?: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  kickoff_time: string; // ISO 8601 string in UTC
  ground?: string;
  created_at?: string;
}

export function formatKickoffUTC3(dateStr: string): string {
  const date = new Date(dateStr);
  // All times are stored in UTC, but they represent UTC-3 time
  // So we just display them directly (they're already in UTC-3 when stored)
  return date.toLocaleDateString('es-UY', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });
}

export function isMatchLockedUTC3(kickoffTimeUTC: string): boolean {
  const now = new Date();
  const kickoffDate = new Date(kickoffTimeUTC);
  // Compare directly (both in UTC)
  return now >= kickoffDate;
}

export function calculatePoints(
  predicted: { home: number; away: number },
  actual: { home: number; away: number }
): number {
  // Resultado exacto: 5 puntos
  if (predicted.home === actual.home && predicted.away === actual.away) {
    return 5;
  }

  const predictedDiff = predicted.home - predicted.away;
  const actualDiff = actual.home - actual.away;

  // Diferencia de gol correcta: 3 puntos
  if (Math.abs(predictedDiff) === Math.abs(actualDiff)) {
    // Mismo diferencial
    if ((predictedDiff > 0 && actualDiff > 0) || (predictedDiff < 0 && actualDiff < 0) || (predictedDiff === 0 && actualDiff === 0)) {
      return 3;
    }
  }

  // Ganador/empate correcto: 2 puntos
  if ((predictedDiff > 0 && actualDiff > 0) || (predictedDiff < 0 && actualDiff < 0) || (predictedDiff === 0 && actualDiff === 0)) {
    return 2;
  }

  // No acierta: 0 puntos
  return 0;
}

export function groupMatchesByGroup(matches: Match[]): Record<string, Match[]> {
  const groups: Record<string, Match[]> = {};

  matches.forEach((match) => {
    const group = match.group_name || 'Sin Grupo';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(match);
  });

  // Sort each group by kickoff time
  Object.keys(groups).forEach((group) => {
    groups[group].sort((a, b) => {
      const dateA = new Date(a.kickoff_time).getTime();
      const dateB = new Date(b.kickoff_time).getTime();
      return dateA - dateB;
    });
  });

  return groups;
}

export function sortGroupsByName(groups: Record<string, Match[]>): Array<[string, Match[]]> {
  const entries = Object.entries(groups);

  return entries.sort(([groupA], [groupB]) => {
    // Sort by group letter (Group A, Group B, etc)
    return groupA.localeCompare(groupB);
  });
}
