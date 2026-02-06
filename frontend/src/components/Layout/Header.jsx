import React from 'react';
import { Camera } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  return (
    <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">PixGolf</h1>
                
              </div>
            </div>
            {/* Mobile Date - Visible only on small screens */}
            <div className="md:hidden text-right">
              <p className="text-white font-semibold text-sm">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between md:justify-end space-x-4 w-full md:w-auto">
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-300 hidden md:inline">Hola, {user.username}</span>
                <span className="text-sm text-slate-300 md:hidden">{user.username}</span>
                <button 
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs md:text-sm transition-colors whitespace-nowrap"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-400">Hoy</p>
              <p className="text-white font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;