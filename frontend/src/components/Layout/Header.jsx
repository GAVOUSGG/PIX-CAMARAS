import React from 'react';
import { Menu, LogOut } from 'lucide-react';

const Header = ({ user, onLogout, onMenuClick }) => {
  return (
    <header className="bg-transparent border-b border-white/5 relative z-10">
      <div className="px-4 py-4 md:px-8 md:py-5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left Side: Mobile Menu Button */}
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          {/* Right Side: Utilities & Quick Profile */}
          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* Date Display (Desktop) */}
            <div className="text-right hidden sm:block px-4 border-r border-white/10">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Hoy</p>
              <p className="text-sm font-bold text-slate-200">
                {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>

            {/* User Profile Area or Logout */}
            {user && (
              <div className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 pr-2 pl-3 py-1.5 rounded-full transition-colors border border-white/5">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Hola</p>
                  <p className="text-sm font-bold text-emerald-400 leading-tight">{user.username}</p>
                </div>
                
                <button 
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="w-8 h-8 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-full transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
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