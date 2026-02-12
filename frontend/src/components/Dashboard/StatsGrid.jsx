import React from 'react';
import { Calendar, Camera, Users, AlertCircle } from 'lucide-react';

const StatsGrid = ({ tournaments, cameras, workers }) => {
  const stats = [
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
  ];

  const colorClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400',
    red: 'bg-red-500/20 text-red-400',
    blue: 'bg-blue-500/20 text-blue-400',
    orange: 'bg-orange-500/20 text-orange-400'
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index} 
            className="glass-card glass-card-hover rounded-3xl p-6 relative overflow-hidden group"
          >
            {/* Background Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${colorClasses[stat.color].replace('bg-', 'bg-').split(' ')[0]}`}></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClasses[stat.color]} border border-white/5`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 relative z-10">
              <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-white/5 rounded-full border border-white/5">
                {stat.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};


export default StatsGrid;