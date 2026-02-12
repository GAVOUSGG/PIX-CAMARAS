import React from 'react';
import { Camera } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  return (
    <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2 md:space-x-3 pl-12 md:pl-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hidden md:flex">
              <Camera className="w-4 h-4 md:w-6 md:h-6 text-emerald-400" />
            </div>
            <h1 className="text-lg md:text-2xl font-bold text-white tracking-tight">PixGolf</h1>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-6">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Bienvenido</p>
                  <p className="text-sm font-bold text-white">{user.username}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 rounded-lg text-[10px] md:text-sm font-bold transition-all whitespace-nowrap"
                >
                  SALIR
                </button>
              </div>
            )}
            <div className="text-right hidden md:block border-l border-white/10 pl-6">
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Hoy</p>
              <p className="text-sm font-bold text-white">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;