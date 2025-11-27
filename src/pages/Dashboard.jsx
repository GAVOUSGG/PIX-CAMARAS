import React from "react";
import StatsGrid from "../components/Dashboard/StatsGrid";
import ActiveTournaments from "../components/Dashboard/ActiveTournaments";
import MexicoMap from "../components/Map/MexicoMap";
import TasksList from "../components/Tasks/TasksList";

const Dashboard = ({ tournamentsData, camerasData, workersData, shipmentsData }) => {
  return (
    <div className="space-y-6">
      <StatsGrid
        tournaments={tournamentsData}
        cameras={camerasData}
        workers={workersData}
      />
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveTournaments tournaments={tournamentsData} />

        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Resumen de Cámaras
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-gray-300">En uso</span>
              <span className="text-red-400 font-bold">
                {camerasData.filter((c) => c.status === "en uso").length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-gray-300">Disponibles</span>
              <span className="text-green-400 font-bold">
                {camerasData.filter((c) => c.status === "disponible").length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-gray-300">En mantenimiento</span>
              <span className="text-orange-400 font-bold">
                {camerasData.filter((c) => c.status === "mantenimiento").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <MexicoMap
        tournaments={tournamentsData}
        workers={workersData}
        cameras={camerasData}
        shipments={shipmentsData}
      />
    </div>
  );
};

export default Dashboard;
