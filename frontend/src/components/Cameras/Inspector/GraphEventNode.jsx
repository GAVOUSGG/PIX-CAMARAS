import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Package, MapPin, Trophy, Truck, Settings, Calendar, Clock, User } from 'lucide-react';

const getTypeIcon = (type) => {
  switch (type) {
    case "shipment": return <Truck className="w-5 h-5" />;
    case "tournament": return <Trophy className="w-5 h-5" />;
    case "return": return <MapPin className="w-5 h-5" />;
    case "maintenance": return <Settings className="w-5 h-5" />;
    default: return <Package className="w-5 h-5" />;
  }
};

const getTypeConfig = (type, darkMode) => {
  switch (type) {
    case "shipment":
      return {
        border: darkMode ? "border-blue-500/30" : "border-blue-200",
        bg: darkMode ? "bg-zinc-900/90" : "bg-white/95",
        text: darkMode ? "text-blue-400" : "text-blue-600",
        iconBg: darkMode ? "bg-blue-500/20" : "bg-blue-500",
        iconText: darkMode ? "text-blue-400" : "text-white",
        label: "Envío",
      };
    case "tournament":
      return {
        border: darkMode ? "border-purple-500/30" : "border-purple-200",
        bg: darkMode ? "bg-zinc-900/90" : "bg-white/95",
        text: darkMode ? "text-purple-400" : "text-purple-600",
        iconBg: darkMode ? "bg-purple-500/20" : "bg-purple-500",
        iconText: darkMode ? "text-purple-400" : "text-white",
        label: "Torneo Activo",
      };
    case "return":
      return {
        border: darkMode ? "border-orange-500/30" : "border-orange-200",
        bg: darkMode ? "bg-zinc-900/90" : "bg-white/95",
        text: darkMode ? "text-orange-400" : "text-orange-600",
        iconBg: darkMode ? "bg-orange-500/20" : "bg-orange-500",
        iconText: darkMode ? "text-orange-400" : "text-white",
        label: "Entrega Realizada",
      };
    case "maintenance":
      return {
        border: darkMode ? "border-zinc-500/30" : "border-zinc-300",
        bg: darkMode ? "bg-zinc-900/90" : "bg-white/95",
        text: darkMode ? "text-zinc-400" : "text-zinc-600",
        iconBg: darkMode ? "bg-zinc-500/20" : "bg-zinc-500",
        iconText: darkMode ? "text-zinc-400" : "text-white",
        label: "Mantenimiento",
      };
    default:
      return {
        border: darkMode ? "border-emerald-500/30" : "border-emerald-200",
        bg: darkMode ? "bg-zinc-900/90" : "bg-white/95",
        text: darkMode ? "text-emerald-400" : "text-emerald-600",
        iconBg: darkMode ? "bg-emerald-500/20" : "bg-emerald-500",
        iconText: darkMode ? "text-emerald-400" : "text-white",
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
    return { date: dateString, time: null };
  }
};

const GraphEventNode = ({ data }) => {
  const { event, darkMode, onClick } = data;
  const config = getTypeConfig(event.type, darkMode);
  const { date, time } = formatDate(event.date);

  return (
    <>
      {/* Top Handle connected to Previous event */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: darkMode ? '#10b981' : '#059669', 
          width: '10px', 
          height: '10px',
          border: '2px solid',
          borderColor: darkMode ? '#0f172a' : '#ffffff'
        }} 
      />

      <div 
        onClick={() => onClick(event)}
        className={`w-80 rounded-2xl border-2 backdrop-blur-md shadow-xl transition-all duration-300 cursor-pointer hover:-tranzinc-y-1 hover:shadow-2xl ${config.bg} ${config.border}`}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-xl flex-shrink-0 transition-all shadow-inner ${config.iconBg} ${config.iconText}`}>
              {getTypeIcon(event.type)}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${config.text}`}>
                {config.label}
              </span>
              <h3 className={`text-base font-black tracking-tight mb-2 leading-tight truncate ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {event.title}
              </h3>
            </div>
          </div>

          {/* Chronology Base Meta */}
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

          {/* Relevant Mini Details Map */}
          {event.details && Object.keys(event.details).length > 0 && (
            <div className={`mt-4 pt-4 border-t flex flex-wrap gap-x-4 gap-y-2 ${darkMode ? 'border-white/10' : 'border-zinc-200'}`}>
               {event.details.origin && (
                  <div className="flex items-center gap-1.5 w-full">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span className={`text-[10px] uppercase font-bold truncate ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      <span className="opacity-50 mr-1">ORIGEN:</span>
                      {event.details.origin}
                    </span>
                  </div>
                )}
               {event.details.destination && (
                  <div className="flex items-center gap-1.5 w-full">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span className={`text-[10px] uppercase font-bold truncate ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      <span className="opacity-50 mr-1">DESTINO:</span>
                      {event.details.destination}
                    </span>
                  </div>
                )}
                {event.details.trackingNumber && (
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-purple-500" />
                    <span className={`text-[10px] font-mono tracking-tighter font-bold ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {event.details.trackingNumber}
                    </span>
                  </div>
                )}
            </div>
          )}

        </div>
      </div>

      {/* Bottom Handle connected to Next event */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          background: darkMode ? '#10b981' : '#059669', 
          width: '10px', 
          height: '10px',
          border: '2px solid',
          borderColor: darkMode ? '#0f172a' : '#ffffff'
        }} 
      />
    </>
  );
};

export default GraphEventNode;
