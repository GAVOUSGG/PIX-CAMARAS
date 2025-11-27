import React, { useMemo } from "react";
import {
  MapPin,
  User,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Shield,
} from "lucide-react";

const HistoryPanel = ({ camera, history, onBack }) => {
  const stats = useMemo(() => {
    return {
      totalEvents: history.length,
      shipments: history.filter((e) => e.type === "shipment").length,
      tournaments: history.filter((e) => e.type === "tournament").length,
      returns: history.filter((e) => e.type === "return").length,
      maintenance: history.filter((e) => e.type === "maintenance").length,
      lastEvent: history[0] || null,
    };
  }, [history]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Hoy";
      if (diffDays === 1) return "Ayer";
      if (diffDays < 7) return `Hace ${diffDays} días`;
      return date.toLocaleDateString("es-ES", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "disponible":
        return "bg-green-500";
      case "en envio":
        return "bg-blue-500";
      case "en uso":
        return "bg-purple-500";
      case "mantenimiento":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {/* Camera Status Card */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-gray-400">Estado Actual</h3>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-lg">
          <div
            className={`w-3 h-3 rounded-full ${getStatusColor(camera.status)}`}
          />
          <div>
            <div className="text-white font-medium capitalize">
              {camera.status}
            </div>
            <div className="text-xs text-gray-400">Estado actual</div>
          </div>
        </div>

        {/* Location */}
        {camera.location && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg mb-2">
            <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-white text-sm truncate">
                {camera.location}
              </div>
              <div className="text-xs text-gray-400">Ubicación</div>
            </div>
          </div>
        )}

        {/* Assigned To */}
        {camera.assignedTo && (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <User className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-white text-sm truncate">
                {camera.assignedTo}
              </div>
              <div className="text-xs text-gray-400">Asignada a</div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-400">Estadísticas</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors">
            <span className="text-gray-400 text-sm">Total eventos</span>
            <span className="text-white font-bold">{stats.totalEvents}</span>
          </div>
          <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors">
            <span className="text-gray-400 text-sm">Envíos</span>
            <span className="text-blue-400 font-bold">{stats.shipments}</span>
          </div>
          <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors">
            <span className="text-gray-400 text-sm">Torneos</span>
            <span className="text-purple-400 font-bold">
              {stats.tournaments}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors">
            <span className="text-gray-400 text-sm">Entregas</span>
            <span className="text-orange-400 font-bold">{stats.returns}</span>
          </div>
          <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors">
            <span className="text-gray-400 text-sm">Mantenimiento</span>
            <span className="text-gray-400 font-bold">{stats.maintenance}</span>
          </div>
        </div>
      </div>

      {/* Last Event */}
      {stats.lastEvent && (
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold text-gray-400">
              Último Evento
            </h3>
          </div>
          <div className="space-y-2">
            <p className="text-white text-sm font-medium line-clamp-2">
              {stats.lastEvent.title}
            </p>
            <p className="text-gray-400 text-xs">
              {formatDate(stats.lastEvent.date)}
            </p>
            <span className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-gray-400 capitalize">
              {stats.lastEvent.type}
            </span>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white px-4 py-3 rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Cámaras
      </button>
    </div>
  );
};

export default HistoryPanel;
