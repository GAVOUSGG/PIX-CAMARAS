import React from 'react';
import { Camera, Hash, MessageCircle, UserCheck, UserX, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const CameraMobileCard = ({ camera, onView, onEdit, onDelete, onInspect, darkMode = true }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Solar":
        return darkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-600 border-amber-100";
      case "Eléctrica":
        return darkMode ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-100";
      case "Híbrida":
        return darkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return darkMode ? "bg-slate-500/10 text-slate-400 border-slate-500/20" : "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 ${
      darkMode ? 'bg-white/[0.02] border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-slate-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`p-2.5 rounded-xl transition-colors duration-500 ${darkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
            <Camera className="w-5 h-5 flex-shrink-0" />
          </div>
          <div className="min-w-0">
            <div className={`text-base font-black transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'} font-mono truncate`}>{camera.id}</div>
            <div className={`text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate`}>{camera.model}</div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 ml-2">
          <button
            onClick={() => onView(camera)}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
            }`}
            title="Ver Detalles"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                darkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className={`absolute right-0 mt-3 w-56 rounded-[1.5rem] border shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-300 ${
                  darkMode ? 'bg-slate-900 border-white/10 shadow-black' : 'bg-white border-black/5'
                }`}>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        onInspect(camera.id);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-purple-400 hover:bg-white/5' : 'text-purple-600 hover:bg-slate-50'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver historial</span>
                    </button>
                    <button
                      onClick={() => {
                        onEdit(camera);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-blue-400 hover:bg-white/5' : 'text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modificar</span>
                    </button>
                    <div className={`border-t my-1 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}></div>
                    <button
                      onClick={() => {
                        onDelete(camera.id);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
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

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${getTypeBadgeColor(camera.type)}`}>
          {camera.type}
        </div>
        <StatusBadge status={camera.status} darkMode={darkMode} />
      </div>

      {/* Info Grid */}
      <div className="space-y-4">
        {/* Serial & SIM */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Hash className={`w-3.5 h-3.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <span className={`font-mono text-[10px] font-black uppercase tracking-tighter transition-colors duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-600'} truncate`}>
              {camera.serialNumber}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className={`w-3.5 h-3.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <span className={`font-mono text-[10px] font-black uppercase tracking-tighter transition-colors duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-600'} truncate`}>
              {camera.simNumber || 'N/A'}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className={`text-[11px] font-bold transition-colors duration-500 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <span className="font-black uppercase tracking-widest text-[9px] opacity-70 mr-1">Ubicación:</span> 
          <span className={darkMode ? 'text-slate-200' : 'text-slate-700'}>{camera.location}</span>
        </div>

        {/* Assignment */}
        <div className={`pt-4 mt-2 border-t flex items-center space-x-3 transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
          {camera.assignedTo ? (
            <>
              <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <UserCheck className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-black uppercase tracking-[0.05em] transition-colors duration-500 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'} truncate`}>
                  {camera.assignedTo}
                </div>
                {(camera.status === "en uso" || camera.status === "en envio") && (
                  <div className={`text-[9px] font-black uppercase tracking-[0.1em] ${camera.status === "en uso" ? "text-rose-500" : "text-blue-500"}`}>
                    {camera.status === "en uso" ? "En torneo activo" : "En proceso de envío"}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <UserX className={`w-4 h-4 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Cámara sin asignación</span>
            </>
          )}
        </div>

        {/* Notes */}
        {camera.notes && (
          <div className={`text-[10px] font-medium leading-relaxed italic transition-colors duration-500 ${darkMode ? 'text-slate-500' : 'text-slate-400'} line-clamp-2`}>
            “{camera.notes}”
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraMobileCard;
