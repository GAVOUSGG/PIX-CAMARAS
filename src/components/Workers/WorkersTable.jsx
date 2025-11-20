import React, { useState } from 'react';
import { Eye, MoreVertical, Edit, Trash2, User } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const WorkersTable = ({ workers, onEditWorker, onDeleteWorker, onViewWorker }) => {
  const [actionMenu, setActionMenu] = useState(null);

  const handleEdit = (worker) => {
    console.log("📝 Editando trabajador:", worker);
    onEditWorker(worker);
    setActionMenu(null);
  };

  const handleDelete = (workerId) => {
    console.log("🗑️ Solicitando eliminar trabajador:", workerId);
    if (confirm('¿Estás seguro de que quieres eliminar este trabajador?')) {
      onDeleteWorker(workerId);
    }
    setActionMenu(null);
  };

  const handleView = (worker) => {
    console.log("👀 Viendo trabajador:", worker);
    onViewWorker(worker);
    setActionMenu(null);
  };

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

  return (
    <>
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Teléfono</th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estatus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {workers && workers.length > 0 ? (
                workers.map(worker => (
                  <tr key={worker.id} className="hover:bg-white/5 transition-colors">
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
                        {/* Botón Ver - DEBE funcionar siempre */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Importante: prevenir propagación
                            console.log("👀 Click en botón Ver");
                            handleView(worker);
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
                              console.log("📋 Click en menú acciones");
                              setActionMenu(actionMenu === worker.id ? null : worker.id);
                            }}
                            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {actionMenu === worker.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50"> {/* Aumentado z-index */}
                              <div className="p-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleView(worker);
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>Ver detalles</span>
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(worker);
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Editar trabajador</span>
                                </button>
                                
                                <div className="border-t border-white/10 my-1"></div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(worker.id);
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Eliminar trabajador</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
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

export default WorkersTable;