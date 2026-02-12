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
    <tr className="hover:bg-white/[0.03] transition-all duration-300 group">
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{tournament.name}</div>
        <div className="text-[11px] text-gray-500 mt-0.5 font-medium">{tournament.field}</div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="text-sm text-gray-300 font-medium">{tournament.location}</div>
        <div className="text-[11px] text-gray-500">{tournament.state}</div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
          <Calendar className="w-3.5 h-3.5 text-emerald-500/50" />
          {tournament.date}
        </div>
        {tournament.endDate && tournament.endDate !== tournament.date && (
          <div className="text-[11px] text-gray-500 ml-5">al {tournament.endDate}</div>
        )}
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <StatusBadge status={tournament.status} />
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="text-sm text-gray-300 font-medium">{tournament.worker}</div>
        {tournament.workerId && (
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">ID: {tournament.workerId}</div>
        )}
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold w-fit border border-blue-500/20">
            {tournament.cameras?.length || 0} Cámaras
          </span>
          <span className="text-[10px] text-gray-500 font-medium ml-1">
            {tournament.holes || 0} Hoyos
          </span>
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-right">
        <div className="flex items-center space-x-1 justify-end">
          <button 
            onClick={() => onView(tournament)}
            className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-300"
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
              className={`p-2 rounded-xl transition-all duration-300 ${showMenu ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-52 glass-card border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in py-1.5">
                    <button
                      onClick={() => { onView(tournament); setShowMenu(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                    >
                      <Eye className="w-4 h-4 text-emerald-400/70" />
                      <span>Inspeccionar</span>
                    </button>
                    
                    <button
                      onClick={() => { onEdit(tournament); setShowMenu(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                    >
                      <Edit className="w-4 h-4 text-blue-400/70" />
                      <span>Editar Registro</span>
                    </button>
                    
                    <div className="h-px bg-white/5 my-1.5 mx-2"></div>
                    <div className="px-4 py-1.5 text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Actualizar Fase</div>
                    {getStatusOptions(tournament.status).map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          onUpdateStatus(tournament.id, status);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-1.5 text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all capitalize"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          status === 'activo' ? 'bg-emerald-500' : 
                          status === 'pendiente' ? 'bg-yellow-500' : 
                          status === 'terminado' ? 'bg-blue-500' : 'bg-red-500'
                        }`}></div>
                        <span>{status}</span>
                      </button>
                    ))}
                    
                    <div className="h-px bg-white/5 my-1.5 mx-2"></div>
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de que quieres eliminar este torneo?')) {
                          onDelete(tournament.id);
                        }
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
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

      <div className="hidden md:block glass-card rounded-3xl overflow-hidden shadow-2xl border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Información del Torneo</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ubicación</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cronograma</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estado Actual</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Responsable</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recursos</th>
                <th className="px-6 py-5 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tournaments.map((tournament, idx) => (
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
