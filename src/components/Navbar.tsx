import { useAuth } from '../contexts/AuthContext';
import { Trophy, Send, LogOut, User, Settings, LogIn } from 'lucide-react';

interface NavbarProps {
  currentPage: 'standings' | 'predictions' | 'admin';
  onNavigate: (page: 'standings' | 'predictions' | 'admin') => void;
  onLoginClick?: () => void;
}

export default function Navbar({ currentPage, onNavigate, onLoginClick }: NavbarProps) {
  const { profile, signOut, user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-[#0d1b2a]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <img src="/Copia_de_Copia_de_Cabecera.png" alt="PENCA" className="h-12 object-contain" />
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => onNavigate('standings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentPage === 'standings'
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Posiciones</span>
              </button>
              {user && (
                <button
                  onClick={() => onNavigate('predictions')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    currentPage === 'predictions'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Pronósticos</span>
                </button>
              )}
              {profile?.is_admin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    currentPage === 'admin'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-gray-300 hidden sm:inline">{profile?.username || ''}</span>
                {profile?.is_admin && (
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full font-semibold">Admin</span>
                )}
              </div>
              <button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Iniciar sesión</span>
            </button>
          )}
        </div>

        {/* Mobile nav */}
        <div className="flex sm:hidden items-center gap-1 pb-2 -mt-1 overflow-x-auto">
          <button
            onClick={() => onNavigate('standings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentPage === 'standings'
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Posiciones
          </button>
          {user && (
            <button
              onClick={() => onNavigate('predictions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                currentPage === 'predictions'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              Pronósticos
            </button>
          )}
          {profile?.is_admin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                currentPage === 'admin'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
