import React, { useState, useEffect, Suspense } from "react";
import { ArrowLeft, MapPin, ZoomIn, ZoomOut } from "lucide-react";
import { apiService } from "../../../services/api";
import Timeline from "./Timeline";
import EventModal from "./EventModal";
import HistoryPanel from "./HistoryPanel";

const CameraInspector = ({ cameraId, onBack, darkMode = true }) => {
  const [camera, setCamera] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cameraRes, historyRes] = await Promise.all([
          apiService.getCamera(cameraId),
          apiService.getCameraHistoryById(cameraId),
        ]);

        setCamera(cameraRes);
        setHistory(
          historyRes.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } catch (error) {
        console.error("Error loading camera inspector data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cameraId]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen transition-colors duration-500 ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
        <div className={`text-xl flex items-center space-x-3 transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="font-bold tracking-widest uppercase text-sm">Cargando Inspector...</span>
        </div>
      </div>
    );
  }

  if (!camera) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen gap-4 transition-colors duration-500 ${darkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
        <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Cámara no encontrada</div>
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all border ${
            darkMode 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
              : 'bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a Cámaras</span>
        </button>
      </div>
    );
  }

  const handleDeleteHistoryEntry = async (entryId) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este evento del historial?"
      )
    ) {
      try {
        await apiService.deleteCameraHistory(entryId);
        setHistory((prev) => prev.filter((entry) => entry.id !== entryId));
      } catch (error) {
        console.error("Error deleting history entry:", error);
        alert("Error al eliminar el evento");
      }
    }
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] space-y-8 animate-fade-in`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-3 rounded-2xl border transition-all duration-300 ${
              darkMode 
                ? 'text-zinc-400 hover:text-white hover:bg-white/10 border-white/10' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border-zinc-200 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-xl text-xs font-black font-mono tracking-widest border transition-colors duration-500 ${
                darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-500 text-white border-emerald-600'
              }`}>
                {camera.id}
              </span>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {camera.model}
              </h1>
            </div>
            <p className="text-zinc-500 text-sm mt-1 font-medium italic">
              Inspector de Cámara ⬢ <span className="text-emerald-500">Historial Completo</span>
            </p>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className={`flex items-center gap-4 border rounded-[2rem] px-6 py-3 transition-colors duration-500 ${
          darkMode ? 'bg-zinc-900 border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-lg shadow-zinc-200/50'
        }`}>
          <ZoomOut className="w-4 h-4 text-zinc-500" />
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
            className="w-24 md:w-32 lg:w-48 h-1.5 bg-emerald-500/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <ZoomIn className="w-4 h-4 text-zinc-500" />
          <div className={`text-[10px] font-black w-12 text-center px-2 py-1.5 rounded-lg border transition-colors duration-500 ${
            darkMode ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-600'
          }`}>
            {(zoomLevel * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <Timeline
            events={history}
            onEventClick={setSelectedEvent}
            onEventDelete={handleDeleteHistoryEntry}
            zoomLevel={zoomLevel}
            darkMode={darkMode}
          />
        </div>

        <div className="lg:col-span-1 order-1 lg:order-2">
          <HistoryPanel 
            camera={camera} 
            history={history} 
            onBack={onBack} 
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Modals and Forms */}
      <Suspense fallback={null}>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            darkMode={darkMode}
          />
        )}
      </Suspense>
    </div>
  );
};

export default CameraInspector;
