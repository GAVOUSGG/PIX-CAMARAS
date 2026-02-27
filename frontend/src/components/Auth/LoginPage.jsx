import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { API_URL } from '../../config';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data); // data contains { user, token }
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/login-bg.png')" }}
    >
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[2px]"></div>

      <div className="bg-white/60 backdrop-blur-2xl border border-white/60 p-8 md:p-12 rounded-sm shadow-[0_8px_32px_rgba(0,0,0,0.15)] w-full max-w-md relative z-10 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(16,185,129,0.15)]">
        <div className="text-center mb-10">
          
          <h1 className="text-4xl font-black text-emerald-950 mb-2 tracking-tight">PIXGOLF</h1>
          <p className="text-emerald-800/80 font-medium">Inicio de Sesión</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-sm mb-6 text-sm font-bold text-center animate-fade-in shadow-inner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/70 ml-2">
              Usuario de red
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110 duration-300">
                <User className="h-5 w-5 text-emerald-600/60 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 bg-white/40 border-2 border-white/50 rounded-sm text-emerald-950 placeholder-emerald-900/30 focus:outline-none focus:ring-0 focus:border-emerald-500 focus:bg-white/80 transition-all duration-300 shadow-inner font-medium text-lg"
                placeholder="Usuario"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-widest text-emerald-900/70 ml-2">
              Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110 duration-300">
                <Lock className="h-5 w-5 text-emerald-600/60 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 bg-white/40 border-2 border-white/50 rounded-sm text-emerald-950 placeholder-emerald-900/30 focus:outline-none focus:ring-0 focus:border-emerald-500 focus:bg-white/80 transition-all duration-300 shadow-inner font-medium text-lg tracking-widest"
                placeholder="⬢⬢⬢⬢⬢⬢⬢⬢⬢⬢"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative mt-8 flex justify-center py-4 px-4 border border-transparent shadow-xl shadow-emerald-600/20 text-base font-black uppercase tracking-widest text-white bg-lime-700 hover:bg-lime-500 hover:shadow-emerald-500/30 hover:-tranzinc-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 tranzinc-y-full group-hover:tranzinc-y-0 transition-transform duration-500"></div>
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-emerald-200 border-t-white rounded-full animate-spin" />
              ) : (
                'Ingresar al Sistema'
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
