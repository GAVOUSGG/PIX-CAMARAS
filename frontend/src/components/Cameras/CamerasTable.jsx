import React, { useState } from "react";
import {
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  Camera,
  User,
  MessageCircle,
  Hash,
  UserCheck,
  UserX,
} from "lucide-react";
import StatusBadge from "../UI/StatusBadge";
import CameraMobileCard from "./CameraMobileCard";

const CamerasTable = ({
  cameras,
  onEditCamera,
  onDeleteCamera,
  onViewCamera,
  onInspectCamera,
}) => {
  const [actionMenu, setActionMenu] = useState(null);

  // Cerrar menú cuando se hace clic fuera
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActionMenu(null);
    };

    if (actionMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [actionMenu]);

  const handleEdit = (camera) => {
    onEditCamera(camera);
    setActionMenu(null);
  };

  const handleDelete = (cameraId) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta cámara?")) {
      onDeleteCamera(cameraId);
    }
    setActionMenu(null);
  };

  const handleView = (camera) => {
    onViewCamera(camera);
    setActionMenu(null);
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Solar":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Eléctrica":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Híbrida":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Función para obtener el badge de asignación
  const getAssignmentBadge = (camera) => {
    if (camera.assignedTo) {
      return (
        <div className="flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-sm text-emerald-400 font-medium">
              {camera.assignedTo}
            </div>
            {camera.assignedWorkerId && (
              <div className="text-xs text-emerald-300">
                ID: {camera.assignedWorkerId}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2">
          <UserX className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 text-sm italic">No asignada</span>
        </div>
      );
    }
  };

  return (
    <>
      {/* Mobile Card View */}
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

      {/* Desktop Table View */}
      <div className="hidden md:block bg-black/20 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  N° Serie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  SIM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Asignada a
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {cameras && cameras.length > 0 ? (
                cameras.map((camera) => (
                  <tr
                    key={camera.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Camera className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {camera.id}
                          </div>
                          {camera.assignedTo && (
                            <div className="text-xs text-emerald-400">
                              En uso
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Modelo */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {camera.model}
                      </div>
                      {camera.notes && (
                        <div
                          className="text-xs text-gray-500 truncate max-w-xs"
                          title={camera.notes}
                        >
                          {camera.notes}
                        </div>
                      )}
                    </td>

                    {/* Tipo */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 w-fit ${getTypeBadgeColor(
                          camera.type
                        )}`}
                      >
                        <span>{camera.type}</span>
                      </div>
                    </td>

                    {/* Número de Serie */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-300 font-mono">
                          {camera.serialNumber}
                        </div>
                      </div>
                    </td>

                    {/* Número de SIM */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-300 font-mono">
                          {camera.simNumber || (
                            <span className="text-gray-500 italic">N/A</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={camera.status} />
                    </td>

                    {/* Ubicación */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {camera.location}
                      </div>
                    </td>

                    {/* Asignada a - COLUMNA ACTUALIZADA */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAssignmentBadge(camera)}
                      {camera.assignedTo && camera.status === "en uso" && (
                        <div className="text-xs text-red-400 mt-1">
                          ⚡ En torneo activo
                        </div>
                      )}
                      {camera.assignedTo && camera.status === "en envio" && (
                        <div className="text-xs text-blue-400 mt-1">
                          🚚 En envío
                        </div>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {/* Botón Ver */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(camera);
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
                              e.stopPropagation();
                              setActionMenu(
                                actionMenu === camera.id ? null : camera.id
                              );
                            }}
                            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {actionMenu === camera.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50">
                              <div className="p-2">
                                {/* Ver detalles */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleView(camera);
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>Ver detalles</span>
                                </button>

                                {/* Ver historial */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onInspectCamera && onInspectCamera(camera.id);
                                    setActionMenu(null);
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-purple-400 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>Ver historial</span>
                                </button>

                                {/* Editar */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(camera);
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Editar cámara</span>
                                </button>

                                {/* Eliminar */}
                                <div className="border-t border-white/10 my-1"></div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(camera.id);
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Eliminar cámara</span>
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
                  <td
                    colSpan="9"
                    className="px-6 py-4 text-center text-gray-400"
                  >
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

export default CamerasTable;
