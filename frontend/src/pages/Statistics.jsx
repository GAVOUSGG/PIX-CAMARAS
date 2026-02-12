import React, { Suspense } from 'react';
const StatisticsSection = React.lazy(() => import('../components/Dashboard/StatisticsSection'));

const StatisticsPage = ({ 
  tournamentsData, 
  camerasData, 
  workersData, 
  shipmentsData 
}) => {
  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Análisis y <span className="text-emerald-400">Estadísticas</span>
          </h1>
          <p className="text-gray-400 mt-1">Métricas detalladas del rendimiento y cobertura de torneos</p>
        </div>
      </header>

      <div className="pt-4 border-t border-white/5">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[400px] glass-card animate-pulse rounded-[2rem]"></div>
            <div className="h-[400px] glass-card animate-pulse rounded-[2rem]"></div>
          </div>
        }>
          <StatisticsSection 
            tournaments={tournamentsData} 
            cameras={camerasData}
            workers={workersData}
            shipments={shipmentsData}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default StatisticsPage;
