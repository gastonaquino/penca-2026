import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Trophy, Mail, Lock, User, ArrowRight, KeyRound, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onBack?: () => void;
}

export default function AuthPage({ onBack }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [inviteKey, setInviteKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!username.trim()) {
          setError('Ingresa tu nombre de usuario');
          setLoading(false);
          return;
        }
        if (!inviteKey.trim()) {
          setError('Ingresa tu clave de invitación');
          setLoading(false);
          return;
        }

        const keyUpper = inviteKey.trim().toUpperCase();

        // Validate invite key exists and is unused
        const { data: keyData, error: keyError } = await supabase
          .from('invite_keys')
          .select('id, is_used')
          .eq('key', keyUpper)
          .maybeSingle();

        if (keyError || !keyData) {
          setError('Clave de invitación inválida');
          setLoading(false);
          return;
        }

        if (keyData.is_used) {
          setError('Esta clave ya fue utilizada');
          setLoading(false);
          return;
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username.trim() },
          },
        });

        if (authError) throw authError;

        // Create profile manually
        /*if (authData.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            username: username.trim(),
            email: email,
            is_admin: false,
            is_enabled: true,
          });

          if (profileError) throw profileError;

          // Mark invite key as used
          await supabase
            .from('invite_keys')
            .update({ is_used: true, used_by: authData.user.id })
            .eq('id', keyData.id);
        }*/

        if (authData.user) {
          await supabase
            .from('invite_keys')
            .update({
              is_used: true,
              used_by: authData.user.id
          })
          .eq('id', keyData.id);
      }
      }
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        setError('Este email ya está registrado');
      } else if (err.message?.includes('Invalid login')) {
        setError('Email o contraseña incorrectos');
      } else {
        setError(err.message || 'Ocurrió un error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a472a] via-[#0d1b2a] to-[#8b1a1a] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a posiciones
          </button>
        )}

        <div className="text-center mb-8">
          <img
            src="/Copia_de_Copia_de_Cabecera.png"
            alt="PENCA"
            className="h-24 mx-auto object-contain mb-4"
          />

          <h1 className="text-4xl font-bold text-white tracking-tight">
            Penca <span className="text-yellow-400">Mundial</span>
          </h1>
          <p className="text-gray-300 mt-2 text-lg">World Cup 2026</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isLogin ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-300 hover:text-white'
              }`}
            >
              Ingresar
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !isLogin ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-300 hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Usuario</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                      placeholder="ej: carlos_futbol"
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Clave de invitación</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={inviteKey}
                      onChange={(e) => setInviteKey(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all uppercase tracking-widest"
                      placeholder="EJ: 11R8HW"
                      required={!isLogin}
                      maxLength={6}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Ingresar' : 'Crear cuenta'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">FIFA World Cup 2026 - USA, Mexico & Canada</p>
      </div>
    </div>
  );
}
