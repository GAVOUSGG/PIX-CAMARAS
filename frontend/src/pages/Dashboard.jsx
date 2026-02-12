import React, { memo } from 'react';
import StatsGrid from "../components/Dashboard/StatsGrid";
import ActiveTournaments from "../components/Dashboard/ActiveTournaments";
import LogisticsSummary from "../components/Dashboard/LogisticsSummary";
import UpcomingTournaments from "../components/Dashboard/UpcomingTournaments";

// Lazy load heavy components
const MexicoMap = React.lazy(() => import("../components/Map/MexicoMap"));
const StatisticsSection = React.lazy(() => import("../components/Dashboard/StatisticsSection"));

const Dashboard = memo(({ tournamentsData, camerasData, workersData, shipmentsData }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.name || 'Administrador';
  
  const currentDate = React.useMemo(() => new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), []);

  const activeTournamentsCount = React.useMemo(() => 
    tournamentsData?.filter(t => t.status === 'activo').length || 0
  , [tournamentsData]);

  return (
    <div className="space-y-8 pb-12 animate-fade-in transform-gpu">
      {/* Dashboard Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Bienvenido, <span className="text-emerald-400">{userName}</span>
          </h1>
          <p className="text-gray-400 mt-1 capitalize">{currentDate}</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium">
            PIX-GOLF
          </div>
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-sm font-medium">
            {activeTournamentsCount} Torneos hoy
          </div>
        </div>
      </header>

      {/* 1. KPIs Principales */}
      <section className="dashboard-grid-item">
        <StatsGrid
          tournaments={tournamentsData}
          cameras={camerasData}
          workers={workersData}
        />
      </section>

      {/* 2. Operación y Logística */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          {/* Mapa de Operaciones */}
          <section className="glass-card rounded-3xl overflow-hidden shadow-2xl dashboard-grid-item">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h3 className="text-lg font-semibold text-white">Cobertura Nacional</h3>
              <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">En Vivo</span>
            </div>
            <div className="p-2 min-h-[450px]">
              <React.Suspense fallback={
                <div className="h-[500px] w-full bg-slate-800/50 animate-pulse rounded-2xl flex items-center justify-center">
                  <div className="text-gray-500 text-sm font-medium">Cargando Mapa de Operaciones...</div>
                </div>
              }>
                <MexicoMap
                  tournaments={tournamentsData}
                  workers={workersData}
                  cameras={camerasData}
                  shipments={shipmentsData}
                />
              </React.Suspense>
            </div>
          </section>

          {/* Torneos Próximos (Semana) */}
          <section className="dashboard-grid-item">
            <UpcomingTournaments tournaments={tournamentsData} />
          </section>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Logística (Compacta) */}
          <section className="dashboard-grid-item">
            <LogisticsSummary shipments={shipmentsData} />
          </section>

          {/* Torneos Activos */}
          <section className="dashboard-grid-item">
            <ActiveTournaments tournaments={tournamentsData} />
          </section>
        </div>
      </div>

      {/* 3. Análisis y Estadísticas */}
      <section className="pt-8 border-t border-white/5 dashboard-grid-item">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          <h3 className="text-2xl font-bold text-white">Análisis de Operaciones</h3>
        </div>
        <React.Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[400px] glass-card animate-pulse rounded-3xl"></div>
            <div className="h-[400px] glass-card animate-pulse rounded-3xl"></div>
          </div>
        }>
          <StatisticsSection tournaments={tournamentsData} />
        </React.Suspense>
      </section>
    </div>
  );
});

export default Dashboard;


