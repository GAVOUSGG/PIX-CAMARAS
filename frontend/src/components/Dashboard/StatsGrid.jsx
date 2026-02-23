import React, { memo, useMemo } from 'react';
import { Calendar, Camera, Users, AlertCircle } from 'lucide-react';

const StatsGrid = memo(({ tournaments, cameras, workers, darkMode }) => {
  const stats = useMemo(() => [
    {
      title: 'Torneos Activos',
      value: tournaments.filter(t => t.status === 'activo').length,
      icon: Calendar,
      color: 'emerald',
      description: 'Torneos activos'
    },
    {
      title: 'Cámaras en Uso',
      value: cameras.filter(c => c.status === 'en uso').length,
      icon: Camera,
      color: 'red',
      description: `de ${cameras.length} solares`
    },
    {
      title: 'Trabajadores',
      value: workers.filter(w => w.status === 'activo').length,
      icon: Users,
      color: 'blue',
      description: 'Activos en campo'
    },
    {
      title: 'Mantenimiento',
      value: cameras.filter(c => c.status === 'mantenimiento').length,
      icon: AlertCircle,
      color: 'orange',
      description: 'Cámaras en servicio'
    }
  ], [tournaments, cameras, workers]);

  const colorClasses = {
    emerald: darkMode 
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
      : 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
    red: darkMode
      ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
      : 'bg-red-50 text-red-600 border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
    blue: darkMode
      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
      : 'bg-blue-50 text-blue-600 border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
    orange: darkMode
      ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
      : 'bg-orange-50 text-orange-600 border-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
  };

  const glowClasses = {
    emerald: '',
    red: '',
    blue: '',
    orange: ''
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className={`rounded-3xl p-5 lg:p-6 relative overflow-hidden transition-all duration-500 border shadow-lg group transform-gpu ${
              darkMode 
                ? 'border-white/5' 
                : 'bg-white border-black/5 hover:border-black/10'
            }`}
          >
            {/* Background Glow - Optimized */}
            <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-40 pointer-events-none transition-opacity duration-500 ${glowClasses[stat.color]} ${darkMode ? 'opacity-40' : 'opacity-10'}`}></div>
            
            <div className="flex items-start justify-between relative z-10 w-full mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border backdrop-blur-md ${colorClasses[stat.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>

            <div className="relative z-10">
              <h3 className={`text-3xl font-black tracking-tight mb-1 drop-shadow-md transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {stat.value}
              </h3>
              <p className={`text-[10px] uppercase font-black tracking-widest transition-colors duration-500 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{stat.title}</p>
            </div>
            
            {/* Divider line */}
            <div className={`w-full h-px my-3 relative z-10 ${darkMode ? '' : ''}`}></div>

            <div className="flex items-center gap-2 relative z-10">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all duration-500 ${
                darkMode 
                  ? 'bg-white/5 border-white/5 text-slate-400' 
                  : 'bg-black/5 border-black/5 text-slate-600'
              }`}>
                {stat.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default StatsGrid;
