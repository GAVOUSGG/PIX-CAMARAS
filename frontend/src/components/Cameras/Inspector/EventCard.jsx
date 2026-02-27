import React from "react";
import {
  Package,
  MapPin,
  Trophy,
  Truck,
  Settings,
  ArrowRight,
  Trash2,
  Calendar,
  Clock,
  User,
} from "lucide-react";

const EventCard = ({ event, onClick, onDelete, darkMode = true }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "shipment":
        return <Truck className="w-5 h-5" />;
      case "tournament":
        return <Trophy className="w-5 h-5" />;
      case "return":
        return <MapPin className="w-5 h-5" />;
      case "maintenance":
        return <Settings className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getTypeConfig = (type) => {
    const isDark = darkMode;
    switch (type) {
      case "shipment":
        return {
          bg: isDark ? ".02]" : "",
          border: isDark ? "border-blue-500/20" : "border-blue-100",
          hoverBorder: isDark ? "hover:border-blue-400" : "hover:border-blue-300",
          text: isDark ? "text-blue-400" : "text-blue-600",
          iconBg: isDark ? "bg-blue-500/20" : "bg-blue-500",
          iconText: isDark ? "text-blue-400" : "text-white",
          shadow: "shadow-blue-500/10",
          label: "Envío Logístico",
        };
      case "tournament":
        return {
          bg: isDark ? ".02]" : "",
          border: isDark ? "border-purple-500/20" : "border-purple-100",
          hoverBorder: isDark ? "hover:border-purple-400" : "hover:border-purple-300",
          text: isDark ? "text-purple-400" : "text-purple-600",
          iconBg: isDark ? "bg-purple-500/20" : "bg-purple-500",
          iconText: isDark ? "text-purple-400" : "text-white",
          shadow: "shadow-purple-500/10",
          label: "Torneo Activo",
        };
      case "return":
        return {
          bg: isDark ? ".02]" : "",
          border: isDark ? "border-orange-500/20" : "border-orange-100",
          hoverBorder: isDark ? "hover:border-orange-400" : "hover:border-orange-300",
          text: isDark ? "text-orange-400" : "text-orange-600",
          iconBg: isDark ? "bg-orange-500/20" : "bg-orange-500",
          iconText: isDark ? "text-orange-400" : "text-white",
          shadow: "shadow-orange-500/10",
          label: "Entrega Realizada",
        };
      case "maintenance":
        return {
          bg: isDark ? ".02]" : "",
          border: isDark ? "border-zinc-500/20" : "border-zinc-200",
          hoverBorder: isDark ? "hover:border-zinc-400" : "hover:border-zinc-400",
          text: isDark ? "text-zinc-400" : "text-zinc-600",
          iconBg: isDark ? "bg-zinc-500/20" : "bg-zinc-500",
          iconText: isDark ? "text-zinc-400" : "text-white",
          shadow: "shadow-zinc-500/10",
          label: "Mantenimiento",
        };
      default:
        return {
          bg: isDark ? ".02]" : "",
          border: isDark ? "border-emerald-500/20" : "border-emerald-100",
          hoverBorder: isDark ? "hover:border-emerald-400" : "hover:border-emerald-300",
          text: isDark ? "text-emerald-400" : "text-emerald-600",
          iconBg: isDark ? "bg-emerald-500/20" : "bg-emerald-500",
          iconText: isDark ? "text-emerald-400" : "text-white",
          shadow: "shadow-emerald-500/10",
          label: "Evento General",
        };
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        time: date.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch {
      return { date: dateString, time: "" };
    }
  };

  const config = getTypeConfig(event.type);
  const { date, time } = formatDate(event.date);

  return (
    <div className="relative group/card">
      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.id);
          }}
          className={`absolute -top-3 -right-3 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover/card:opacity-100 shadow-xl border ${
            darkMode 
              ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' 
              : 'bg-white border-red-100 text-red-500 hover:bg-red-500 hover:text-white'
          }`}
          title="Eliminar evento"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}

      {/* Main Card */}
      <button
        onClick={onClick}
        className={`
          w-full p-6 rounded-3xl border text-left
          transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl
          relative overflow-hidden group/button
          ${config.bg} ${config.border} ${config.hoverBorder}
        `}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
          {/* Icon and Type Area */}
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-4 rounded-2xl shadow-xl transition-all duration-500 ${config.iconBg} ${config.iconText} ${config.shadow} group-hover/button:scale-110`}>
              {getTypeIcon(event.type)}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${config.text}`}>
                {config.label}
              </span>
              <h3 className={`text-lg font-black tracking-tight mb-2 leading-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'} group-hover/button:text-emerald-500`}>
                {event.title}
              </h3>
              
              {/* Date & Time */}
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{date}</span>
                </div>
                {time && (
                  <div className="flex items-center gap-1.5 border-l pl-3 border-zinc-500/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{time}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ArrowRight className={`w-6 h-6 self-center transition-all duration-500 hidden md:block ${darkMode ? 'text-zinc-700 group-hover:text-emerald-400 tranzinc-x-0' : 'text-zinc-300 group-hover:text-emerald-600'} group-hover/button:tranzinc-x-2`} />
        </div>

        {/* Details Section */}
        {event.details && Object.keys(event.details).length > 0 && (
          <div className={`mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-4 transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-zinc-100'}`}>
            {event.details.destination && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Destino Final</p>
                  <p className={`text-xs font-bold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{event.details.destination}</p>
                </div>
              </div>
            )}
            {event.details.recipient && (
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Receptor</p>
                  <p className={`text-xs font-bold ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{event.details.recipient}</p>
                </div>
              </div>
            )}
            {event.details.trackingNumber && (
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Guía de Seguimiento</p>
                  <p className={`text-xs font-mono font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{event.details.trackingNumber}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Indicator */}
        <div className={`mt-6 flex items-center justify-between transition-colors duration-500`}>
          <div className={`text-[10px] font-black uppercase tracking-tighter transition-colors duration-500 ${darkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
            ID REF: {String(event.id).split("-")[0]}
          </div>
          <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
            darkMode ? 'bg-white/5 text-zinc-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400' : 'bg-zinc-50 text-zinc-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
          }`}>
            Detalles Maestros � 
          </div>
        </div>
      </button>
    </div>
  );
};

export default EventCard;
