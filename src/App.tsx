import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import StandingsPage from './pages/StandingsPage';
import PredictionsPage from './pages/PredictionsPage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'standings' | 'predictions' | 'admin'>('standings');
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a472a] via-[#0d1b2a] to-[#8b1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (showAuth && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a472a] via-[#0d1b2a] to-[#8b1a1a]">
        <AuthPage onBack={() => setShowAuth(false)} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a472a] via-[#0d1b2a] to-[#8b1a1a]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500" />
        </div>
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLoginClick={() => setShowAuth(true)}
        />
        <main className="relative pb-8">
          {currentPage === 'standings' && <StandingsPage />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a472a] via-[#0d1b2a] to-[#8b1a1a]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500" />
      </div>
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="relative pb-8">
        {currentPage === 'standings' && <StandingsPage />}
        {currentPage === 'predictions' && <PredictionsPage />}
        {currentPage === 'admin' && <AdminPage />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
