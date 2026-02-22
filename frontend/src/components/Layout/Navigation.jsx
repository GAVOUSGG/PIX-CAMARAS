import React from 'react';
import { Calendar, Camera, Package, Users, MapPin, History, Shield, BarChart3, X, LayoutDashboard } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, user, isOpen, setIsOpen }) => {
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
    <div className="flex flex-col h-full bg-[#0B1120]">
      {/* Brand area */}
      <div className="p-6 md:p-8 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div>
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight">
            PixGolf
          </span>
        </div>
        
        {/* Mobile Close Button */}
        {setIsOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
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
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100 hover:border-white/5 border border-transparent'
                }
              `}
            >
              <div className="flex items-center space-x-3.5">
                <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-100'}`} />
                <span className="text-sm font-semibold tracking-wide">{label}</span>
              </div>
              
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Area for aesthetics */}
      {user && (
        <div className="p-4 mx-4 mb-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/5 backdrop-blur-xl shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-emerald-400">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest truncate">
                {user.role === 'admin' ? 'Administrador' : 'Operador'}
              </p>
              <p className="text-sm font-bold text-slate-200 truncate">{user.username}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 h-screen border-r border-white/5 bg-[#0B1120] relative z-20 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-[#0B1120]/80 backdrop-blur-sm z-[70] md:hidden animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-[#0B1120] border-r border-white/10 z-[80] md:hidden shadow-dark-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;