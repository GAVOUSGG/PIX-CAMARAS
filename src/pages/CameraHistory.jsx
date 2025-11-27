import React, { useState, useEffect } from "react";
import { Camera, History, ArrowLeft, Search, Filter } from "lucide-react";
import { apiService } from "../services/api";
import EventCard from "../components/Cameras/Inspector/EventCard";
import EventModal from "../components/Cameras/Inspector/EventModal";

const CameraHistory = () => {
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-xl flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
          <span>Cargando Historial...</span>
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
    const matchesSearch =
      searchTerm === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.cameraId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCamera && matchesSearch;
  });

  const filterOptions = [
    { value: "all", label: "Todos", count: eventStats.total, color: "emerald" },
    {
      value: "shipment",
      label: "Envíos",
      count: eventStats.shipments,
      color: "blue",
    },
    {
      value: "tournament",
      label: "Torneos",
      count: eventStats.tournaments,
      color: "purple",
    },
    {
      value: "return",
      label: "Entregas",
      count: eventStats.returns,
      color: "orange",
    },
    {
      value: "maintenance",
      label: "Mantenimiento",
      count: eventStats.maintenance,
      color: "gray",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
            <History className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Historial de Cámaras
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Registro completo de todos los eventos de las cámaras
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por evento o ID de cámara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all w-full"
            />
          </div>

          {/* Camera Filter */}
          <select
            value={filterCamera}
            onChange={(e) => setFilterCamera(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
          >
            <option value="all">Todas las cámaras</option>
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.id} - {camera.model}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterType(option.value)}
              disabled={option.count === 0}
              className={`
                px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border
                ${
                  filterType === option.value
                    ? `bg-${option.color}-500/20 border-${option.color}-500/50 text-${option.color}-300 shadow-lg shadow-${option.color}-500/20`
                    : option.count > 0
                    ? "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                    : "bg-white/5 border-white/10 text-gray-600 cursor-not-allowed opacity-50"
                }
              `}
            >
              <span>{option.label}</span>
              <span className="ml-2 text-xs opacity-75">({option.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl border border-emerald-500/20">
          <div className="text-3xl font-bold text-emerald-400 mb-1">
            {eventStats.total}
          </div>
          <div className="text-xs text-emerald-400/70 font-medium">
            Total de Eventos
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl border border-blue-500/20">
          <div className="text-3xl font-bold text-blue-400 mb-1">
            {eventStats.shipments}
          </div>
          <div className="text-xs text-blue-400/70 font-medium">Envíos</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/20">
          <div className="text-3xl font-bold text-purple-400 mb-1">
            {eventStats.tournaments}
          </div>
          <div className="text-xs text-purple-400/70 font-medium">Torneos</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-2xl border border-orange-500/20">
          <div className="text-3xl font-bold text-orange-400 mb-1">
            {eventStats.returns}
          </div>
          <div className="text-xs text-orange-400/70 font-medium">Entregas</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-gray-500/10 to-gray-500/5 rounded-2xl border border-gray-500/20">
          <div className="text-3xl font-bold text-gray-400 mb-1">
            {eventStats.maintenance}
          </div>
          <div className="text-xs text-gray-400/70 font-medium">
            Mantenimiento
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p className="text-gray-400 text-lg">
              No se encontraron eventos con estos filtros
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 opacity-20"></div>

            {/* Events */}
            <div className="space-y-6">
              {filteredEvents.map((event, index) => {
                const camera = cameras.find((c) => c.id === event.cameraId);
                return (
                  <div key={event.id} className="relative pl-20">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-6 flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <span className="text-lg font-bold text-emerald-400">
                            {filteredEvents.length - index}
                          </span>
                        </div>
                        <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur-md -z-10"></div>
                      </div>
                    </div>

                    {/* Event Card with Camera Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Camera className="w-4 h-4" />
                        <span className="font-mono text-emerald-400">
                          {event.cameraId}
                        </span>
                        {camera && (
                          <span className="text-gray-500">
                            • {camera.model}
                          </span>
                        )}
                      </div>
                      <EventCard
                        event={event}
                        onClick={() => setSelectedEvent(event)}
                        onDelete={() => handleDeleteHistoryEntry(event.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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

export default CameraHistory;
