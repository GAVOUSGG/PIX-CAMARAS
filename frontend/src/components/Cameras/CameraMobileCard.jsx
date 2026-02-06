import React from 'react';
import { Camera, Hash, MessageCircle, UserCheck, UserX, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const CameraMobileCard = ({ camera, onView, onEdit, onDelete, onInspect }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Solar":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Eléctrica":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Híbrida":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="bg-black/20 rounded-xl border border-white/10 p-4 hover:bg-white/5 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1">
          <Camera className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-base font-semibold text-white truncate">{camera.id}</div>
            <div className="text-sm text-gray-400 truncate">{camera.model}</div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 ml-2">
          <button
            onClick={() => onView(camera)}
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
                      onInspect(camera.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-purple-400 hover:bg-white/10 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver historial</span>
                  </button>
                  <button
                    onClick={() => {
                      onEdit(camera);
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
                      onDelete(camera.id);
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

      {/* Info Grid */}
      <div className="space-y-2">
        {/* Type & Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getTypeBadgeColor(camera.type)}`}>
            <span>{camera.type}</span>
          </div>
          <StatusBadge status={camera.status} />
        </div>

        {/* Serial & SIM */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-1 text-gray-300">
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="font-mono text-xs truncate">{camera.serialNumber}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-300">
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <span className="font-mono text-xs truncate">{camera.simNumber || 'N/A'}</span>
          </div>
        </div>

        {/* Location */}
        <div className="text-sm text-gray-300">
          Ubicación: {camera.location}
        </div>

        {/* Assignment */}
        <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
          {camera.assignedTo ? (
            <>
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-emerald-400 font-medium truncate">{camera.assignedTo}</div>
                {camera.status === "en uso" && (
                  <div className="text-xs text-red-400">En torneo activo</div>
                )}
                {camera.status === "en envio" && (
                  <div className="text-xs text-blue-400">En envío</div>
                )}
              </div>
            </>
          ) : (
            <>
              <UserX className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500 text-sm italic">No asignada</span>
            </>
          )}
        </div>

        {/* Notes if any */}
        {camera.notes && (
          <div className="text-xs text-gray-500 italic truncate pt-1">
            Notas: {camera.notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraMobileCard;
