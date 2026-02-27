import React from 'react';
import { Truck, MapPin, User, Calendar, Hash, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const ShipmentMobileCard = ({ shipment, onView, onEdit, onDelete, darkMode = true }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "enviado": return "text-emerald-400";
      case "preparando": return "text-amber-400";
      case "pendiente": return "text-orange-400";
      case "entregado": return "text-blue-400";
      case "cancelado": return "text-red-400";
      default: return "text-zinc-400 text-zinc-500";
    }
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 ${
      darkMode ? 'bg-white/[0.02] border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-zinc-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`p-2.5 rounded-xl transition-colors duration-500 ${darkMode ? 'bg-white/5 text-zinc-400' : 'bg-zinc-50 text-zinc-500'}`}>
            <Truck className="w-5 h-5 flex-shrink-0" />
          </div>
          <div className="min-w-0">
            <div className={`text-base font-black transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'} font-mono truncate`}>{shipment.id}</div>
            {shipment.sender && (
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight truncate">{shipment.sender}</div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 ml-2">
          <button
            onClick={() => onView(shipment)}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
            }`}
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                darkMode ? 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
              }`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className={`absolute right-0 mt-3 w-56 rounded-2xl border shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-300 ${
                  darkMode ? 'bg-zinc-900 border-white/10 shadow-black' : 'bg-white border-black/5'
                }`}>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => { onView(shipment); setShowMenu(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-white hover:bg-white/10' : 'text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-emerald-500" />
                      <span>Ver Detalles</span>
                    </button>
                    <button
                      onClick={() => { onEdit(shipment); setShowMenu(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-blue-400 hover:bg-white/10' : 'text-blue-600 hover:bg-zinc-50'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modificar</span>
                    </button>
                    
                    <div className={`border-t my-1 ${darkMode ? 'border-white/10' : 'border-zinc-100'}`}></div>
                    <div className="px-4 py-2 text-[9px] text-zinc-500 font-black uppercase tracking-widest">Estado Rápido</div>
                    {["preparando", "pendiente", "enviado", "entregado"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          if (shipment.status !== status) onEdit({ ...shipment, status });
                          setShowMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                          shipment.status === status 
                            ? darkMode ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-900" 
                            : darkMode ? "text-zinc-400 hover:bg-white/10 hover:text-white" : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(status).replace('text-', 'bg-')}`} />
                        <span className="capitalize">{status}</span>
                      </button>
                    ))}

                    <div className={`border-t my-1 ${darkMode ? 'border-white/10' : 'border-zinc-100'}`}></div>
                    <button
                      onClick={() => {
                        if (confirm('¿Confirmar eliminación de expediente logístico?')) {
                          onDelete(shipment.id);
                        }
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        <StatusBadge status={shipment.status} />
        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
          darkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
        }`}>
          {shipment.cameras?.length || 0} UNIDADES PIX
        </span>
      </div>

      {/* Info Grid */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span className={`text-[11px] font-bold transition-colors duration-500 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'} truncate`}>{shipment.destination}</span>
        </div>

        <div className="flex items-center space-x-3">
          <User className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span className={`text-[11px] font-bold transition-colors duration-500 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'} truncate`}>{shipment.recipient}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span className={`text-[11px] font-bold transition-colors duration-500 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{shipment.date}</span>
        </div>

        <div className={`pt-4 mt-2 border-t flex items-center justify-between transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-zinc-100'}`}>
          <div className="flex items-center space-x-2 font-mono text-[10px] font-black uppercase tracking-tighter text-zinc-500">
            <Hash className="w-4 h-4" />
            <span>{shipment.trackingNumber || "PENDIENTE"}</span>
          </div>
          {shipment.shipper && (
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 opacity-60">
              LOG: {shipment.shipper.split(' ')[0]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentMobileCard;
