import React, { memo, useMemo } from 'react';
import { Calendar, Camera, Users, AlertCircle } from 'lucide-react';

const StatsGrid = memo(({ tournaments, cameras, workers }) => {
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
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    red: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
  };

  const glowClasses = {
    emerald: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    red: 'from-red-500/20 via-red-500/5 to-transparent',
    blue: 'from-blue-500/20 via-blue-500/5 to-transparent',
    orange: 'from-orange-500/20 via-orange-500/5 to-transparent'
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className="rounded-3xl p-5 lg:p-6 relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-[#0B1120] border border-white/5 shadow-lg group transform-gpu"
          >
            {/* Background Glow - Optimized */}
            <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] opacity-40 pointer-events-none ${glowClasses[stat.color]}`}></div>
            
            <div className="flex items-start justify-between relative z-10 w-full mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]} border backdrop-blur-md`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white tracking-tight mb-1 drop-shadow-md">
                {stat.value}
              </h3>
              <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{stat.title}</p>
            </div>
            
            {/* Divider line */}
            <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent my-3 relative z-10"></div>

            
            <div className="flex items-center gap-2 relative z-10">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2.5 py-1 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
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
