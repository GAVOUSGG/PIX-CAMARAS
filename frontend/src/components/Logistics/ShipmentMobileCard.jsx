import React from 'react';
import { Truck, MapPin, User, Calendar, Hash, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const ShipmentMobileCard = ({ shipment, onView, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "enviado": return "text-green-400";
      case "preparando": return "text-yellow-400";
      case "pendiente": return "text-orange-400";
      case "entregado": return "text-blue-400";
      case "cancelado": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="bg-black/20 rounded-xl border border-white/10 p-4 hover:bg-white/5 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <Truck className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-base font-semibold text-white font-mono truncate">{shipment.id}</div>
            {shipment.sender && (
              <div className="text-xs text-gray-400 truncate">{shipment.sender}</div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 ml-2">
          <button
            onClick={() => onView(shipment)}
            className="p-2 text-emerald-400 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      onView(shipment);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver detalles</span>
                  </button>
                  <button
                    onClick={() => {
                      onEdit(shipment);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-400 hover:bg-white/10 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  
                  <div className="border-t border-white/10 my-1"></div>
                  <div className="px-3 py-2 text-xs text-gray-400 font-medium">Cambiar estado</div>
                  {["preparando", "pendiente", "enviado", "entregado"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        if (shipment.status !== status) {
                          onEdit({ ...shipment, status });
                        }
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg"
                    >
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(status).replace('text-', 'bg-')}`} />
                      <span className="capitalize">{status}</span>
                    </button>
                  ))}

                  <div className="border-t border-white/10 my-1"></div>
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de que quieres eliminar este envío?')) {
                        onDelete(shipment.id);
                      }
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <StatusBadge status={shipment.status} />
        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
          {shipment.cameras?.length || 0} cámaras
        </span>
      </div>

      {/* Info Grid */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2 text-gray-300">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{shipment.destination}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-300">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{shipment.recipient}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-300">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{shipment.date}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center space-x-2 text-gray-300 font-mono text-xs">
            <Hash className="w-4 h-4 text-gray-400" />
            <span>{shipment.trackingNumber || "No tracking"}</span>
          </div>
          {shipment.shipper && (
            <div className="text-xs text-gray-500">
              Por: {shipment.shipper}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentMobileCard;
