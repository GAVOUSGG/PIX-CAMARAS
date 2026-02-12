import React, { useMemo, memo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

const StatisticsSection = memo(({ tournaments }) => {
  // Procesamiento de datos para las gráficas
  const stats = useMemo(() => {
    if (!tournaments || tournaments.length === 0) return null;

    // 1. Duración de torneos (1 día vs Más días)
    const durationStats = [
      { name: '1 Día', value: 0 },
      { name: 'Más de 1 día', value: 0 }
    ];

    // 2. Distribución de Hoyos
    const holesMap = {};
    const stateMap = {};
    const monthlyActivity = {};
    const typeMap = {};

    tournaments.forEach(t => {
      // Duración
      if (t.days === 1) durationStats[0].value++;
      else durationStats[1].value++;

      // Hoyos
      const holeKey = t.holes ? `${t.holes} Hoyos` : 'Sin definir';
      holesMap[holeKey] = (holesMap[holeKey] || 0) + 1;

      // Estado
      if (t.state) {
        stateMap[t.state] = (stateMap[t.state] || 0) + 1;
      }

      // Actividad Mensual
      if (t.date) {
        const date = new Date(t.date);
        const monthYear = `${date.toLocaleString('es-MX', { month: 'short' })} ${date.getFullYear()}`;
        monthlyActivity[monthYear] = (monthlyActivity[monthYear] || 0) + 1;
      }

      // Tipo Detallado
      const daysLabel = t.days === 1 ? '1 Día' : `${t.days} Días`;
      const holesLabel = t.holes ? `${t.holes} Hoyos` : 'Sin hoyos';
      const typeKey = `${daysLabel}, ${holesLabel}`;
      typeMap[typeKey] = (typeMap[typeKey] || 0) + 1;
    });

    return {
      duration: durationStats.filter(d => d.value > 0),
      holes: Object.entries(holesMap).map(([name, value]) => ({ name, value })).sort((a, b) => parseInt(a.name) - parseInt(b.name)),
      states: Object.entries(stateMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10),
      activity: Object.entries(monthlyActivity).map(([name, value]) => ({ name, value })),
      types: Object.entries(typeMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8)
    };
  }, [tournaments]);

  if (!stats) return null;

  return (
    <div className="space-y-8 transform-gpu">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Tipos de Torneo Detallados */}
        <div className="md:col-span-2 glass-card rounded-3xl p-8 min-w-0">
           <div className="flex items-center justify-between mb-6">
             <h4 className="text-white font-semibold">Tipo de torneos</h4>
             <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest px-2 py-1 bg-white/5 rounded-lg border border-white/5">Días + Hoyos</span>
           </div>
           <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={stats.types} layout="vertical" margin={{ left: 40, right: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                 <XAxis type="number" stroke="#4b5563" fontSize={10} />
                 <YAxis type="category" dataKey="name" stroke="#9ca3af" width={120} fontSize={10} />
                 <Tooltip 
                   cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                 />
                 <Bar dataKey="value" name="Cantidad" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Distribución por Duración (Pie) */}
        <div className="glass-card rounded-3xl p-8 min-w-0">
          <h4 className="text-white font-semibold mb-6">Mix de Duración</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.duration}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.duration.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}
                />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución por Hoyos (Bar) */}
        <div className="glass-card rounded-3xl p-8 min-w-0">
          <h4 className="text-white font-semibold mb-6">Distribución de Hoyos</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.holes} margin={{ top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} />
                <YAxis stroke="#4b5563" fontSize={10} />
                <Tooltip 
                   cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}
                />
                <Bar dataKey="value" name="Torneos" fill="#10b981" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Torneos por Estado (Bar) */}
        <div className="md:col-span-2 glass-card rounded-3xl p-8 min-w-0">
          <h4 className="text-white font-semibold mb-6">Penetración por Estado (Top 10)</h4>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.states} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#4b5563" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  interval={0}
                  fontSize={10}
                />
                <YAxis stroke="#4b5563" fontSize={10} />
                <Tooltip 
                   cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}
                />
                <Bar dataKey="value" name="Torneos" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actividad Reciente (Area) */}
        {stats.activity.length > 0 && (
          <div className="md:col-span-2 glass-card rounded-3xl p-8 min-w-0">
            <h4 className="text-white font-semibold mb-6">Tendencia Anual</h4>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.activity}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} />
                  <YAxis stroke="#4b5563" fontSize={10} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="Torneos"
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default StatisticsSection;

