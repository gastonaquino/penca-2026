import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatKickoffUTC3, calculatePoints, groupMatchesByGroup, sortGroupsByName } from '../lib/worldcup';
import type { Match, MatchWithPrediction } from '../lib/types';
import { Settings, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminPage() {
  const { profile } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [showDisabled, setShowDisabled] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('matches').select('*').order('match_number');

      if (!error && data && data.length > 0) {
        setMatches(data);

        const scoresMap: Record<string, { home: string; away: string }> = {};
        data.forEach((m) => {
          scoresMap[m.id] = {
            home: m.home_score !== null ? String(m.home_score) : '',
            away: m.away_score !== null ? String(m.away_score) : '',
          };
        });
        setScores(scoresMap);

        const groups = groupMatchesByGroup(data);
        const expandedInit: Record<string, boolean> = {};
        Object.keys(groups).forEach((group, idx) => {
          expandedInit[group] = idx === 0;
        });
        setExpandedGroups(expandedInit);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error cargando partidos' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleScoreChange = (matchId: string, side: 'home' | 'away', value: string) => {
    if (value !== '' && !/^\d{0,2}$/.test(value)) return;
    setScores((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: value },
    }));
  };

  const handleToggleEnabled = async (match: Match) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ is_enabled: !match.is_enabled })
        .eq('id', match.id);

      if (error) throw error;

      setMatches((prev) =>
        prev.map((m) =>
          m.id === match.id ? { ...m, is_enabled: !m.is_enabled } : m
        )
      );

      setMessage({
        type: 'success',
        text: match.is_enabled ? 'Partido deshabilitado' : 'Partido habilitado',
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Error al cambiar estado' });
    }
  };

  const handleSaveResult = async (match: Match) => {
    const matchScores = scores[match.id!];

    if (!matchScores || matchScores.home === '' || matchScores.away === '') {
      setMessage({ type: 'error', text: 'Ingresa ambos resultados' });
      return;
    }

    const homeScore = parseInt(matchScores.home, 10);
    const awayScore = parseInt(matchScores.away, 10);

    if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0 || homeScore > 99 || awayScore > 99) {
      setMessage({ type: 'error', text: 'Resultado inválido' });
      return;
    }

    setSaving(match.id);
    setMessage(null);

    try {
      // Update match with actual result
      const { error: updateError } = await supabase
        .from('matches')
        .update({ home_score: homeScore, away_score: awayScore })
        .eq('id', match.id);

      if (updateError) throw updateError;

      // Fetch predictions for this match
      const { data: predictions, error: fetchError } = await supabase
        .from('predictions')
        .select('id, home_score, away_score')
        .eq('match_id', match.id);

      if (fetchError) throw fetchError;

      // Calculate and update points for each prediction
      if (predictions && predictions.length > 0) {
        for (const pred of predictions) {
          const points = calculatePoints(
            { home: pred.home_score, away: pred.away_score },
            { home: homeScore, away: awayScore }
          );

          const { error: updatePredError } = await supabase
            .from('predictions')
            .update({ points })
            .eq('id', pred.id);

          if (updatePredError) throw updatePredError;
        }
      }

      // Update local state
      setMatches((prev) =>
        prev.map((m) =>
          m.id === match.id ? { ...m, home_score: homeScore, away_score: awayScore } : m
        )
      );

      setMessage({
        type: 'success',
        text: `Resultado guardado: ${homeScore} - ${awayScore}. Puntos calculados para ${predictions?.length || 0} pronósticos.`,
      });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Error al guardar' });
    } finally {
      setSaving(null);
    }
  };

  if (!profile?.is_admin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-200 font-semibold">Acceso denegado</p>
          <p className="text-gray-400 text-sm mt-2">Solo los administradores pueden acceder a esta sección</p>
        </div>
      </div>
    );
  }

  const filteredMatches = showDisabled ? matches : matches.filter(m => m.is_enabled);
  const groupedMatches = groupMatchesByGroup(filteredMatches);
  const sortedGroups = sortGroupsByName(groupedMatches);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Panel de Administrador</h1>
            <p className="text-gray-400 text-sm">Carga resultados y calcula puntos automáticamente</p>
          </div>
        </div>
        <button
          onClick={() => setShowDisabled(!showDisabled)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showDisabled
              ? 'bg-purple-500/30 border border-purple-400 text-purple-200'
              : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
          }`}
        >
          {showDisabled ? 'Mostrando Playoffs' : 'Ver Playoffs'}
        </button>
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
                    <span className="text-xs text-gray-400">
                      ({groupMatches.filter((m) => m.home_score !== null).length}/{groupMatches.length} cargados)
                    </span>
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
                      const matchScores = scores[match.id!] || { home: '', away: '' };
                      const hasChanges =
                        match.home_score === null ||
                        match.away_score === null ||
                        matchScores.home !== String(match.home_score) ||
                        matchScores.away !== String(match.away_score);

                      return (
                        <div key={match.id} className="p-4">
                          <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 justify-between">
                            <span>{formatKickoffUTC3(match.kickoff_time)}</span>
                            <div className="flex items-center gap-2">
                              {match.home_score !== null && match.away_score !== null && (
                                <span className="text-green-400 font-semibold">
                                  <Check className="w-3 h-3 inline mr-1" />
                                  Cargado
                                </span>
                              )}
                              {showDisabled && (
                                <button
                                  onClick={() => handleToggleEnabled(match)}
                                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                    match.is_enabled
                                      ? 'bg-green-500/30 text-green-200 border border-green-400/30'
                                      : 'bg-gray-500/30 text-gray-300 border border-gray-400/30'
                                  }`}
                                >
                                  {match.is_enabled ? 'Activo' : 'Inactivo'}
                                </button>
                              )}
                            </div>
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
                                value={matchScores.home}
                                onChange={(e) => handleScoreChange(match.id!, 'home', e.target.value)}
                                className="w-12 h-10 text-center text-lg font-bold rounded-xl border bg-white/10 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50"
                                placeholder="0"
                              />
                              <span className="text-gray-500 font-bold">-</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={matchScores.away}
                                onChange={(e) => handleScoreChange(match.id!, 'away', e.target.value)}
                                className="w-12 h-10 text-center text-lg font-bold rounded-xl border bg-white/10 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50"
                                placeholder="0"
                              />
                            </div>

                            <div className="flex-1">
                              <p className="font-semibold text-white text-sm">{match.away_team}</p>
                            </div>
                          </div>

                          {hasChanges && (
                            <div className="flex justify-center">
                              <button
                                onClick={() => handleSaveResult(match)}
                                disabled={saving === match.id}
                                className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                              >
                                {saving === match.id ? (
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <>
                                    <Check className="w-4 h-4" />
                                    Guardar Resultado
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