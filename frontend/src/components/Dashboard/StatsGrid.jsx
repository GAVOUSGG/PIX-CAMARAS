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
      color: 'zinc',
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
    zinc: darkMode
      ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 shadow-[0_0_15px_rgba(161,161,170,0.15)]'
      : 'bg-zinc-50 text-zinc-600 border-zinc-200 shadow-[0_0_15px_rgba(161,161,170,0.1)]',
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
            className={`rounded-2xl p-4 lg:p-5 relative overflow-hidden transition-all duration-500 border shadow-md group transform-gpu ${
              darkMode 
                ? 'border-white/5' 
                : 'bg-white border-black/5 hover:border-black/10'
            }`}
          >
            {/* Background Glow - Optimized */}
            <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-40 pointer-events-none transition-opacity duration-500 ${glowClasses[stat.color]} ${darkMode ? 'opacity-40' : 'opacity-10'}`}></div>
            
            <div className="flex items-start justify-between relative z-10 w-full mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 border backdrop-blur-md ${colorClasses[stat.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="relative z-10">
              <h3 className={`text-2xl font-black tracking-tight mb-0.5 drop-shadow-sm transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {stat.value}
              </h3>
              <p className={`text-[10px] uppercase font-black tracking-widest transition-colors duration-500 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{stat.title}</p>
            </div>
            
            {/* Divider line */}
            <div className={`w-full h-[1px] my-2.5 relative z-10 ${darkMode ? '' : ''}`}></div>

            <div className="flex items-center gap-2 relative z-10">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border transition-all duration-500 ${
                darkMode 
                  ? 'bg-white/5 border-white/5 text-zinc-400' 
                  : 'bg-black/5 border-black/5 text-zinc-600'
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
