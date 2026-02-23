import React, { useState, useEffect, Suspense } from "react";
import { Camera, History, ArrowLeft, Search, Filter } from "lucide-react";
import { apiService } from "../services/api";
import EventModal from "../components/Cameras/Inspector/EventModal";
import Timeline from "../components/Cameras/Inspector/Timeline";

const CameraHistory = ({ darkMode = true }) => {
  const [allHistory, setAllHistory] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterCamera, setFilterCamera] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [historyRes, camerasRes] = await Promise.all([
          apiService.getCameraHistory(),
          apiService.getCameras(),
        ]);

        setAllHistory(
          historyRes.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
        setCameras(camerasRes);
      } catch (error) {
        console.error("Error loading camera history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDeleteHistoryEntry = async (entryId) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este evento del historial?"
      )
    ) {
      try {
        await apiService.deleteCameraHistory(entryId);
        setAllHistory((prev) => prev.filter((entry) => entry.id !== entryId));
      } catch (error) {
        console.error("Error deleting history entry:", error);
        alert("Error al eliminar el evento");
      }
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-12 transition-colors duration-500 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className={`text-xl flex items-center space-x-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="font-bold tracking-widest uppercase text-sm">Cargando Historial...</span>
        </div>
      </div>
    );
  }

  const eventStats = {
    total: allHistory.length,
    shipments: allHistory.filter((e) => e.type === "shipment").length,
    tournaments: allHistory.filter((e) => e.type === "tournament").length,
    returns: allHistory.filter((e) => e.type === "return").length,
    maintenance: allHistory.filter((e) => e.type === "maintenance").length,
  };

  const filteredEvents = allHistory.filter((event) => {
    const matchesType = filterType === "all" || event.type === filterType;
    const matchesCamera =
      filterCamera === "all" || event.cameraId === filterCamera;
    
    if (!matchesType || !matchesCamera) return false;
    if (searchTerm === "") return true;

    const term = searchTerm.toLowerCase();
    const searchableValues = [
      event.title,
      event.cameraId,
      event.type,
      event.details?.destination,
      event.details?.recipient,
      event.details?.trackingNumber
    ]
      .filter(Boolean)
      .map(v => String(v).toLowerCase());

    return searchableValues.some(val => val.includes(term));
  });

  const filterOptions = [
    { value: "all", label: "Todos", count: eventStats.total, color: "emerald" },
    { value: "shipment", label: "Envíos", count: eventStats.shipments, color: "blue" },
    { value: "tournament", label: "Torneos", count: eventStats.tournaments, color: "purple" },
    { value: "return", label: "Entregas", count: eventStats.returns, color: "orange" },
    { value: "maintenance", label: "Mantenimiento", count: eventStats.maintenance, color: "gray" },
  ];

  return (
    <div className={`space-y-6 animate-fade-in`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl border transition-all duration-500 ${darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-500 border-emerald-600 shadow-lg shadow-emerald-500/20'}`}>
            <History className={`w-8 h-8 ${darkMode ? 'text-emerald-400' : 'text-white'}`} />
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Historial de Cámaras
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Registro completo de todas las camaras
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`rounded-2xl border p-6 transition-all duration-500 ${
        darkMode ? 'bg-slate-900/50 border-white/5 shadow-2xl backdrop-blur-lg' : 'bg-white border-black/5 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-500'}`} />
            <input
              type="text"
              placeholder="Buscar por evento o ID de cámara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 pl-10 transition-all duration-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 group-hover:bg-white/10' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 group-hover:bg-slate-100'
              }`}
            />
          </div>

          <select
            value={filterCamera}
            onChange={(e) => setFilterCamera(e.target.value)}
            className={`px-4 py-2.5 border rounded-xl text-sm appearance-none outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500/50 ${
              darkMode 
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
            }`}
          >
            <option className={darkMode ? "bg-slate-900" : "bg-white"} value="all">Todas las cámaras</option>
            {cameras.map((camera) => (
              <option className={darkMode ? "bg-slate-900" : "bg-white"} key={camera.id} value={camera.id}>
                {camera.id} - {camera.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline or Empty State */}
      {filterCamera === "all" ? (
        <div className={` border transition-all duration-500 overflow-hidden relative min-h-[600px] flex items-center justify-center ${
          darkMode ? 'bg-slate-900/30 border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-slate-200'
        }`}>
          <div className="text-center p-8 max-w-lg mx-auto">
            
            <h2 className={`text-4xl font-black tracking-tight mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Selector
            </h2>
            <p className={`text-lg font-medium tracking-tight mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Para visualizar el historial de una camara, por favor selecciona una camara en el menu superior.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[800px]">
          <Timeline
            events={filteredEvents}
            onEventClick={setSelectedEvent}
            onEventDelete={handleDeleteHistoryEntry}
            zoomLevel={1}
            darkMode={darkMode}
          />
        </div>
      )}

      {/* Event Modal */}
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

export default CameraHistory;
