import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, ZoomIn, ZoomOut } from "lucide-react";
import { apiService } from "../../../services/api";
import Timeline from "./Timeline";
import EventModal from "./EventModal";
import HistoryPanel from "./HistoryPanel";

const CameraInspector = ({ cameraId, onBack }) => {
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-xl flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
          <span>Cargando Inspector de Cámara...</span>
        </div>
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 gap-4">
        <div className="text-white text-xl">Cámara no encontrada</div>
        <button
          onClick={onBack}
          className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 border border-white/10"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-sm font-mono">
                {camera.id}
              </span>
              <span>{camera.model}</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Inspector de Cámara - Historial Completo
            </p>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-xl px-4 py-2">
          <ZoomOut className="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
            className="w-24 accent-emerald-500"
          />
          <ZoomIn className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm w-12 text-center bg-white/5 px-2 py-1 rounded">
            {(zoomLevel * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Timeline Section */}
        <div className="lg:col-span-3">
          <Timeline
            events={history}
            onEventClick={setSelectedEvent}
            onEventDelete={handleDeleteHistoryEntry}
            zoomLevel={zoomLevel}
          />
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-1">
          <HistoryPanel camera={camera} history={history} onBack={onBack} />
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default CameraInspector;
