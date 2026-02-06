import React from 'react';
import { Calendar, MapPin, Users, Camera, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const TournamentMobileCard = ({ tournament, onView, onEdit, onDelete, onUpdateStatus }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pendiente', 'activo', 'terminado', 'cancelado'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  return (
    <div className="bg-black/20 rounded-xl border border-white/10 p-4 hover:bg-white/5 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-white truncate">{tournament.name}</div>
          <div className="text-sm text-gray-400 truncate">{tournament.field}</div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 ml-2">
          <button
            onClick={() => onView(tournament)}
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
                      onView(tournament);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver detalles</span>
                  </button>
                  <button
                    onClick={() => {
                      onEdit(tournament);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-400 hover:bg-white/10 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  
                  <div className="border-t border-white/10 my-1"></div>
                  <div className="px-3 py-2 text-xs text-gray-400 uppercase font-medium">
                    Cambiar Estado
                  </div>
                  
                  {getStatusOptions(tournament.status).map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        onUpdateStatus(tournament.id, status);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg"
                    >
                      <Calendar className="w-4 h-4" />
                      <span className="capitalize">Marcar como {status}</span>
                    </button>
                  ))}
                  
                  <div className="border-t border-white/10 my-1"></div>
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de que quieres eliminar este torneo?')) {
                        onDelete(tournament.id);
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
        <StatusBadge status={tournament.status} />
      </div>

      {/* Info Grid */}
      <div className="space-y-2 text-sm">
        {/* Location */}
        <div className="flex items-center space-x-2 text-gray-300">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="truncate">{tournament.location}, {tournament.state}</span>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center space-x-2 text-gray-300">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div>
            {tournament.date}
            {tournament.endDate && tournament.endDate !== tournament.date && (
              <span className="text-gray-400"> al {tournament.endDate}</span>
            )}
          </div>
        </div>

        {/* Worker */}
        <div className="flex items-center space-x-2 text-gray-300">
          <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <span className="truncate">{tournament.worker}</span>
            {tournament.workerId && (
              <span className="text-xs text-gray-400 ml-1">(ID: {tournament.workerId})</span>
            )}
          </div>
        </div>

        {/* Cameras */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center space-x-2 text-gray-300">
            <Camera className="w-4 h-4 text-gray-400" />
            <span>
              {tournament.cameras && tournament.cameras.length > 0 
                ? `${tournament.cameras.length} cámaras`
                : 'Sin asignar'
              }
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {tournament.holes > 0
              ? `${tournament.holes} ${tournament.holes === 1 ? 'hoyo' : 'hoyos'}`
              : 'Sin hoyos'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentMobileCard;
