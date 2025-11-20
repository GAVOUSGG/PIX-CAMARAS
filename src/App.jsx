import React from "react";
import { useAppState } from "./hooks/useAppState";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Tournaments from "./pages/Tournaments";
import Workers from "./pages/Workers";
import Cameras from "./pages/Cameras";
import Logistics from "./pages/Logistics";
import Map from "./pages/Map";
import TournamentModal from "./components/Tournaments/TournamentModal";

function App() {
  const {
    activeTab,
    setActiveTab,
    selectedTournament,
    setSelectedTournament,
    tournamentsData,
    workersData,
    camerasData,
    shipmentsData,
    tasksData,
    loading,
    apiAvailable,
    createTournament,
    updateTournament,
    deleteTournament,
    createWorker,
    updateWorker,
    deleteWorker,
    createCamera,
    deleteCamera,
    updateCamera,
    completeTask,
    createShipmentFromTask,
    
    createShipment,
    updateShipment,
    deleteShipment,
    setTournamentsData,
    setWorkersData,
    setCamerasData,
    setShipmentsData,
  } = useAppState();

  // Función para manejar el envío de cámaras
  const handleShipCameras = async (taskWithSelection) => {
    console.log("🚀 Iniciando envío de cámaras:", taskWithSelection);
    try {
      const newShipment = await createShipmentFromTask(
        taskWithSelection,
        taskWithSelection.selectedCameras
      );
      console.log("📦 Envío creado exitosamente:", newShipment);
      alert(`✅ Envío creado exitosamente!`);
      setActiveTab("logistics");
    } catch (error) {
      console.error("❌ Error creando envío:", error);
      alert("Error al crear el envío. Por favor intenta nuevamente.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            tournamentsData={tournamentsData}
            camerasData={camerasData}
            workersData={workersData}
            tasksData={tasksData}
            onCompleteTask={completeTask}
            onShipCameras={handleShipCameras}
          />
        );
      case "tournaments":
        return (
          <Tournaments
            tournamentsData={tournamentsData}
            workersData={workersData}
            camerasData={camerasData}
            onCreateTournament={createTournament}
            onUpdateTournament={updateTournament}
            onDeleteTournament={deleteTournament}
            onSetSelectedTournament={setSelectedTournament}
          />
        );
      case "workers":
        return (
          <Workers
            workersData={workersData}
            onCreateWorker={createWorker}
            onUpdateWorker={updateWorker}
            onDeleteWorker={deleteWorker}
          />
        );
      case "cameras":
        return (
          <Cameras
            camerasData={camerasData}
            workersData={workersData}
            onCreateCamera={createCamera}
            onUpdateCamera={updateCamera}
            onDeleteCamera={deleteCamera}
          />
        );
      case "logistics":
        return (
          <Logistics
            shipmentsData={shipmentsData}
            camerasData={camerasData}
            workersData={workersData}
            onCreateShipment={createShipment}
            onUpdateShipment={updateShipment}
            onDeleteShipment={deleteShipment}
          />
        );
      case "map":
        return (
          <Map
            tournamentsData={tournamentsData}
            workersData={workersData}
            camerasData={camerasData}
          />
        );
      default:
        return (
          <Dashboard
            tournamentsData={tournamentsData}
            camerasData={camerasData}
            workersData={workersData}
            tasksData={tasksData}
            onCompleteTask={completeTask}
            onShipCameras={handleShipCameras}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando PixGolf...</div>
      </div>
    );
  }

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {!apiAvailable && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg mb-4 mx-6 flex items-center space-x-2">
            <span>⚠️</span>
            <span>Modo sin conexión - Los datos se guardan localmente</span>
          </div>
        )}
        {renderContent()}
      </Layout>

      {selectedTournament && (
        <TournamentModal
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
        />
      )}
    </>
  );
}

export default App;
