import React, { memo } from 'react';
import StatsGrid from "../components/Dashboard/StatsGrid";
import ActiveTournaments from "../components/Dashboard/ActiveTournaments";
import LogisticsSummary from "../components/Dashboard/LogisticsSummary";
import UpcomingTournaments from "../components/Dashboard/UpcomingTournaments";

// Lazy load heavy components
const MexicoMap = React.lazy(() => import("../components/Map/MexicoMap"));
const StatisticsSection = React.lazy(() => import("../components/Dashboard/StatisticsSection"));

const Dashboard = memo(({ tournamentsData, camerasData, workersData, shipmentsData, darkMode }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userName = user?.username || 'Usuario';
  
  const activeTournamentsCount = React.useMemo(() => 
    tournamentsData?.filter(t => t.status === 'activo').length || 0
  , [tournamentsData]);

  return (
    <div className="space-y-8 pb-12 animate-fade-in transform-gpu">
      {/* Dashboard Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Bienvenido, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">{userName}</span>
          </h1>
          <p className="text-slate-500 mt-1 text-[10px] uppercase tracking-widest font-bold">Resumen General de Operaciones</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className={`px-3 py-1 border rounded-lg text-emerald-400 text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-500 ${darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
            PIX-GOLF
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 border rounded-lg text-blue-400 text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-500 ${darkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
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
          darkMode={darkMode}
        />
      </section>

      {/* 2. Operación y Logística */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
        <div className="xl:col-span-3 space-y-6 md:space-y-8 flex flex-col">
          
          {/* Mapa de Operaciones y Estadísticas */}
          <section className="dashboard-grid-item flex-grow">
            <React.Suspense fallback={
              <div className="h-[600px] w-full bg-[#0B1120] animate-pulse rounded-[2rem] flex items-center justify-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent mix-blend-screen"></div>
                <div className="flex flex-col items-center gap-4 relative z-10">
                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                  <div className="text-slate-400 text-sm font-bold tracking-widest uppercase">Cargando Mapa de Operaciones...</div>
                </div>
              </div>
            }>
              <div className="rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative">
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
              </div>
            </React.Suspense>
          </section>

          {/* Torneos Próximos (Semana) */}
          <section className="dashboard-grid-item">
            <UpcomingTournaments tournaments={tournamentsData} darkMode={darkMode} />
          </section>
          
        </div>

        <div className="xl:col-span-1 space-y-6 md:space-y-8 flex flex-col">
          {/* Torneos Activos */}
          <section className="dashboard-grid-item">
            <ActiveTournaments tournaments={tournamentsData} darkMode={darkMode} />
          </section>
          
          {/* Logística (Compacta) */}
          <section className="dashboard-grid-item">
            <LogisticsSummary shipments={shipmentsData} darkMode={darkMode} />
          </section>
        </div>
      </div>

    </div>
  );
});

export default Dashboard;


