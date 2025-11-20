import React from "react";
import { X, Mail, Phone, MapPin, Calendar, Camera, User, Edit } from "lucide-react";
import StatusBadge from "../UI/StatusBadge";

const WorkerCard = ({ worker, onClose, onEdit }) => {
  if (!worker) return null;

  // Prevenir que el clic en el modal cierre el overlay
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "activo":
        return "text-green-400";
      case "disponible":
        return "text-blue-400";
      case "ocupado":
        return "text-yellow-400";
      case "vacaciones":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    return new Date(dateString).toLocaleDateString("es-MX");
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose} // Cerrar al hacer clic en el overlay
    >
      <div
        className="bg-slate-800 border border-white/20 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick} // Prevenir que el clic en el modal cierre
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {worker.name}
              </h3>
              <StatusBadge status={worker.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Información del trabajador */}
        <div className="space-y-4">
          {/* Información de contacto */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">
              Información de Contacto
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{worker.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{worker.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{worker.state}</span>
              </div>
            </div>
          </div>

          {/* Información laboral */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">
              Información Laboral
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Especialidad:</span>
                <span className="text-white">{worker.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estado:</span>
                <span className={`capitalize ${getStatusColor(worker.status)}`}>
                  {worker.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ID:</span>
                <span className="text-white">{worker.id}</span>
              </div>
            </div>
          </div>

          {/* Cámaras asignadas */}
          {worker.camerasAssigned && worker.camerasAssigned.length > 0 && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Cámaras Asignadas</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {worker.camerasAssigned.map((cameraId) => (
                  <span
                    key={cameraId}
                    className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs"
                  >
                    {cameraId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Información de Registro</span>
            </h4>
            <div className="space-y-2 text-sm">
              {worker.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Creado:</span>
                  <span className="text-gray-300">
                    {formatDate(worker.createdAt)}
                  </span>
                </div>
              )}
              {worker.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Actualizado:</span>
                  <span className="text-gray-300">
                    {formatDate(worker.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => {
              console.log("✏️ Editando desde tarjeta:", worker);
              onEdit(worker);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
