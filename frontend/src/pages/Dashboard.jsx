import React, { memo } from 'react';
import { Trophy, Camera, Truck } from 'lucide-react';
import StatsGrid from "../components/Dashboard/StatsGrid";
import ActiveTournaments from "../components/Dashboard/ActiveTournaments";
import LogisticsSummary from "../components/Dashboard/LogisticsSummary";
import UpcomingTournaments from "../components/Dashboard/UpcomingTournaments";

// Lazy load heavy components
const MexicoMap = React.lazy(() => import("../components/Map/MexicoMap"));
const StatisticsSection = React.lazy(() => import("../components/Dashboard/StatisticsSection"));

const Dashboard = memo(({ tournamentsData, camerasData, workersData, shipmentsData, darkMode, setActiveTab, setOpenCreateModal }) => {
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
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Bienvenido, <span className="">{userName}</span>
          </h1>
          <p className="text-zinc-500 mt-1 text-[10px] uppercase tracking-widest font-bold">Resumen General de Operaciones</p>
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

      {/* Acciones Rápidas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <button 
          onClick={() => {
            if (setActiveTab) setActiveTab('tournaments');
            if (setOpenCreateModal) setOpenCreateModal('tournament');
          }}
          className={`group relative overflow-hidden rounded-[2rem] p-4 flex items-center justify-start gap-4 transition-all duration-500 border hover:-translate-y-1 ${
            darkMode 
              ? 'bg-zinc-900/50 hover:bg-zinc-800 border-white/5 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
              : 'bg-white hover:bg-zinc-50 border-black/5 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10'
          }`}
        >
          <div className={`p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-500 ${
            darkMode ? 'bg-white/5' : 'bg-emerald-500/10'
          }`}>
            <Trophy className={`w-5 h-5 transition-colors duration-500 ${
              darkMode ? 'text-zinc-400 group-hover:text-white' : 'text-emerald-600 group-hover:text-white'
            }`} />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-500 ${
              darkMode ? 'text-zinc-300 group-hover:text-white' : 'text-zinc-700 group-hover:text-emerald-700'
            }`}>Nuevo Torneo</span>
            <span className={`text-[10px] tracking-widest font-bold uppercase transition-colors duration-500 ${darkMode ? 'text-zinc-600 group-hover:text-emerald-400' : 'text-zinc-400 group-hover:text-emerald-600'}`}>Crear nuevo torneo</span>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab && setActiveTab('quick-assign')}
          className={`group relative overflow-hidden rounded-[2rem] p-4 flex items-center justify-start gap-4 transition-all duration-500 border hover:-translate-y-1 ${
            darkMode 
              ? 'bg-zinc-900/50 hover:bg-zinc-800 border-white/5 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
              : 'bg-white hover:bg-zinc-50 border-black/5 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10'
          }`}
        >
          <div className={`p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-500 ${
            darkMode ? 'bg-white/5' : 'bg-blue-500/10'
          }`}>
            <Camera className={`w-5 h-5 transition-colors duration-500 ${
              darkMode ? 'text-zinc-400 group-hover:text-white' : 'text-blue-600 group-hover:text-white'
            }`} />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-500 ${
              darkMode ? 'text-zinc-300 group-hover:text-white' : 'text-zinc-700 group-hover:text-blue-700'
            }`}>Asignación Rápida</span>
            <span className={`text-[10px] tracking-widest font-bold uppercase transition-colors duration-500 ${darkMode ? 'text-zinc-600 group-hover:text-blue-400' : 'text-zinc-400 group-hover:text-blue-600'}`}>Asigna rapidamente camaras </span>
          </div>
        </button>

        <button 
          onClick={() => {
            if (setActiveTab) setActiveTab('logistics');
            if (setOpenCreateModal) setOpenCreateModal('shipment');
          }}
          className={`group relative overflow-hidden rounded-[2rem] p-4 flex items-center justify-start gap-4 transition-all duration-500 border hover:-translate-y-1 ${
            darkMode 
              ? 'bg-zinc-900/50 hover:bg-zinc-800 border-white/5 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]' 
              : 'bg-white hover:bg-zinc-50 border-black/5 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10'
          }`}
        >
          <div className={`p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-purple-500 ${
            darkMode ? 'bg-white/5' : 'bg-purple-500/10'
          }`}>
            <Truck className={`w-5 h-5 transition-colors duration-500 ${
              darkMode ? 'text-zinc-400 group-hover:text-white' : 'text-purple-600 group-hover:text-white'
            }`} />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-500 ${
              darkMode ? 'text-zinc-300 group-hover:text-white' : 'text-zinc-700 group-hover:text-purple-700'
            }`}>Nuevo Envío</span>
            <span className={`text-[10px] tracking-widest font-bold uppercase transition-colors duration-500 ${darkMode ? 'text-zinc-600 group-hover:text-purple-400' : 'text-zinc-400 group-hover:text-purple-600'}`}>Crear nuevo envío</span>
          </div>
        </button>
      </section>

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
              <div className="h-[600px] w-full bg-zinc-950 animate-pulse rounded-[2rem] flex items-center justify-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 mix-blend-screen"></div>
                <div className="flex flex-col items-center gap-4 relative z-10">
                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                  <div className="text-zinc-400 text-sm font-bold tracking-widest uppercase">Cargando Mapa de Operaciones...</div>
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
                  darkMode={darkMode}
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


