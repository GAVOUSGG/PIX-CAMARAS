import React, { useState } from 'react';
import { Eye, MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';
import KeyChecker from '../Debug/KeyChecker';

const TournamentTable = ({ 
  tournaments, 
  onViewDetails, 
  onEditTournament, 
  onDeleteTournament, 
  onUpdateStatus 
}) => {
  const [actionMenu, setActionMenu] = useState(null);

  // Cerrar menú cuando se hace clic fuera
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActionMenu(null);
    };

    if (actionMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [actionMenu]);

  const handleStatusChange = (tournamentId, newStatus) => {
    console.log("🔄 Cambiando estado del torneo:", tournamentId, newStatus);
    onUpdateStatus(tournamentId, newStatus);
    setActionMenu(null);
  };

  const handleEdit = (tournament) => {
    console.log("✏️ Editando torneo:", tournament);
    onEditTournament(tournament);
    setActionMenu(null);
  };

  const handleDelete = (tournamentId) => {
    console.log("🗑️ Solicitando eliminar torneo:", tournamentId);
    onDeleteTournament(tournamentId);
    setActionMenu(null);
  };

  const handleView = (tournament) => {
    console.log("👀 Viendo detalles del torneo:", tournament);
    onViewDetails(tournament);
    setActionMenu(null);
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pendiente', 'activo', 'terminado', 'cancelado'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  return (
    <>
      <KeyChecker data={tournaments} componentName="TournamentTable" />
      
      <div className="bg-black/20 rounded-2xl border border-white/10 overflow-hidden"> {/* Quitado backdrop-blur-lg temporalmente */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Torneo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trabajador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cámaras</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {tournaments.map(tournament => (
                <tr key={tournament.id} className="hover:bg-white/5 transition-colors">
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
                        ? `${tournament.holes} hoyos`
                        : 'Sin hoyos'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {/* Botón Ver - DEBE funcionar siempre */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Importante: prevenir propagación
                          console.log("👀 Click en botón Ver torneo");
                          handleView(tournament);
                        }}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors p-1 rounded hover:bg-white/10"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {/* Menú de acciones */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Importante
                            console.log("📋 Click en menú acciones torneo");
                            setActionMenu(actionMenu === tournament.id ? null : tournament.id);
                          }}
                          className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {actionMenu === tournament.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50">
                            <div className="p-2">
                              {/* Ver detalles */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(tournament);
                                }}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Ver detalles completos</span>
                              </button>
                              
                              {/* Editar */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(tournament);
                                }}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Editar torneo</span>
                              </button>
                              
                              {/* Cambiar estado */}
                              <div className="border-t border-white/10 my-1"></div>
                              <div className="px-3 py-2 text-xs text-gray-400 uppercase font-medium">
                                Cambiar Estado
                              </div>
                              
                              {getStatusOptions(tournament.status).map(status => (
                                <button
                                  key={status}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(tournament.id, status);
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <Calendar className="w-4 h-4" />
                                  <span className="capitalize">Marcar como {status}</span>
                                </button>
                              ))}
                              
                              {/* Eliminar */}
                              <div className="border-t border-white/10 my-1"></div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('¿Estás seguro de que quieres eliminar este torneo? Esta acción no se puede deshacer.')) {
                                    handleDelete(tournament.id);
                                  }
                                }}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Eliminar torneo</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TournamentTable;