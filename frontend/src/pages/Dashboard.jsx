import React, { memo } from 'react';
import StatsGrid from "../components/Dashboard/StatsGrid";
import ActiveTournaments from "../components/Dashboard/ActiveTournaments";
import LogisticsSummary from "../components/Dashboard/LogisticsSummary";
import UpcomingTournaments from "../components/Dashboard/UpcomingTournaments";

// Lazy load heavy components
const MexicoMap = React.lazy(() => import("../components/Map/MexicoMap"));
const StatisticsSection = React.lazy(() => import("../components/Dashboard/StatisticsSection"));

const Dashboard = memo(({ tournamentsData, camerasData, workersData, shipmentsData }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
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
      <section className="dashboard-grid-item">
        <UpcomingTournaments tournaments={tournamentsData} />
      </section>
      {/* 2. Operación y Logística */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          {/* Mapa de Operaciones y Estadísticas */}
          <section className="dashboard-grid-item">
            <React.Suspense fallback={
              <div className="h-[600px] w-full bg-slate-800/50 animate-pulse rounded-3xl flex items-center justify-center border border-white/10">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                  <div className="text-gray-500 text-sm font-medium">Cargando Mapa de Operaciones...</div>
                </div>
              </div>
            }>
              <MexicoMap
                tournaments={tournamentsData}
                workers={workersData}
                cameras={camerasData}
                shipments={shipmentsData}
                showStatistics={false}
                initialFilters={{
                  tournaments: false,
                  workers: false,
                  cameras: false,
                  shipments: false,
                }}
              />
            </React.Suspense>
          </section>

          {/* Torneos Próximos (Semana) */}
          
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

    </div>
  );
});

export default Dashboard;


