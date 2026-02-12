import React from 'react';
import { Calendar, Camera, Package, Users, MapPin, History, Shield, BarChart3 } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar },
    { id: 'tournaments', label: 'Torneos', icon: Calendar },
    { id: 'workers', label: 'Trabajadores', icon: Users },
    { id: 'cameras', label: 'Cámaras', icon: Camera },
    { id: 'history', label: 'Historial Camaras', icon: History },
    { id: 'logistics', label: 'Logística', icon: Package },
    { id: 'map', label: 'Mapa', icon: MapPin },
    { id: 'statistics', label: 'Estadísticas', icon: BarChart3 }
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  return (
    <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <nav className="flex space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide py-2 md:py-0">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-all duration-200 whitespace-nowrap ${
                activeTab === id
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;