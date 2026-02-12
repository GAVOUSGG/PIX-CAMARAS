import React, { Suspense, useState } from "react";
import { useAppState } from "./hooks/useAppState";
import Layout from "./components/Layout/Layout";
import CameraInspector from "./components/Cameras/Inspector/CameraInspector";
import TournamentModal from "./components/Tournaments/TournamentModal";

// Lazy loading de páginas
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Tournaments = React.lazy(() => import("./pages/Tournaments"));
const Workers = React.lazy(() => import("./pages/Workers"));
const Cameras = React.lazy(() => import("./pages/Cameras"));
const Logistics = React.lazy(() => import("./pages/Logistics"));
const Map = React.lazy(() => import("./pages/Map"));
const Statistics = React.lazy(() => import("./pages/Statistics"));
const CameraHistory = React.lazy(() => import("./pages/CameraHistory"));
const AdminPanel = React.lazy(() => import("./components/Admin/AdminPanel"));

const MainApp = ({ user, onLogout }) => {
  const [inspectorCameraId, setInspectorCameraId] = useState(null);

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
    try {
      const newShipment = await createShipmentFromTask(
        taskWithSelection,
        taskWithSelection.selectedCameras
      );
      alert(`Envío creado exitosamente!`);
      setActiveTab("logistics");
    } catch (error) {
      alert("Error al crear el envío. Por favor intenta nuevamente.");
    }
  };

  const renderContent = () => {
    // Si está en modo inspector, mostrar el inspector
    if (inspectorCameraId) {
      return (
        <CameraInspector 
          cameraId={inspectorCameraId} 
          onBack={() => setInspectorCameraId(null)}
        />
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            tournamentsData={tournamentsData}
            camerasData={camerasData}
            workersData={workersData}
            shipmentsData={shipmentsData}
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
            camerasData={camerasData}
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
            onInspectCamera={setInspectorCameraId}
          />
        );
      case "history":
        return <CameraHistory />;
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
            shipmentsData={shipmentsData}
          />
        );
      case "statistics":
        return (
          <Statistics 
            tournamentsData={tournamentsData} 
            camerasData={camerasData}
            workersData={workersData}
            shipmentsData={shipmentsData}
          />
        );
      case "admin":
        return user.role === 'admin' ? <AdminPanel /> : <Dashboard />;
      default:
        return (
          <Dashboard
            tournamentsData={tournamentsData}
            camerasData={camerasData}
            workersData={workersData}
            shipmentsData={shipmentsData}
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
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        onLogout={onLogout}
      >
        {!apiAvailable && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg mb-4 mx-6 flex items-center space-x-2">
            <span>Modo sin conexión - Los datos se guardan localmente</span>
          </div>
        )}
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          }
        >
          {renderContent()}
        </Suspense>
      </Layout>

      {selectedTournament && (
        <TournamentModal
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
        />
      )}
    </>
  );
};

export default MainApp;
