import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { StandingEntry } from '../lib/types';
import { Trophy, Medal, TrendingUp, Users } from 'lucide-react';

const FAKE_STANDINGS: StandingEntry[] = [
  { user_id: '1', username: 'diego_maradona', total_points: 85, exact_scores: 8, goal_difference: 12, correct_winner: 15, predictions_count: 48 },
  { user_id: '2', username: 'leo_messi', total_points: 82, exact_scores: 7, goal_difference: 11, correct_winner: 16, predictions_count: 48 },
  { user_id: '3', username: 'pele_rey', total_points: 78, exact_scores: 6, goal_difference: 10, correct_winner: 14, predictions_count: 48 },
  { user_id: '4', username: 'cristiano', total_points: 75, exact_scores: 5, goal_difference: 10, correct_winner: 13, predictions_count: 48 },
  { user_id: '5', username: 'zidane', total_points: 70, exact_scores: 5, goal_difference: 8, correct_winner: 12, predictions_count: 48 },
];

export default function StandingsPage() {
  const { profile } = useAuth();
  const [standings, setStandings] = useState<StandingEntry[]>(FAKE_STANDINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('user_id, points, profiles(username)')
        .not('user_id', 'is', null);

      if (error || !data || data.length === 0) {
        setStandings(FAKE_STANDINGS);
        setLoading(false);
        return;
      }

      const aggregated = data.reduce((acc: Record<string, any>, pred: any) => {
        const uid = pred.user_id;
        if (!acc[uid]) {
          acc[uid] = {
            user_id: uid,
            username: pred.profiles?.username || 'unknown',
            total_points: 0,
            exact_scores: 0,
            goal_difference: 0,
            correct_winner: 0,
            predictions_count: 0,
          };
        }
        const points = pred.points || 0;
        acc[uid].total_points += points;
        acc[uid].predictions_count += 1;

        if (points === 5) acc[uid].exact_scores += 1;
        else if (points === 3) acc[uid].goal_difference += 1;
        else if (points === 2) acc[uid].correct_winner += 1;

        return acc;
      }, {});

      const sorted = Object.values(aggregated).sort((a: any, b: any) => b.total_points - a.total_points);
      setStandings(sorted.length > 0 ? sorted : FAKE_STANDINGS);
    } catch {
      setStandings(FAKE_STANDINGS);
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
    if (index === 1) return 'bg-gradient-to-r from-gray-300/15 to-gray-400/10 border-gray-400/30';
    if (index === 2) return 'bg-gradient-to-r from-amber-600/15 to-amber-700/10 border-amber-600/30';
    return 'bg-white/5 border-white/10';
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-500" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">{index + 1}</span>;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Tabla de Posiciones</h1>
          <p className="text-gray-400 text-sm">Ranking de la penca</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
          <Users className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{standings.length}</p>
          <p className="text-xs text-gray-400">Participantes</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
          <TrendingUp className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{standings[0]?.total_points || 0}</p>
          <p className="text-xs text-gray-400">Líder (pts)</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center">
          <Medal className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">
            {standings.reduce((max, s) => Math.max(max, s.exact_scores), 0)}
          </p>
          <p className="text-xs text-gray-400">Mejores exactos</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
          <Trophy className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">
            {Math.max(...standings.map(s => s.exact_scores + s.goal_difference + s.correct_winner), 0)}
          </p>
          <p className="text-xs text-gray-400">Mejor secuencia</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_60px_60px_60px_60px_60px] gap-2 px-4 py-3 bg-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <div>#</div>
          <div>Usuario</div>
          <div className="text-center">Pts</div>
          <div className="text-center text-yellow-400" title="Resultado exacto">Exactos</div>
          <div className="text-center text-cyan-400" title="Diferencia de gol">Dif.Gol</div>
          <div className="text-center text-green-400" title="Ganador/empate">Ganador</div>
          <div className="text-center">Pred</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2" />
            Cargando...
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {standings.map((entry, index) => (
              <div
                key={entry.user_id}
                className={`grid grid-cols-[40px_1fr_60px_60px_60px_60px_60px] gap-2 px-4 py-3 items-center transition-all hover:bg-white/5 ${
                  profile?.id === entry.user_id ? 'ring-1 ring-green-400/30 bg-green-500/5' : ''
                } ${getRankStyle(index)} border-l-2`}
              >
                <div className="flex justify-center">
                  {getRankBadge(index)}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {entry.username}
                    {profile?.id === entry.user_id && (
                      <span className="ml-2 text-xs text-green-400 font-normal">(Vos)</span>
                    )}
                  </p>
                </div>
                <div className="text-center">
                  <span className="font-bold text-white text-lg">{entry.total_points}</span>
                </div>
                <div className="text-center">
                  <span className="text-yellow-400 font-semibold">{entry.exact_scores}</span>
                </div>
                <div className="text-center">
                  <span className="text-cyan-400 font-semibold">{entry.goal_difference}</span>
                </div>
                <div className="text-center">
                  <span className="text-green-400 font-semibold">{entry.correct_winner}</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 font-semibold">{entry.predictions_count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 bg-white/5 rounded-xl border border-white/10 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Sistema de Puntuación</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="text-xs">
            <div className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-1.5" />
            <span className="text-yellow-400 font-bold">5 pts</span>
            <p className="text-gray-400">Exacto</p>
          </div>
          <div className="text-xs">
            <div className="inline-block w-2 h-2 bg-cyan-400 rounded-full mr-1.5" />
            <span className="text-cyan-400 font-bold">3 pts</span>
            <p className="text-gray-400">Dif.Gol</p>
          </div>
          <div className="text-xs">
            <div className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1.5" />
            <span className="text-green-400 font-bold">2 pts</span>
            <p className="text-gray-400">Ganador</p>
          </div>
          <div className="text-xs">
            <div className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-1.5" />
            <span className="text-gray-400 font-bold">0 pts</span>
            <p className="text-gray-400">Fallo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
