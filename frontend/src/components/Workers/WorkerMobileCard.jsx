import React from 'react';
import { User, MapPin, Phone, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const WorkerMobileCard = ({ worker, onView, onEdit, onDelete, darkMode = true }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 ${
      darkMode ? 'bg-white/[0.02] border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-zinc-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`p-2.5 rounded-xl transition-colors duration-500 ${darkMode ? 'bg-white/5 text-zinc-400' : 'bg-zinc-50 text-zinc-500'}`}>
            <User className="w-5 h-5 flex-shrink-0" />
          </div>
          <div className="min-w-0">
            <div className={`text-base font-black transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'} truncate`}>{worker.name}</div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">ID: {worker.id}</div>
            {worker.specialty && (
              <div className={`text-[10px] font-black uppercase tracking-widest truncate ${darkMode ? 'text-emerald-500/70' : 'text-emerald-600'}`}>{worker.specialty}</div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 ml-2">
          <button
            onClick={() => onView(worker)}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
            }`}
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                darkMode ? 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
              }`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className={`absolute right-0 mt-3 w-56 rounded-2xl border shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-300 ${
                  darkMode ? 'bg-zinc-900 border-white/10 shadow-black' : 'bg-white border-black/5'
                }`}>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        onView(worker);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-white hover:bg-white/10' : 'text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-emerald-500" />
                      <span>Ver Perfil</span>
                    </button>
                    <button
                      onClick={() => {
                        onEdit(worker);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-blue-400 hover:bg-white/10' : 'text-blue-600 hover:bg-zinc-50'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modificar</span>
                    </button>
                    <div className={`border-t my-1 ${darkMode ? 'border-white/10' : 'border-zinc-100'}`}></div>
                    <button
                      onClick={() => {
                        if (confirm('¿Confirmar baja definitiva del operador en el sistema?')) {
                          onDelete(worker.id);
                        }
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
                      }`}
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
      </div>

      {/* Status Badge */}
      <div className="mb-5">
        <StatusBadge status={worker.status} />
      </div>

      {/* Info */}
      <div className="space-y-4">
        {/* State */}
        <div className="flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span className={`text-[11px] font-bold transition-colors duration-500 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'} truncate`}>{worker.state}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-3">
          <Phone className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span className={`text-[11px] font-mono font-bold transition-colors duration-500 ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>{worker.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkerMobileCard;
