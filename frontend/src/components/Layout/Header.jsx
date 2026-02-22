import React from 'react';
import { Menu, LogOut, Sun, Moon } from 'lucide-react';

const Header = ({ user, onLogout, onMenuClick, darkMode, setDarkMode }) => {
  return (
    <header className={`bg-transparent border-b relative z-10 transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
      <div className="px-4 py-4 md:px-8 md:py-5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left Side: Mobile Menu Button */}
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={onMenuClick}
              className={`md:hidden p-2 -ml-2 rounded-lg transition-colors ${darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-black/5'}`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          {/* Right Side: Utilities & Quick Profile */}
          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10 shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
                  : 'bg-black/5 border-black/10 text-blue-600 hover:bg-black/10 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
              }`}
              title={darkMode ? "Pasar a modo claro" : "Pasar a modo oscuro"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Date Display (Desktop) */}
            <div className={`text-right hidden sm:block px-4 border-r ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-tight">Hoy</p>
              <p className={`text-sm font-bold leading-tight ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>

            {/* User Profile Area or Logout */}
            {user && (
              <div className={`flex items-center space-x-3 pr-2 pl-3 py-1.5 rounded-full transition-all border ${
                darkMode 
                  ? 'bg-white/5 hover:bg-white/10 border-white/5' 
                  : 'bg-black/5 hover:bg-black/10 border-black/5'
              }`}>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-tight">Hola</p>
                  <p className="text-sm font-bold text-emerald-500 leading-tight">{user.username}</p>
                </div>
                
                <button 
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="w-8 h-8 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all duration-300 shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;