import React, { useMemo } from 'react';
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

const StatisticsSection = ({ tournaments }) => {
  // Procesamiento de datos para las gráficas
  const stats = useMemo(() => {
    if (!tournaments) return null;

    // 1. Duración de torneos (1 día vs Más días)
    const durationStats = [
      { name: '1 Día', value: 0 },
      { name: 'Más de 1 día', value: 0 }
    ];

    // 2. Distribución de Hoyos
    const holesMap = {};

    // 3. Torneos por Estado
    const stateMap = {};

    // 4. Actividad Mensual (para AreaChart)
    const monthlyActivity = {};

    // 5. Tipo Detallado (Días + Hoyos)
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

    // Formatear datos para Recharts
    const holesData = Object.entries(holesMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));

    const stateData = Object.entries(stateMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 estados

    const activityData = Object.entries(monthlyActivity)
      .map(([name, value]) => ({ name, value }));
      
    const typeData = Object.entries(typeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      duration: durationStats.filter(d => d.value > 0),
      holes: holesData,
      states: stateData,
      activity: activityData,
      types: typeData
    };
  }, [tournaments]);

  if (!tournaments || tournaments.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Tipos de Torneo Detallados */}
        <div className="md:col-span-2 glass-card rounded-3xl p-8 min-w-0">
           <div className="flex items-center justify-between mb-6">
             <h4 className="text-white font-semibold">Configuraciones Populares</h4>
             <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5">Días + Hoyos</span>
           </div>
           <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={stats.types} layout="vertical" margin={{ left: 40, right: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                 <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                 <YAxis type="category" dataKey="name" stroke="#9ca3af" width={120} fontSize={12} />
                 <Tooltip 
                   cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                 />
                 <Bar dataKey="value" name="Cantidad" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={24} />
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
                  outerRadius={100}
                  paddingAngle={5}
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {stats.duration.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" interval={0} fontSize={12} />
                <YAxis stroke="#9ca3af" allowDecimals={false} fontSize={12} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" name="Torneos" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  interval={0}
                  fontSize={11}
                />
                <YAxis stroke="#9ca3af" allowDecimals={false} fontSize={12} />
                <Tooltip 
                   cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" name="Torneos" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actividad Reciente (Area) */}
        {stats.activity.length > 0 && (
          <div className="md:col-span-2 glass-card rounded-3xl p-8 min-w-0">
            <h4 className="text-white font-semibold mb-6">Tendencia Histórica</h4>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.activity}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" allowDecimals={false} fontSize={12} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="Torneos"
                    stroke="#f59e0b" 
                    strokeWidth={3}
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
};

export default StatisticsSection;
