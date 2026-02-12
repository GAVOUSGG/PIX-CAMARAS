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

const CameraRow = memo(({ camera, onEdit, onDelete, onView, onInspect }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Solar": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Eléctrica": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Híbrida": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getAssignmentBadge = (camera) => {
    if (camera.assignedTo) {
      return (
        <div className="flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-sm text-emerald-400 font-medium">{camera.assignedTo}</div>
            {camera.assignedWorkerId && <div className="text-xs text-emerald-300">ID: {camera.assignedWorkerId}</div>}
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        <UserX className="w-4 h-4 text-gray-400" />
        <span className="text-gray-500 text-sm italic">No asignada</span>
      </div>
    );
  };

  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-white">{camera.id}</div>
            {camera.assignedTo && <div className="text-xs text-emerald-400">En uso</div>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{camera.model}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 w-fit ${getTypeBadgeColor(camera.type)}`}>
          <span>{camera.type}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Hash className="w-4 h-4 text-gray-400" />
          <div className="text-sm text-gray-300 font-mono">{camera.serialNumber}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4 text-gray-400" />
          <div className="text-sm text-gray-300 font-mono">{camera.simNumber || <span className="text-gray-500 italic">N/A</span>}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={camera.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{camera.location}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getAssignmentBadge(camera)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center space-x-2 justify-end">
          <button
            onClick={() => onView(camera)}
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
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-1">
                    <button
                      onClick={() => { onView(camera); setShowMenu(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver detalles</span>
                    </button>

                    <button
                      onClick={() => { onInspect(camera.id); setShowMenu(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-purple-400 hover:bg-white/10 rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver historial</span>
                    </button>

                    <button
                      onClick={() => { onEdit(camera); setShowMenu(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-400 hover:bg-white/10 rounded-md transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>

                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={() => { onDelete(camera.id); setShowMenu(false); }}
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

const CamerasTable = ({
  cameras,
  onEditCamera,
  onDeleteCamera,
  onViewCamera,
  onInspectCamera,
}) => {
  const handleEdit = (camera) => onEditCamera(camera);
  const handleView = (camera) => onViewCamera(camera);
  const handleDelete = (cameraId) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta cámara?")) {
      onDeleteCamera(cameraId);
    }
  };

  return (
    <>
      <div className="md:hidden space-y-3">
        {cameras && cameras.length > 0 ? (
          cameras.map((camera) => (
            <CameraMobileCard
              key={camera.id}
              camera={camera}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onInspect={onInspectCamera}
            />
          ))
        ) : (
          <div className="bg-black/20 rounded-xl border border-white/10 p-8 text-center text-gray-400">
            No hay cámaras para mostrar
          </div>
        )}
      </div>

      <div className="hidden md:block bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">N° Serie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SIM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Asignada a</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {cameras && cameras.length > 0 ? (
                cameras.map((camera) => (
                  <CameraRow 
                    key={camera.id}
                    camera={camera}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onInspect={onInspectCamera}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-400">
                    No hay cámaras para mostrar
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

export default memo(CamerasTable);
