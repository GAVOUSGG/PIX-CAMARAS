import React from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Clock, MapPin, User, Package } from "lucide-react";

const EventModal = ({ event, onClose, darkMode = true }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      shipment: "Envío Logístico",
      tournament: "Torneo Activo",
      return: "Devolución",
      maintenance: "Mantenimiento",
    };
    return labels[type] || type;
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "shipment":
        return "border-l-blue-500 shadow-blue-500/20";
      case "tournament":
        return "border-l-purple-500 shadow-purple-500/20";
      case "return":
        return "border-l-orange-500 shadow-orange-500/20";
      case "maintenance":
        return "border-l-zinc-400 shadow-zinc-400/20";
      default:
        return "border-l-emerald-500 shadow-emerald-500/20";
    }
  };

  const renderDetailItem = (icon, label, value, key) => (
    <div key={key} className={`flex items-start gap-4 py-4 border-b transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-zinc-100'} last:border-b-0`}>
      <div className={`flex-shrink-0 mt-1 transition-colors duration-500 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</div>
        <div className={`text-sm font-bold transition-colors duration-500 ${darkMode ? 'text-white font-mono break-all' : 'text-zinc-900 break-words'}`}>
          {value || "No registrado"}
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      <div
        className={`relative w-full max-w-2xl rounded-[2.5rem] border shadow-2xl transition-all duration-500 overflow-hidden border-l-8 ${getBorderColor(
          event.type
        )} ${darkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'}`}
      >
        {/* Header */}
        <div className={`p-8 border-b transition-colors duration-500 ${darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-zinc-50 bg-zinc-50/50'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors duration-500 ${
                  darkMode ? 'bg-white/5 border-white/10 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-500'
                }`}>
                  {getTypeLabel(event.type)}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2`}>
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(event.date)}
                </span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-black tracking-tight leading-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {event.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                darkMode ? 'hover:bg-white/5 text-zinc-500 hover:text-white' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
          {event.details && Object.keys(event.details).length > 0 ? (
            <div className="space-y-1">
              {Object.entries(event.details).map(([key, value]) =>
                renderDetailItem(
                  <Clock className="w-4 h-4" />,
                  key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase()),
                  typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : String(value),
                  key
                )
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package className={`w-16 h-16 mx-auto mb-6 opacity-20 ${darkMode ? 'text-white' : 'text-zinc-900'}`} />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Sin detalles maestros asociados</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t transition-colors duration-500 ${darkMode ? 'border-white/5 bg-white/[0.01]' : 'border-zinc-50 bg-zinc-50/20'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black font-mono uppercase tracking-tighter ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
              LOG_HASH: {event.id}
            </span>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
            >
              Cerrar Expediente
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EventModal;
