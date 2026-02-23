import React, { Suspense, useState, useEffect } from "react";
import { useAppState } from "./hooks/useAppState";
import Layout from "./components/Layout/Layout";
import CameraInspector from "./components/Cameras/Inspector/CameraInspector";
import TournamentModal from "./components/Tournaments/TournamentModal";

// Lazy loading de páginas
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Tournaments = React.lazy(() => import("./pages/Tournaments"));
const Workers = React.lazy(() => import("./pages/Workers"));
const Cameras = React.lazy(() => import("./pages/Cameras"));
const QuickAssign = React.lazy(() => import("./pages/QuickAssign"));
const Logistics = React.lazy(() => import("./pages/Logistics"));
const Map = React.lazy(() => import("./pages/Map"));
const Statistics = React.lazy(() => import("./pages/Statistics"));
const CameraHistory = React.lazy(() => import("./pages/CameraHistory"));
const AdminPanel = React.lazy(() => import("./components/Admin/AdminPanel"));

const MainApp = ({ user, onLogout }) => {
  const [inspectorCameraId, setInspectorCameraId] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
    createCameraHistoryEntry,
    
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
          darkMode={darkMode}
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
            darkMode={darkMode}
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
            darkMode={darkMode}
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
            darkMode={darkMode}
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
            darkMode={darkMode}
          />
        );
      case "quick-assign":
        return (
          <QuickAssign
            camerasData={camerasData}
            workersData={workersData}
            onUpdateCamera={updateCamera}
            onCreateCameraHistoryEntry={createCameraHistoryEntry}
            darkMode={darkMode}
          />
        );
      case "history":
        return <CameraHistory darkMode={darkMode} />;
      case "logistics":
        return (
          <Logistics
            shipmentsData={shipmentsData}
            camerasData={camerasData}
            workersData={workersData}
            onCreateShipment={createShipment}
            onUpdateShipment={updateShipment}
            onDeleteShipment={deleteShipment}
            darkMode={darkMode}
          />
        );
      case "map":
        return (
          <Map
            tournamentsData={tournamentsData}
            workersData={workersData}
            camerasData={camerasData}
            shipmentsData={shipmentsData}
            darkMode={darkMode}
          />
        );
      case "statistics":
        return (
          <Statistics 
            tournamentsData={tournamentsData} 
            camerasData={camerasData}
            workersData={workersData}
            shipmentsData={shipmentsData}
            darkMode={darkMode}
          />
        );
      case "admin":
        return user.role === 'admin' ? <AdminPanel darkMode={darkMode} /> : <Dashboard darkMode={darkMode} />;
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
            darkMode={darkMode}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className={`text-xl font-bold tracking-widest animate-pulse ${darkMode ? 'text-white' : 'text-slate-900'}`}>Cargando PixGolf...</div>
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
        darkMode={darkMode}
        setDarkMode={setDarkMode}
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
          darkMode={darkMode}
        />
      )}
    </>
  );
};

export default MainApp;
