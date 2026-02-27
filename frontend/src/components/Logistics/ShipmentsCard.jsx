import React from 'react';
import { X, Truck, Package, MapPin, Calendar, User, Hash, Camera } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const ShipmentCard = ({ shipment, onClose, onEdit, darkMode = true }) => {
  if (!shipment) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'enviado': return 'text-emerald-400';
      case 'preparando': return 'text-amber-400';
      case 'pendiente': return 'text-orange-400';
      case 'entregado': return 'text-blue-400';
      case 'cancelado': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-left">
      {/* Overlay */}
      <div 
        className={`fixed inset-0 transition-colors duration-500 ${
          darkMode ? 'bg-zinc-950/40' : 'bg-zinc-900/10'
        }`} 
        onClick={onClose} 
      />

      <div 
        className={`w-full max-w-2xl relative z-10 shadow-2xl rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
          darkMode 
            ? 'bg-zinc-900 border-white/5' 
            : 'bg-white border-black/5 shadow-zinc-300'
        }`}
        onClick={handleModalClick}
      >
        {/* Header Visual */}
        <div className={`h-32 relative overflow-hidden ${darkMode ? 'bg-zinc-950/50' : 'bg-zinc-50'}`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 "></div>
        </div>

        {/* Content Container */}
        <div className="px-8 pb-8 -mt-16 relative z-10">
          <div className="flex items-end justify-between mb-8 group">
            <div className="flex items-end space-x-6">
              <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 transform transition-transform group-hover:scale-105 duration-500">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <div className="pb-2">
                <h3 className={`text-3xl font-black transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'} tracking-tighter font-mono`}>{shipment.id}</h3>
                <div className="mt-1">
                  <StatusBadge status={shipment.status} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-3 rounded-2xl transition-all duration-300 mb-2 ${
                darkMode ? 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8 max-h-[55vh] overflow-y-auto custom-scrollbar pr-2">
            {/* Sección Ruta */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-4 rounded-full ${darkMode ? 'bg-blue-500/50' : 'bg-blue-500'}`}></div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Ruta de Transferencia</h4>
              </div>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-3xl border transition-all duration-500 ${darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-zinc-50/50 border-zinc-100'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-0.5">Destino Final</span>
                    <p className={`text-sm font-bold transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{shipment.destination}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-0.5">Agente Receptor</span>
                    <p className={`text-sm font-bold transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{shipment.recipient}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección Unidades */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-4 rounded-full ${darkMode ? 'bg-emerald-500/50' : 'bg-emerald-500'}`}></div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Unidades Vinculadas</h4>
              </div>
              <div className={`p-6 rounded-3xl border transition-all duration-500 ${darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-zinc-50/50 border-zinc-100'}`}>
                <div className="flex flex-wrap gap-2">
                  {shipment.cameras && shipment.cameras.length > 0 ? (
                    shipment.cameras.map(cameraId => (
                      <div key={cameraId} className={`px-4 py-3 rounded-2xl border transition-all duration-300 flex items-center space-x-3 group/item ${
                        darkMode ? 'bg-zinc-950/50 border-white/5 hover:border-emerald-500/30' : 'bg-white border-zinc-200 hover:border-emerald-500'
                      }`}>
                        <Camera className={`w-4 h-4 transition-colors ${darkMode ? 'text-zinc-600 group-hover/item:text-emerald-500' : 'text-zinc-400 group-hover/item:text-emerald-600'}`} />
                        <span className={`text-xs font-black font-mono transition-colors duration-500 ${darkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{cameraId}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-bold text-zinc-500 italic uppercase tracking-widest w-full text-center py-4">No se declararon unidades PIX</p>
                  )}
                </div>
              </div>
            </section>

            {/* Sección Logística */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-4 rounded-full ${darkMode ? 'bg-orange-500/50' : 'bg-orange-500'}`}></div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Información Logística</h4>
              </div>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl border transition-all duration-500 ${darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-zinc-50/50 border-zinc-100'}`}>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Agente Remitente</span>
                    <p className={`text-sm font-bold transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{shipment.shipper || 'S/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Paquetería</span>
                    <div className="flex items-center space-x-2">
                      <Truck className="w-3.5 h-3.5 text-emerald-500" />
                      <p className={`text-sm font-bold transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{shipment.sender || 'No declarada'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Guía de Seguimiento</span>
                    <div className="flex items-center space-x-2">
                      <Hash className="w-3.5 h-3.5 text-blue-500" />
                      <p className={`text-sm font-black font-mono transition-colors duration-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{shipment.trackingNumber || 'PENDIENTE'}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Items Extra</span>
                    <div className="flex items-center space-x-2">
                      <Package className="w-3.5 h-3.5 text-zinc-500" />
                      <p className={`text-[11px] font-bold transition-colors duration-500 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'} line-clamp-1`}>{shipment.extraItems || 'Ninguno'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Metadata */}
            <div className={`p-6 rounded-3xl border transition-all duration-500 flex flex-col md:flex-row justify-between gap-4 ${darkMode ? 'bg-zinc-950/30 border-white/5' : 'bg-zinc-100/50 border-zinc-200'}`}>
              <div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Fecha de Registro</span>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <p className={`text-[11px] font-bold transition-colors duration-500 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{formatDate(shipment.createdAt || shipment.date)}</p>
                </div>
              </div>
              {shipment.updatedAt && (
                <div className="text-right md:text-right">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">�altima Modificación</span>
                  <p className={`text-[11px] font-bold transition-colors duration-500 ${darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{formatDate(shipment.updatedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => onEdit(shipment)}
              className="flex-grow bg-emerald-500 text-white font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
            >
              Modificar Expediente
            </button>
            <button
              onClick={onClose}
              className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 border ${
                darkMode 
                  ? 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' 
                  : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentCard;