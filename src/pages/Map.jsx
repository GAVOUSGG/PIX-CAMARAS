import React from 'react';
import MexicoMap from '../components/Map/MexicoMap';

const Map = ({ tournamentsData, workersData, camerasData, shipmentsData }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Mapa de Operaciones - Toda la República</h2>
        <div className="text-sm text-gray-400">
          Vista completa de torneos, trabajadores y cámaras por estado
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

export default Map;