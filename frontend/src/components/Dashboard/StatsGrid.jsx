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
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/10',
    red: 'bg-red-500/20 text-red-400 border-red-500/10',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/10',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/10'
  };

  const glowClasses = {
    emerald: 'bg-emerald-500/5',
    red: 'bg-red-500/5',
    blue: 'bg-blue-500/5',
    orange: 'bg-orange-500/5'
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className="glass-card rounded-3xl p-6 relative overflow-hidden transform-gpu"
          >
            {/* Background Glow - Optimized: lower blur and opacity */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-opacity duration-500 ${glowClasses[stat.color]}`}></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">{stat.title}</p>
                <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClasses[stat.color]} border`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 relative z-10">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-2.5 py-1 bg-white/[0.03] rounded-lg border border-white/5">
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
