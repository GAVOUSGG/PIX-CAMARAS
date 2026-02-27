import React, { useMemo } from "react";
import {
  MapPin,
  User,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Shield,
} from "lucide-react";

const HistoryPanel = ({ camera, history, onBack, darkMode = true }) => {
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
        return "bg-emerald-500 shadow-emerald-500/20";
      case "en envio":
        return "bg-blue-500 shadow-blue-500/20";
      case "en uso":
        return "bg-purple-500 shadow-purple-500/20";
      case "mantenimiento":
        return "bg-amber-500 shadow-amber-500/20";
      default:
        return "bg-zinc-500 shadow-zinc-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-right">
      {/* Camera Status Card */}
      <div className={`rounded-3xl border p-6 transition-all duration-500 ${
        darkMode ? 'bg-zinc-900 border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-zinc-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-xl transition-colors duration-500 ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
            <Shield className="w-4 h-4" />
          </div>
          <h3 className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Estado Maestro</h3>
        </div>

        <div className="space-y-4">
          {/* Status */}
          <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
            darkMode ? 'bg-white/5 border-white/5' : 'bg-zinc-50 border-zinc-100'
          }`}>
            <div className={`w-3.5 h-3.5 rounded-full shadow-lg ${getStatusColor(camera.status)}`} />
            <div>
              <div className={`text-sm font-black uppercase tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {camera.status}
              </div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nivel de Disponibilidad</div>
            </div>
          </div>

          {/* Location */}
          {camera.location && (
            <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-zinc-50 border-zinc-100'
            }`}>
              <MapPin className={`w-4 h-4 flex-shrink-0 transition-colors duration-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className="min-w-0">
                <div className={`text-sm font-bold truncate transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{camera.location}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ubicación Registrada</div>
              </div>
            </div>
          )}

          {/* Assigned To */}
          {camera.assignedTo && (
            <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-zinc-50 border-zinc-100'
            }`}>
              <User className={`w-4 h-4 flex-shrink-0 transition-colors duration-500 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <div className="min-w-0">
                <div className={`text-sm font-bold truncate transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{camera.assignedTo}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Responsable Actual</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className={`rounded-3xl border p-6 transition-all duration-500 ${
        darkMode ? 'bg-zinc-900 border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-zinc-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-xl transition-colors duration-500 ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Métricas Clave</h3>
        </div>

        <div className="space-y-2">
          {[
            { label: 'Eventos Totales', value: stats.totalEvents, color: 'emerald' },
            { label: 'Envíos Logísticos', value: stats.shipments, color: 'blue' },
            { label: 'Torneos Activos', value: stats.tournaments, color: 'purple' },
            { label: 'Entregas Hechas', value: stats.returns, color: 'orange' },
            { label: 'Intervenciones', value: stats.maintenance, color: 'slate' }
          ].map((stat, i) => (
            <div 
              key={i}
              className={`flex justify-between items-center p-3 rounded-xl transition-all duration-300 ${
                darkMode ? 'hover:bg-white/5' : 'hover:bg-zinc-50'
              }`}
            >
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">{stat.label}</span>
              <span className={`text-sm font-black transition-colors duration-500 text-${stat.color}-500`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Last Event */}
      {stats.lastEvent && (
        <div className={`rounded-3xl border p-6 transition-all duration-500 ${
          darkMode ? 'bg-zinc-900 border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-zinc-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl transition-colors duration-500 ${darkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>�altima Actividad</h3>
          </div>
          <div className="space-y-3">
            <p className={`text-sm font-black transition-colors duration-500 line-clamp-2 leading-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              {stats.lastEvent.title}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                {formatDate(stats.lastEvent.date)}
              </p>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-colors duration-500 ${
                darkMode ? 'bg-white/10 border-white/10 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'
              }`}>
                {stats.lastEvent.type}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <button
        onClick={onBack}
        className={`w-full group px-6 py-4 rounded-2xl border font-black uppercase tracking-widest text-xs transition-all duration-300 flex items-center justify-center gap-3 ${
          darkMode 
            ? 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white' 
            : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 hover:shadow-lg hover:shadow-zinc-200'
        }`}
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-tranzinc-x-1" />
        Regresar al Listado
      </button>
    </div>
  );
};

export default HistoryPanel;
