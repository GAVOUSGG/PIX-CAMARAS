import React, { useState } from 'react';
import { Calendar, Camera, Package, Users, MapPin, History, Shield, BarChart3, Menu, X } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar },
    { id: 'tournaments', label: 'Torneos', icon: Calendar },
    { id: 'workers', label: 'Trabajadores', icon: Users },
    { id: 'cameras', label: 'Cámaras', icon: Camera },
    { id: 'history', label: 'Historial Cámaras', icon: History },
    { id: 'logistics', label: 'Logística', icon: Package },
    { id: 'map', label: 'Mapa', icon: MapPin },
    { id: 'statistics', label: 'Estadísticas', icon: BarChart3 }
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  const handleSelect = (id) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button - Floating for high visibility */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Navigation (Stays as is, or slightly refined) */}
      <div className="hidden md:block bg-slate-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto md:px-6">
          <nav className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center space-x-2 px-4 py-5 border-b-2 transition-all duration-300 whitespace-nowrap group relative
                  ${
                    activeTab === id
                      ? 'border-emerald-400 text-emerald-400 bg-emerald-400/5'
                      : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
                {activeTab === id && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[70] md:hidden animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer Sidebar */}
          <div className="fixed inset-y-0 left-0 w-[280px] bg-slate-900 border-r border-white/10 z-[80] md:hidden shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">PixGolf</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {menuItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleSelect(id)}
                  className={`
                    w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-200
                    ${
                      activeTab === id
                        ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${activeTab === id ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <span className="text-sm uppercase tracking-wide">{label}</span>
                </button>
              ))}
            </nav>

            {user && (
              <div className="p-6 border-t border-white/5 bg-slate-950/20">
                <div className="mb-4">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Usuario</p>
                  <p className="text-sm font-bold text-white">{user.username}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;