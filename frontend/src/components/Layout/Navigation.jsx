import React from 'react';
import { Calendar, Camera, Package, Users, MapPin, History, Shield, BarChart3, X, LayoutDashboard } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, user, isOpen, setIsOpen, darkMode }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
    if (setIsOpen) setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className={`flex flex-col h-full transition-colors duration-500 ${darkMode ? 'bg-[#0B1120]' : 'bg-slate-50'}`}>
      {/* Brand area */}
      <div className="p-6 md:p-8 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className={`p-2 rounded-xl border transition-all duration-500 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-emerald-500 border-emerald-600 shadow-lg shadow-emerald-500/20'}`}>
            <Camera className={`w-5 h-5 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-white'}`} />
          </div>
          <span className={`text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r tracking-tight transition-all duration-500 ${
            darkMode ? 'from-white to-white/70' : 'from-slate-900 to-slate-700'
          }`}>
            PixGolf
          </span>
        </div>
        
        {/* Mobile Close Button */}
        {setIsOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className={`md:hidden p-2 rounded-lg transition-colors border border-transparent ${
              darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-black/5 hover:border-black/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-2 pb-6 custom-scrollbar">
        <div className="mb-4 px-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden md:block">
            Menú Principal
          </p>
        </div>
        {menuItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`
                w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
                ${
                  isActive
                    ? darkMode 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5'
                      : 'bg-emerald-500 text-white border border-emerald-600 shadow-lg shadow-emerald-500/20 font-bold'
                    : darkMode
                      ? 'text-slate-400 hover:bg-white/5 hover:text-slate-100 hover:border-white/5 border border-transparent'
                      : 'text-slate-500 hover:bg-black/5 hover:text-slate-900 hover:border-black/5 border border-transparent'
                }
              `}
            >
              <div className="flex items-center space-x-3.5">
                <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? (darkMode ? 'text-emerald-400' : 'text-white') : (darkMode ? 'text-slate-400 group-hover:text-slate-100' : 'text-slate-500 group-hover:text-slate-900')}`} />
                <span className="text-sm font-semibold tracking-wide">{label}</span>
              </div>
              
              {isActive && (
                <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] ${darkMode ? 'bg-emerald-400' : 'bg-white'}`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Area for aesthetics */}
      {user && (
        <div className={`p-4 mx-4 mb-6 rounded-2xl border backdrop-blur-xl shrink-0 transition-colors duration-500 ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/5' 
            : 'bg-white border-black/5 shadow-sm'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${
              darkMode ? 'bg-emerald-500/20 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
            }`}>
              <span className="text-sm font-bold text-emerald-500">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest truncate">
                {user.role === 'admin' ? 'Administrador' : 'Operador'}
              </p>
              <p className={`text-sm font-bold truncate transition-colors duration-500 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{user.username}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block w-72 h-screen border-r relative z-20 shrink-0 transition-colors duration-500 ${
        darkMode ? 'border-white/5 bg-[#0B1120]' : 'border-black/5 bg-slate-50'
      }`}>
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <>
          <div 
            className={`fixed inset-0 z-[70] md:hidden animate-in fade-in duration-300 ${darkMode ? 'bg-[#0B1120]/80 backdrop-blur-sm' : 'bg-slate-900/40 backdrop-blur-sm'}`}
            onClick={() => setIsOpen(false)}
          />
          <div className={`fixed inset-y-0 left-0 w-[300px] max-w-[85vw] border-r z-[80] md:hidden shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col ${
            darkMode ? 'bg-[#0B1120] border-white/10 shadow-black' : 'bg-white border-black/10 shadow-slate-200'
          }`}>
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;