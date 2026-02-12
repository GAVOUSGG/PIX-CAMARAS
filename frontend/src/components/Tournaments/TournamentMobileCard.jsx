import React from 'react';
import { Calendar, MapPin, Users, Camera, Eye, Edit, Trash2, MoreVertical, TrendingUp } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const TournamentMobileCard = ({ tournament, onView, onEdit, onDelete, onUpdateStatus }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pendiente', 'activo', 'terminado', 'cancelado'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  return (
    <div className="glass-card rounded-3xl p-5 hover:bg-white/[0.08] transition-all duration-300 relative overflow-hidden group">
      {/* Glow background accent */}
      <div className={`absolute -right-4 -top-4 w-20 h-20 blur-2xl rounded-full pointer-events-none opacity-20 ${
        tournament.status === 'activo' ? 'bg-emerald-500' : 
        tournament.status === 'pendiente' ? 'bg-yellow-500' : 'bg-blue-500'
      }`}></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate">{tournament.name}</div>
          <div className="text-xs text-gray-500 font-medium mt-0.5 truncate uppercase tracking-wider">{tournament.field}</div>
        </div>
        
        <div className="flex items-center gap-1.5 ml-2">
           <button
             onClick={() => onView(tournament)}
             className="p-2.5 text-gray-400 hover:text-emerald-400 bg-white/5 hover:bg-emerald-500/10 rounded-xl transition-all"
           >
             <Eye className="w-5 h-5" />
           </button>
           
           <div className="relative">
             <button
               onClick={() => setShowMenu(!showMenu)}
               className={`p-2.5 rounded-xl transition-all ${showMenu ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
             >
               <MoreVertical className="w-5 h-5" />
             </button>
             
             {showMenu && (
               <>
                 <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                 <div className="absolute right-0 mt-3 w-52 glass-card border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in py-1.5">
                    <button
                      onClick={() => { onView(tournament); setShowMenu(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/5"
                    >
                      <Eye className="w-4 h-4 text-emerald-400/70" />
                      <span>Inspeccionar</span>
                    </button>
                    <button
                      onClick={() => { onEdit(tournament); setShowMenu(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/5"
                    >
                      <Edit className="w-4 h-4 text-blue-400/70" />
                      <span>Editar Registro</span>
                    </button>
                    
                    <div className="h-px bg-white/5 my-1.5 mx-2"></div>
                    {getStatusOptions(tournament.status).map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          onUpdateStatus(tournament.id, status);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-white/5 capitalize"
                      >
                         <div className={`w-1.5 h-1.5 rounded-full ${
                          status === 'activo' ? 'bg-emerald-500' : 
                          status === 'pendiente' ? 'bg-yellow-500' : 'bg-blue-500'
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
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold text-red-400/70 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                 </div>
               </>
             )}
           </div>
        </div>
      </div>

      {/* Info Content */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <StatusBadge status={tournament.status} />
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-tighter bg-white/5 px-2 py-1 rounded-md border border-white/5">
             <TrendingUp className="w-3 h-3 text-emerald-500/50" />
             {tournament.holes || 0} Hoyos
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
             <div className="p-2 bg-blue-500/10 rounded-xl">
               <MapPin className="w-4 h-4 text-blue-400" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Ubicación</p>
               <p className="text-sm text-gray-300 font-medium truncate">{tournament.location}, {tournament.state}</p>
             </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
             <div className="p-2 bg-emerald-500/10 rounded-xl">
               <Calendar className="w-4 h-4 text-emerald-400" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Cronograma</p>
               <p className="text-sm text-gray-300 font-medium truncate">
                {tournament.date} {tournament.endDate && tournament.endDate !== tournament.date && ` al ${tournament.endDate}`}
               </p>
             </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-purple-500/10 rounded-xl">
                 <Users className="w-4 h-4 text-purple-400" />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Responsable</p>
                 <p className="text-sm text-gray-300 font-medium truncate">{tournament.worker || 'Sin asignar'}</p>
               </div>
             </div>
             <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg border border-blue-500/10">
               <Camera className="w-3.5 h-3.5" />
               <span className="text-xs font-bold">{tournament.cameras?.length || 0}</span>
             </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default TournamentMobileCard;
