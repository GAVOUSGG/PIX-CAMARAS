import React from 'react';
import { User, MapPin, Phone, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const WorkerMobileCard = ({ worker, onView, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="bg-black/20 rounded-xl border border-white/10 p-4 hover:bg-white/5 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-base font-semibold text-white truncate">{worker.name}</div>
            <div className="text-xs text-gray-400">ID: {worker.id}</div>
            {worker.specialty && (
              <div className="text-xs text-gray-500 truncate">{worker.specialty}</div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 ml-2">
          <button
            onClick={() => onView(worker)}
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
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      onView(worker);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver detalles</span>
                  </button>
                  <button
                    onClick={() => {
                      onEdit(worker);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-400 hover:bg-white/10 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <div className="border-t border-white/10 my-1"></div>
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de que quieres eliminar este trabajador?')) {
                        onDelete(worker.id);
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

      {/* Status Badge */}
      <div className="mb-3">
        <StatusBadge status={worker.status} />
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm">
        {/* State */}
        <div className="flex items-center space-x-2 text-gray-300">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{worker.state}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-2 text-gray-300">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{worker.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkerMobileCard;
