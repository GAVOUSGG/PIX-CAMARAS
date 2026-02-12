import React, { useState, memo } from 'react';
import { Eye, MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';
import TournamentMobileCard from './TournamentMobileCard';

const TournamentRow = memo(({ tournament, onView, onEdit, onDelete, onUpdateStatus }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pendiente', 'activo', 'terminado', 'cancelado'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-white">{tournament.name}</div>
        <div className="text-xs text-gray-400">{tournament.field}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{tournament.location}</div>
        <div className="text-sm text-gray-400">{tournament.state}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{tournament.date}</div>
        {tournament.endDate && tournament.endDate !== tournament.date && (
          <div className="text-xs text-gray-400">al {tournament.endDate}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={tournament.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{tournament.worker}</div>
        {tournament.workerId && (
          <div className="text-xs text-gray-400">ID: {tournament.workerId}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">
          {tournament.cameras && tournament.cameras.length > 0 
            ? `${tournament.cameras.length} cámaras`
            : 'Sin asignar'
          }
        </div>
        <div className="text-xs text-gray-400">
          {tournament.holes > 0
            ? `${tournament.holes} ${tournament.holes === 1 ? 'hoyo' : 'hoyos'}`
            : 'Sin hoyos'
          }
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center space-x-2 justify-end">
          <button 
            onClick={() => onView(tournament)}
            className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 rounded hover:bg-white/10"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-1">
                    <button
                      onClick={() => { onView(tournament); setShowMenu(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver detalles</span>
                    </button>
                    
                    <button
                      onClick={() => { onEdit(tournament); setShowMenu(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-400 hover:bg-white/10 rounded-md transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    
                    <div className="border-t border-white/10 my-1"></div>
                    <div className="px-3 py-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Estado rápido</div>
                    {getStatusOptions(tournament.status).map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          onUpdateStatus(tournament.id, status);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 rounded-md transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        <span className="capitalize">{status}</span>
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
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
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
      </td>
    </tr>
  );
});

const TournamentTable = ({ 
  tournaments, 
  onViewDetails, 
  onEditTournament, 
  onDeleteTournament, 
  onUpdateStatus 
}) => {
  const handleEdit = (tournament) => onEditTournament(tournament);
  const handleView = (tournament) => onViewDetails(tournament);
  const handleStatusChange = (id, status) => onUpdateStatus(id, status);
  const handleDelete = (id) => onDeleteTournament(id);

  return (
    <>
      <div className="md:hidden space-y-3">
        {tournaments && tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <TournamentMobileCard
              key={tournament.id}
              tournament={tournament}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdateStatus={handleStatusChange}
            />
          ))
        ) : (
          <div className="bg-black/20 rounded-xl border border-white/10 p-8 text-center text-gray-400">
            No hay torneos para mostrar
          </div>
        )}
      </div>

      <div className="hidden md:block bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Torneo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trabajador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cámaras</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {tournaments.map(tournament => (
                <TournamentRow 
                  key={tournament.id}
                  tournament={tournament}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdateStatus={handleStatusChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default memo(TournamentTable);
