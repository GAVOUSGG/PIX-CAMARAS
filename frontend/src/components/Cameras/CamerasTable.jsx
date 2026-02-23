import React, { useState, memo } from "react";
import {
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  Camera,
  Hash,
  UserCheck,
  UserX,
  MessageCircle
} from "lucide-react";
import StatusBadge from "../UI/StatusBadge";
import CameraMobileCard from "./CameraMobileCard";

const CameraRow = memo(({ camera, onEdit, onDelete, onView, onInspect, darkMode = true }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getAssignmentBadge = (camera) => {
    if (camera.assignedTo) {
      return (
        <div>
          <div className={`text-xs font-black uppercase tracking-wider transition-colors duration-500 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{camera.assignedTo}</div>
          {camera.assignedWorkerId && <div className="text-[10px] font-bold text-slate-500">ID: {camera.assignedWorkerId}</div>}
        </div>
      );
    }
    return (
      <div className="opacity-60">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">No asignada</span>
      </div>
    );
  };

  return (
    <tr className={`transition-all duration-300 ${darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
      <td className="px-6 py-5 whitespace-nowrap">
        <div>
          <div className={`text-sm font-black font-mono transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{camera.id}</div>
          {camera.assignedTo && <div className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Activa</div>}
        </div>
      </td>


      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Hash className={`w-3.5 h-3.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <div className={`text-xs font-mono font-black tracking-tighter transition-colors duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{camera.serialNumber}</div>
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className={`text-xs font-mono font-black tracking-tighter transition-colors duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{camera.simNumber || <span className="opacity-40 italic">N/A</span>}</div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <StatusBadge status={camera.status} darkMode={darkMode} />
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className={`text-xs font-bold transition-colors duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{camera.location}</div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        {getAssignmentBadge(camera)}
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-right">
        <div className="flex items-center space-x-2 justify-end">
          <button
            onClick={() => onView(camera)}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
            }`}
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
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                darkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className={`absolute right-0 mt-3 w-56 rounded-[1.5rem] border shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-300 ${
                  darkMode ? 'bg-slate-900 border-white/10 shadow-black/50' : 'bg-white border-black/5 shadow-xl'
                }`}>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => { onView(camera); setShowMenu(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-white hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver detalles</span>
                    </button>

                    <button
                      onClick={() => { onInspect(camera.id); setShowMenu(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-purple-400 hover:bg-white/5' : 'text-purple-600 hover:bg-slate-50'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver historial</span>
                    </button>

                    <button
                      onClick={() => { onEdit(camera); setShowMenu(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-blue-400 hover:bg-white/5' : 'text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modificar</span>
                    </button>

                    <div className={`border-t my-1 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}></div>
                    <button
                      onClick={() => { onDelete(camera.id); setShowMenu(false); }}
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

const CamerasTable = ({
  cameras,
  onEditCamera,
  onDeleteCamera,
  onViewCamera,
  onInspectCamera,
  darkMode = true
}) => {
  const handleEdit = (camera) => onEditCamera(camera);
  const handleView = (camera) => onViewCamera(camera);
  const handleDelete = (cameraId) => {
    if (confirm("¿Confirmar baja definitiva de esta unidad PIX?")) {
      onDeleteCamera(cameraId);
    }
  };

  return (
    <>
      <div className="md:hidden space-y-4 p-4">
        {cameras && cameras.length > 0 ? (
          cameras.map((camera) => (
            <CameraMobileCard
              key={camera.id}
              camera={camera}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onInspect={onInspectCamera}
              darkMode={darkMode}
            />
          ))
        ) : (
          <div className={`text-center py-10 rounded-2xl border border-dashed transition-all duration-500 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Sin registros de cámaras</p>
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto min-h-[500px]">
        <table className="w-full border-collapse">
          <thead className={darkMode ? 'bg-white/[0.02]' : 'bg-slate-50/50'}>
            <tr>
              {[
                "ID Unidad", "N° Serie", "SIM", 
                "Estatus", "Ubicación", "Asignada a", "Acciones"
              ].map((h, i) => (
                <th key={h} className={`px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'} ${i === 6 ? 'text-right' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
            {cameras && cameras.length > 0 ? (
              cameras.map((camera) => (
                <CameraRow 
                  key={camera.id}
                  camera={camera}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onInspect={onInspectCamera}
                  darkMode={darkMode}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <Camera className={`w-12 h-12 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
                    <p className="text-[10px] font-black uppercase tracking-widest md:tracking-[0.4em] text-slate-500">Base de datos de unidades vacía</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default memo(CamerasTable);
