import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatKickoffUTC3, isMatchLockedUTC3, calculatePoints, groupMatchesByGroup, sortGroupsByName } from '../lib/worldcup';
import type { Match, Prediction, MatchWithPrediction } from '../lib/types';
import { Clock, Check, Lock, ChevronDown, ChevronUp, Send, AlertCircle } from 'lucide-react';

export default function PredictionsPage() {
  const { user, profile } = useAuth();
  const [matches, setMatches] = useState<MatchWithPrediction[]>([]);
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [localScores, setLocalScores] = useState<Record<string, { home: string; away: string }>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      const [matchesRes, predictionsRes] = await Promise.all([
        supabase.from('matches').select('*').eq('is_enabled', true).order('kickoff_time'),
        supabase.from('predictions').select('*').eq('user_id', user.id),
      ]);

      let matchData: Match[] = [];
      if (!matchesRes.error && matchesRes.data && matchesRes.data.length > 0) {
        matchData = matchesRes.data;
      }

      const predMap: Record<string, Prediction> = {};
      if (!predictionsRes.error && predictionsRes.data) {
        predictionsRes.data.forEach((p: any) => {
          predMap[p.match_id] = p;
        });
      }

      const enriched: MatchWithPrediction[] = matchData.map((m) => ({
        ...m,
        id: m.id || `local-${m.match_number}`,
        prediction: predMap[m.id || `local-${m.match_number}`],
        is_locked: isMatchLockedUTC3(m.kickoff_time),
      }));

      setPredictions(predMap);
      setMatches(enriched);

      const scores: Record<string, { home: string; away: string }> = {};
      enriched.forEach((m) => {
        const mid = m.id || `local-${m.match_number}`;
        if (predMap[mid]) {
          scores[mid] = {
            home: String(predMap[mid].home_score),
            away: String(predMap[mid].away_score),
          };
        } else {
          scores[mid] = { home: '', away: '' };
        }
      });
      setLocalScores(scores);

      // Initialize expanded groups
      const groups = groupMatchesByGroup(enriched);
      const expandedInit: Record<string, boolean> = {};
      Object.keys(groups).forEach((group, idx) => {
        expandedInit[group] = idx === 0; // Only expand first group by default
      });
      setExpandedGroups(expandedInit);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error cargando partidos' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleScoreChange = (matchId: string, side: 'home' | 'away', value: string) => {
    if (value !== '' && !/^\d{0,2}$/.test(value)) return;
    setLocalScores((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: value },
    }));
  };

  const handleSave = async (match: MatchWithPrediction) => {
    if (!user || !profile) return;

    const matchId = match.id || `local-${match.match_number}`;
    const scores = localScores[matchId];

    if (!scores || scores.home === '' || scores.away === '') {
      setMessage({ type: 'error', text: 'Ingresa ambos resultados' });
      return;
    }

    const homeScore = parseInt(scores.home, 10);
    const awayScore = parseInt(scores.away, 10);

    if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0 || homeScore > 99 || awayScore > 99) {
      setMessage({ type: 'error', text: 'Resultado inválido' });
      return;
    }

    setSaving(matchId);
    setMessage(null);

    try {
      const existing = predictions[matchId];

      if (existing) {
        const { error } = await supabase
          .from('predictions')
          .update({ home_score: homeScore, away_score: awayScore })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('predictions')
          .insert({
            user_id: user.id,
            match_id: matchId,
            home_score: homeScore,
            away_score: awayScore,
          });

        if (error) throw error;
      }

      // Update local state
      setPredictions((prev) => ({
        ...prev,
        [matchId]: {
          match_id: matchId,
          home_score: homeScore,
          away_score: awayScore,
          points: 0,
        },
      }));

      setMessage({ type: 'success', text: 'Pronóstico guardado' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Error al guardar' });
    } finally {
      setSaving(null);
    }
  };

  const getMatchResult = (match: MatchWithPrediction): { label: string; color: string } | null => {
    if (match.home_score === null || match.away_score === null) return null;
    if (match.home_score > match.away_score) return { label: 'Local', color: 'text-green-400' };
    if (match.home_score < match.away_score) return { label: 'Visitante', color: 'text-blue-400' };
    return { label: 'Empate', color: 'text-yellow-400' };
  };

  const groupedMatches = groupMatchesByGroup(matches);
  const sortedGroups = sortGroupsByName(groupedMatches);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
          <Send className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Pronósticos</h1>
          <p className="text-gray-400 text-sm">Ingresa tus resultados antes del inicio de cada partido</p>
        </div>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-green-500/20 border border-green-400/30 text-green-200'
            : 'bg-red-500/20 border border-red-400/30 text-red-200'
        }`}>
          <AlertCircle className="w-4 h-4" />
          {message.text}
        </div>
      )}

      <div className="mb-4 bg-blue-500/10 border border-blue-400/20 rounded-xl p-3 text-xs text-blue-200">
        <p className="font-semibold mb-1">Sistema de Puntuación:</p>
        <div className="space-y-1 text-gray-300">
          <div>Resultado exacto: <span className="text-blue-300 font-bold">5 pts</span></div>
          <div>Diferencia de gol correcta: <span className="text-blue-300 font-bold">3 pts</span></div>
          <div>Ganador/empate correcto: <span className="text-blue-300 font-bold">2 pts</span></div>
          <div>No acierta: <span className="text-blue-300 font-bold">0 pts</span></div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {sortedGroups.map(([group, groupMatches]) => {
            const isExpanded = expandedGroups[group];

            return (
              <div key={group} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }))}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{group}</span>
                    <span className="text-xs text-gray-400">({groupMatches.length} partidos)</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-white/5 divide-y divide-white/5">
                    {groupMatches.map((match) => {
                      const matchId = match.id || `local-${match.match_number}`;
                      const locked = match.is_locked;
                      const scores = localScores[matchId] || { home: '', away: '' };
                      const pred = predictions[matchId];
                      const hasChanges = pred
                        ? (parseInt(scores.home) !== pred.home_score || parseInt(scores.away) !== pred.away_score)
                        : (scores.home !== '' && scores.away !== '');
                      const result = getMatchResult(match);

                      return (
                        <div key={matchId} className={`p-4 ${locked ? 'opacity-60' : ''}`}>
                          <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {formatKickoffUTC3(match.kickoff_time)}
                            {locked && (
                              <span className="flex items-center gap-1 text-red-400 ml-auto">
                                <Lock className="w-3 h-3" />
                                Cerrado
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex-1 text-right">
                              <p className="font-semibold text-white text-sm">{match.home_team}</p>
                              {match.ground && <p className="text-xs text-gray-500">{match.ground}</p>}
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                inputMode="numeric"
                                value={scores.home}
                                onChange={(e) => handleScoreChange(matchId, 'home', e.target.value)}
                                disabled={locked}
                                className={`w-12 h-10 text-center text-lg font-bold rounded-xl border transition-all ${
                                  locked
                                    ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed'
                                    : 'bg-white/10 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50'
                                }`}
                                placeholder="0"
                              />
                              <span className="text-gray-500 font-bold">-</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={scores.away}
                                onChange={(e) => handleScoreChange(matchId, 'away', e.target.value)}
                                disabled={locked}
                                className={`w-12 h-10 text-center text-lg font-bold rounded-xl border transition-all ${
                                  locked
                                    ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed'
                                    : 'bg-white/10 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50'
                                }`}
                                placeholder="0"
                              />
                            </div>

                            <div className="flex-1">
                              <p className="font-semibold text-white text-sm">{match.away_team}</p>
                            </div>
                          </div>

                          {match.home_score !== null && match.away_score !== null && (
                            <div className="mb-2 text-center">
                              <span className="text-xs text-gray-400">
                                Resultado: <span className="text-white font-bold">{match.home_score} - {match.away_score}</span>
                                {result && <span className={`ml-1 ${result.color}`}>({result.label})</span>}
                              </span>
                            </div>
                          )}

                          {pred && (
                            <div className="mb-2 text-center">
                              <span className="text-xs text-green-400 flex items-center justify-center gap-1">
                                <Check className="w-3 h-3" />
                                Pronóstico guardado: {pred.home_score} - {pred.away_score}
                                {pred.points && pred.points > 0 && (
                                  <span className="ml-1 text-yellow-400 font-bold">({pred.points} pts)</span>
                                )}
                              </span>
                            </div>
                          )}

                          {!locked && hasChanges && (
                            <div className="flex justify-center">
                              <button
                                onClick={() => handleSave(match)}
                                disabled={saving === matchId}
                                className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                              >
                                {saving === matchId ? (
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Guardar
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
