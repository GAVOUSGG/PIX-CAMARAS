import React from "react";
import StatsGrid from "../components/Dashboard/StatsGrid";
import StatisticsSection from "../components/Dashboard/StatisticsSection";
import ActiveTournaments from "../components/Dashboard/ActiveTournaments";
import LogisticsSummary from "../components/Dashboard/LogisticsSummary";
import UpcomingTournaments from "../components/Dashboard/UpcomingTournaments";
import MexicoMap from "../components/Map/MexicoMap";

const Dashboard = ({ tournamentsData, camerasData, workersData, shipmentsData }) => {
  const userName = JSON.parse(localStorage.getItem('user'))?.name || 'Administrador';
  const currentDate = new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
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
            {tournamentsData?.filter(t => t.status === 'activo').length || 0} Torneos hoy
          </div>
        </div>
      </header>

      {/* 1. KPIs Principales */}
      <section>
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
          <section className="glass-card rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
              <h3 className="text-lg font-semibold text-white">Cobertura Nacional</h3>
              <span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">En Vivo</span>
            </div>
            <div className="p-2">
              <MexicoMap
                tournaments={tournamentsData}
                workers={workersData}
                cameras={camerasData}
                shipments={shipmentsData}
              />
            </div>
          </section>

          {/* Torneos Próximos (Semana) */}
          <section>
            <UpcomingTournaments tournaments={tournamentsData} />
          </section>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Logística (Compacta) */}
          <section>
            <LogisticsSummary shipments={shipmentsData} />
          </section>

          {/* Torneos Activos */}
          <section>
            <ActiveTournaments tournaments={tournamentsData} />
          </section>
        </div>
      </div>

      {/* 3. Análisis y Estadísticas */}
      <section className="pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          <h3 className="text-2xl font-bold text-white">Análisis de Operaciones</h3>
        </div>
        <StatisticsSection tournaments={tournamentsData} />
      </section>
    </div>
  );
};


export default Dashboard;

