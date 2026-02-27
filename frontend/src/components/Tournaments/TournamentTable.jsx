import React, { useState, memo } from 'react';
import { Eye, MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';
import TournamentMobileCard from './TournamentMobileCard';

const TournamentRow = memo(({ tournament, onView, onEdit, onDelete, onUpdateStatus, darkMode }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pendiente', 'activo', 'terminado', 'cancelado'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  return (
    <tr className={`transition-all duration-300 group ${darkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-zinc-50'}`}>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className={`text-sm font-bold transition-colors ${darkMode ? 'text-white group-hover:text-emerald-400' : 'text-zinc-900 group-hover:text-emerald-500'}`}>{tournament.name}</div>
        <div className={`text-[11px] font-medium mt-0.5 ${darkMode ? 'text-gray-500' : 'text-zinc-500'}`}>{tournament.field}</div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-zinc-700'}`}>{tournament.location}</div>
        <div className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-zinc-500'}`}>{tournament.state}</div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-zinc-700'}`}>
          <Calendar className={`w-3.5 h-3.5 ${darkMode ? 'text-emerald-500/50' : 'text-emerald-500'}`} />
          {tournament.date}
        </div>
        {tournament.endDate && tournament.endDate !== tournament.date && (
          <div className={`text-[11px] ml-5 ${darkMode ? 'text-gray-500' : 'text-zinc-500'}`}>al {tournament.endDate}</div>
        )}
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <StatusBadge status={tournament.status} />
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-zinc-700'}`}>{tournament.worker}</div>
        {tournament.workerId && (
          <div className={`text-[10px] font-bold uppercase tracking-tighter mt-0.5 ${darkMode ? 'text-gray-500' : 'text-zinc-500'}`}>ID: {tournament.workerId}</div>
        )}
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex flex-col gap-1">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold w-fit border ${darkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
            {tournament.cameras?.length || 0} Cámaras
          </span>
          <span className={`text-[10px] font-medium ml-1 ${darkMode ? 'text-gray-500' : 'text-zinc-500'}`}>
            {tournament.holes || 0} Hoyos
          </span>
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-right">
        <div className="flex items-center space-x-1 justify-end">
          <button 
            onClick={() => onView(tournament)}
            className={`p-2 rounded-xl transition-all duration-300 ${darkMode ? 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10' : 'text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
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
              className={`p-2 rounded-xl transition-all duration-300 ${showMenu ? (darkMode ? 'bg-white/10 text-white' : 'bg-zinc-200 text-zinc-800') : (darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100')}`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className={`absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in py-1.5 border ${darkMode ? 'glass-card border-white/10' : 'bg-white border-black/5'}`}>
                    <button
                      onClick={() => { onView(tournament); setShowMenu(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold transition-all ${darkMode ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
                    >
                      <Eye className="w-4 h-4 text-emerald-400/70" />
                      <span>Inspeccionar</span>
                    </button>
                    
                    <button
                      onClick={() => { onEdit(tournament); setShowMenu(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold transition-all ${darkMode ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
                    >
                      <Edit className="w-4 h-4 text-blue-400/70" />
                      <span>Editar Registro</span>
                    </button>
                    
                    <div className={`h-px my-1.5 mx-2 ${darkMode ? 'bg-white/5' : 'bg-zinc-100'}`}></div>
                    <div className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-gray-500' : 'text-zinc-400'}`}>Actualizar Fase</div>
                    {getStatusOptions(tournament.status).map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          onUpdateStatus(tournament.id, status);
                          setShowMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-1.5 text-xs font-semibold transition-all capitalize ${darkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          status === 'activo' ? 'bg-emerald-500' : 
                          status === 'pendiente' ? 'bg-amber-500' : 
                          status === 'terminado' ? 'bg-blue-500' : 'bg-red-500'
                        }`}></div>
                        <span>{status}</span>
                      </button>
                    ))}
                    
                    <div className={`h-px my-1.5 mx-2 ${darkMode ? 'bg-white/5' : 'bg-zinc-100'}`}></div>
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de que quieres eliminar este torneo?')) {
                          onDelete(tournament.id);
                        }
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold transition-all ${darkMode ? 'text-red-400/70 hover:bg-red-500/10 hover:text-red-400' : 'text-red-500 hover:bg-red-50 hover:text-red-600'}`}
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
  onUpdateStatus,
  darkMode
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

      <div className={`hidden md:block rounded-3xl overflow-hidden shadow-2xl border ${darkMode ? 'glass-card border-white/5' : 'bg-white border-black/5'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'bg-white/5 border-white/5' : 'bg-zinc-50 border-zinc-100'}`}>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Información del Torneo</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ubicación</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cronograma</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estado Actual</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Responsable</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recursos</th>
                <th className="px-6 py-5 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-zinc-100'}`}>
              {tournaments.map((tournament, idx) => (
                <TournamentRow 
                  key={tournament.id}
                  tournament={tournament}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdateStatus={handleStatusChange}
                  darkMode={darkMode}
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
