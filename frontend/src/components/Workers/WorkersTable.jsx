import React, { useState, memo } from 'react';
import { Eye, MoreVertical, Edit, Trash2 } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';
import WorkerMobileCard from './WorkerMobileCard';

const WorkerRow = memo(({ worker, onEdit, onDelete, onView }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-white">{worker.name}</div>
        <div className="text-xs text-gray-400">ID: {worker.id}</div>
        {worker.specialty && (
          <div className="text-xs text-gray-500">{worker.specialty}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{worker.state}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{worker.phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={worker.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onView(worker)}
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
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-1">
                    <button
                      onClick={() => {
                        onView(worker);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver detalles</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        onEdit(worker);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-400 hover:bg-white/10 rounded-md transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    
                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={() => {
                        onDelete(worker.id);
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

const WorkersTable = ({ workers, onEditWorker, onDeleteWorker, onViewWorker }) => {
  const handleEdit = (worker) => onEditWorker(worker);
  const handleView = (worker) => onViewWorker(worker);
  const handleDelete = (workerId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este trabajador?')) {
      onDeleteWorker(workerId);
    }
  };

  return (
    <>
      <div className="md:hidden space-y-3">
        {workers && workers.length > 0 ? (
          workers.map((worker) => (
            <WorkerMobileCard
              key={worker.id}
              worker={worker}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="bg-black/20 rounded-xl border border-white/10 p-8 text-center text-gray-400">
            No hay trabajadores para mostrar
          </div>
        )}
      </div>

      <div className="hidden md:block bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estatus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {workers && workers.length > 0 ? (
                workers.map(worker => (
                  <WorkerRow 
                    key={worker.id}
                    worker={worker}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                    No hay trabajadores para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default memo(WorkersTable);
