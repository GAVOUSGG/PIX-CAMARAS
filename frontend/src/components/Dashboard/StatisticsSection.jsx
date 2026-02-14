import React, { useMemo, memo, useState } from 'react';
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
import { 
  Trophy, 
  Camera, 
  Users, 
  Truck,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar
} from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

const StatisticsSection = memo(({ tournaments = [], cameras = [], workers = [], shipments = [] }) => {
  const [activeTab, setActiveTab] = useState('tournaments');

  // Procesamiento de datos exhaustivo
  const stats = useMemo(() => {
    // --- ESTADÍSTICAS DE TORNEOS ---
    const tournamentStats = {
      duration: [
        { name: '1 Día', value: tournaments.filter(t => t.days === 1).length },
        { name: 'Más de 1 día', value: tournaments.filter(t => t.days > 1).length }
      ].filter(d => d.value > 0),
      
      holes: (() => {
        const map = {};
        tournaments.forEach(t => {
          const key = t.holes ? `${t.holes} Hoyos` : 'Sin definir';
          map[key] = (map[key] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => parseInt(a.name) - parseInt(b.name));
      })(),

      states: (() => {
        const map = {};
        tournaments.forEach(t => {
          if (t.state) map[t.state] = (map[t.state] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
      })(),

      activity: (() => {
        const map = {};
        tournaments.forEach(t => {
          if (t.date) {
            const [year, month, day] = t.date.split('T')[0].split('-').map(Number);
            const date = new Date(year, month - 1, day);
            const monthYear = `${date.toLocaleString('es-MX', { month: 'short' })} ${date.getFullYear()}`;
            map[monthYear] = (map[monthYear] || 0) + 1;
          }
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
      })(),

      types: (() => {
        const map = {};
        tournaments.forEach(t => {
          const daysLabel = t.days === 1 ? '1 Día' : `${t.days} Días`;
          const holesLabel = t.holes ? `${t.holes} Hoyos` : 'Sin hoyos';
          const typeKey = `${daysLabel}, ${holesLabel}`;
          map[typeKey] = (map[typeKey] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
      })()
    };

    // --- ESTADÍSTICAS DE CÁMARAS ---
    const cameraStats = {
      status: (() => {
        const map = {};
        cameras.forEach(c => {
          map[c.status] = (map[c.status] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
      })(),
      
      models: (() => {
        const map = {};
        cameras.forEach(c => {
          map[c.model] = (map[c.model] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
      })()
    };

    // --- ESTADÍSTICAS DE PERSONAL ---
    const workerStats = {
      load: (() => {
        const map = {};
        workers.forEach(w => {
          const count = tournaments.filter(t => t.worker === w.name).length;
          map[w.name] = count;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
      })(),

      status: [
        { name: 'Activos', value: workers.filter(w => w.status === 'activo').length },
        { name: 'Inactivos', value: workers.filter(w => w.status === 'inactivo').length }
      ].filter(d => d.value > 0)
    };

    // --- ESTADÍSTICAS DE LOGÍSTICA ---
    const logisticStats = {
      shipmentStatus: (() => {
        const map = {};
        shipments.forEach(s => {
          map[s.status] = (map[s.status] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
      })(),

      carriers: (() => {
        const map = {};
        shipments.forEach(s => {
          const carrier = s.sender || 'No especificado';
          map[carrier] = (map[carrier] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
      })()
    };

    return { 
      tournaments: tournamentStats, 
      cameras: cameraStats, 
      workers: workerStats, 
      logistics: logisticStats 
    };
  }, [tournaments, cameras, workers, shipments]);

  const tabs = [
    { id: 'tournaments', label: 'Torneos', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'cameras', label: 'Cámaras', icon: Camera, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'workers', label: 'Personal', icon: Users, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { id: 'logistics', label: 'Logística', icon: Truck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const renderSectionHeader = (title, Icon) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-white/5 rounded-xl border border-white/10">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <h4 className="text-white font-bold text-lg tracking-tight">{title}</h4>
    </div>
  );

  return (
    <div className="space-y-8 transform-gpu">
      {/* Selector de Pestañas Desktop */}
      <div className="flex flex-wrap gap-2 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md sticky top-0 z-10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.id 
                ? `${tab.bg} ${tab.color} border border-white/10 shadow-lg` 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : 'text-gray-600'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        
        {/* --- SECCIÓN TORNEOS --- */}
        {activeTab === 'tournaments' && (
          <>
            <div className="md:col-span-2 glass-card rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-2">
                {renderSectionHeader("Tipos de Torneo Detallados", BarChart3)}
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest px-2 py-1 bg-white/5 rounded-lg border border-white/5 mb-6">Días + Hoyos</span>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.tournaments.types} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                    <XAxis type="number" stroke="#4b5563" fontSize={10} axisLine={false} />
                    <YAxis type="category" dataKey="name" stroke="#9ca3af" width={120} fontSize={10} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                    />
                    <Bar dataKey="value" name="Cantidad" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="md:col-span-2 glass-card rounded-[2rem] p-8">
              {renderSectionHeader("Tendencia Mensual de Actividad", TrendingUp)}
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.tournaments.activity}>
                    <defs>
                      <linearGradient id="colorTour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTour)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-8">
              {renderSectionHeader("Mix de Duración", PieChartIcon)}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.tournaments.duration}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.tournaments.duration.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-8">
              {renderSectionHeader("Distribución por Hoyos", BarChart3)}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.tournaments.holes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                    <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="md:col-span-2 glass-card rounded-[2rem] p-8">
              {renderSectionHeader("Torneos por Estado (Top 10)", BarChart3)}
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.tournaments.states} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#4b5563" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60}
                      interval={0}
                      fontSize={10}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                       cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                       contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}
                    />
                    <Bar dataKey="value" name="Torneos" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* --- SECCIÓN CÁMARAS --- */}
        {activeTab === 'cameras' && (
          <>
            <div className="glass-card rounded-[2rem] p-8">
              {renderSectionHeader("Estado del Inventario", PieChartIcon)}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.cameras.status}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.cameras.status.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-8">
              {renderSectionHeader("Stock por Modelo", BarChart3)}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.cameras.models} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                    <XAxis type="number" stroke="#4b5563" fontSize={10} axisLine={false} />
                    <YAxis type="category" dataKey="name" stroke="#9ca3af" width={100} fontSize={10} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* --- SECCIÓN PERSONAL --- */}
        {activeTab === 'workers' && (
          <>
            <div className="md:col-span-2 glass-card rounded-[2rem] p-8">
              {renderSectionHeader("Carga de Trabajo (Torneos)", Trophy)}
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.workers.load}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} axisLine={false} />
                    <YAxis stroke="#4b5563" fontSize={10} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                    <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* --- SECCIÓN LOGÍSTICA --- */}
        {activeTab === 'logistics' && (
          <>
            <div className="glass-card rounded-[2rem] p-8">
              {renderSectionHeader("Estado de Envíos", Calendar)}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.logistics.shipmentStatus}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.logistics.shipmentStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-8">
              {renderSectionHeader("Volumen por Carrier", Truck)}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.logistics.carriers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#4b5563" fontSize={10} />
                    <YAxis stroke="#4b5563" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default StatisticsSection;
