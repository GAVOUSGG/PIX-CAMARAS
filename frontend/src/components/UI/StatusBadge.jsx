import React from "react";
import {
  CheckCircle,
  Clock,
  Camera,
  AlertCircle,
  Send,
  Truck,
} from "lucide-react";

const StatusBadge = ({ status, darkMode = true }) => {
  const getStatusConfig = (status) => {
    const configs = {
      activo: {
        color: darkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
      },
      pendiente: {
        color: darkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-100 text-amber-700 border-amber-200",
        icon: Clock,
      },
      terminado: {
        color: darkMode ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-100 text-blue-700 border-blue-200",
        icon: CheckCircle,
      },
      "en uso": {
        color: darkMode ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-rose-100 text-rose-700 border-rose-200",
        icon: Camera,
      },
      disponible: {
        color: darkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
      },
      mantenimiento: {
        color: darkMode ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-orange-100 text-orange-700 border-orange-200",
        icon: AlertCircle,
      },
      enviado: {
        color: darkMode ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-100 text-blue-700 border-blue-200",
        icon: Send,
      },
      "en envio": {
        color: darkMode ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-100 text-indigo-700 border-indigo-200",
        icon: Truck,
      },
      preparando: {
        color: darkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-100 text-amber-700 border-amber-200",
        icon: Clock,
      },
      entregado: {
        color: darkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
      },
      cancelado: {
        color: darkMode ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" : "bg-zinc-100 text-zinc-700 border-zinc-200",
        icon: AlertCircle,
      },
      ocupado: {
        color: darkMode ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-rose-100 text-rose-700 border-rose-200",
        icon: Clock,
      },
      vacaciones: {
        color: darkMode ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-100 text-indigo-700 border-indigo-200",
        icon: Clock,
      },
    };

    return (
      configs[status.toLowerCase()] || {
        color: darkMode ? "bg-zinc-800 text-zinc-400 border-zinc-700" : "bg-zinc-100 text-zinc-600 border-zinc-200",
        icon: AlertCircle,
      }
    );
  };

  const { color, icon: Icon } = getStatusConfig(status);

  return (
    <div
      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit shadow-sm transition-all duration-500 ${color}`}
    >
      <Icon className="w-3 h-3" />
      <span>{status}</span>
    </div>
  );
};

export default StatusBadge;
  