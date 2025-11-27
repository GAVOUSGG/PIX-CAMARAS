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
} from "lucide-react";

const EventCard = ({ event, onClick, onDelete }) => {
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
    switch (type) {
      case "shipment":
        return {
          bg: "from-blue-500/20 to-blue-500/5",
          border: "border-blue-500/30",
          hoverBorder: "hover:border-blue-400/60",
          text: "text-blue-400",
          iconBg: "bg-blue-500/20",
          shadow: "shadow-blue-500/20",
          label: "Envío",
        };
      case "tournament":
        return {
          bg: "from-purple-500/20 to-purple-500/5",
          border: "border-purple-500/30",
          hoverBorder: "hover:border-purple-400/60",
          text: "text-purple-400",
          iconBg: "bg-purple-500/20",
          shadow: "shadow-purple-500/20",
          label: "Torneo",
        };
      case "return":
        return {
          bg: "from-orange-500/20 to-orange-500/5",
          border: "border-orange-500/30",
          hoverBorder: "hover:border-orange-400/60",
          text: "text-orange-400",
          iconBg: "bg-orange-500/20",
          shadow: "shadow-orange-500/20",
          label: "Entrega",
        };
      case "maintenance":
        return {
          bg: "from-gray-500/20 to-gray-500/5",
          border: "border-gray-500/30",
          hoverBorder: "hover:border-gray-400/60",
          text: "text-gray-400",
          iconBg: "bg-gray-500/20",
          shadow: "shadow-gray-500/20",
          label: "Mantenimiento",
        };
      default:
        return {
          bg: "from-white/10 to-white/5",
          border: "border-white/10",
          hoverBorder: "hover:border-white/20",
          text: "text-gray-400",
          iconBg: "bg-white/10",
          shadow: "shadow-white/10",
          label: "Evento",
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
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm("¿Eliminar este evento del historial?")) {
            onDelete();
          }
        }}
        className="absolute -top-3 -right-3 z-20 w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white hover:scale-110 transition-all opacity-0 group-hover/card:opacity-100 shadow-lg"
        title="Eliminar evento"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Main Card */}
      <button
        onClick={onClick}
        className={`
          w-full p-6 rounded-2xl border text-left
          transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
          backdrop-blur-sm group/button relative overflow-hidden
          bg-gradient-to-br ${config.bg} ${config.border} ${config.hoverBorder}
        `}
      >
        {/* Decorative Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${config.iconBg} border ${config.border} ${config.text} shadow-lg ${config.shadow}`}
              >
                {getTypeIcon(event.type)}
              </div>
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${config.text} block mb-1`}
                >
                  {config.label}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{date}</span>
                  {time && (
                    <>
                      <Clock className="w-3 h-3 ml-1" />
                      <span>{time}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover/button:text-white group-hover/button:translate-x-1 transition-all" />
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg text-white mb-3 line-clamp-2 group-hover/button:text-emerald-50 transition-colors leading-tight">
            {event.title}
          </h3>

          {/* Details */}
          {event.details && Object.keys(event.details).length > 0 && (
            <div className="space-y-1.5 mb-4">
              {event.details.destination && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Destino: {event.details.destination}</span>
                </div>
              )}
              {event.details.recipient && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Package className="w-3.5 h-3.5" />
                  <span>Receptor: {event.details.recipient}</span>
                </div>
              )}
              {event.details.trackingNumber && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Truck className="w-3.5 h-3.5" />
                  <span className="font-mono">{event.details.trackingNumber}</span>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className={`text-xs font-semibold ${config.text}`}>
              ID: {event.id.split("-")[0]}
            </div>
            <div className="text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg group-hover/button:bg-white/20 transition-all font-medium">
              Ver detalles →
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default EventCard;
