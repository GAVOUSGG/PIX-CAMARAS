import React, { useState, memo } from 'react';
import { Eye, MoreVertical, Edit, Trash2 } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';
import WorkerMobileCard from './WorkerMobileCard';

const WorkerRow = memo(({ worker, onEdit, onDelete, onView, darkMode = true }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className={`transition-colors duration-300 ${darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex flex-col">
          <div className={`text-sm font-black transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{worker.name}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">ID: {worker.id}</span>
            {worker.specialty && (
              <>
                <span className="text-slate-700 font-black text-[10px]">•</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-emerald-500/70' : 'text-emerald-600'}`}>{worker.specialty}</span>
              </>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className={`text-xs font-bold transition-colors duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{worker.state}</div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className={`text-xs font-mono font-bold transition-colors duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{worker.phone}</div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <StatusBadge status={worker.status} />
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-right">
        <div className="flex items-center space-x-2 justify-end">
          <button 
            onClick={() => onView(worker)}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
            }`}
            title="Visualizar Perfil"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                darkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)}
                />
                <div className={`absolute right-0 mt-3 w-56 rounded-[1.5rem] border shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-300 ${
                  darkMode ? 'bg-slate-900 border-white/10 shadow-black/50' : 'bg-white border-black/5'
                }`}>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        onView(worker);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-white hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'
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
                        darkMode ? 'text-blue-400 hover:bg-white/5' : 'text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modificar</span>
                    </button>
                    
                    <div className={`border-t my-1 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}></div>
                    <button
                      onClick={() => {
                        onDelete(worker.id);
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
      </td>
    </tr>
  );
});

const WorkersTable = ({ workers, onEditWorker, onDeleteWorker, onViewWorker, darkMode = true }) => {
  const handleEdit = (worker) => onEditWorker(worker);
  const handleView = (worker) => onViewWorker(worker);
  const handleDelete = (workerId) => {
    if (confirm('¿Confirmar baja definitiva del operador en el sistema?')) {
      onDeleteWorker(workerId);
    }
  };

  return (
    <>
      <div className="md:hidden space-y-4 p-4">
        {workers && workers.length > 0 ? (
          workers.map((worker) => (
            <WorkerMobileCard
              key={worker.id}
              worker={worker}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              darkMode={darkMode}
            />
          ))
        ) : (
          <div className={`text-center py-10 rounded-2xl border border-dashed ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Sin operadores registrados</p>
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto min-h-[500px]">
        <table className="w-full border-collapse">
          <thead className={darkMode ? 'bg-white/[0.02]' : 'bg-slate-50/50'}>
            <tr>
              {[
                "Información del Operador", "Entidad Federativa", "Contacto", "Estatus Laboral", "Acciones"
              ].map((h, i) => (
                <th key={h} className={`px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'} ${i === 4 ? 'text-right' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
            {workers && workers.length > 0 ? (
              workers.map(worker => (
                <WorkerRow 
                  key={worker.id}
                  worker={worker}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  darkMode={darkMode}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest md:tracking-[0.4em] text-slate-500 opacity-20">Base de datos vacía</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default memo(WorkersTable);
