import React from 'react';
import { X, Camera, Hash, MessageCircle, MapPin, User, Wifi, AlertCircle } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const CameraCard = ({ camera, onClose, onEdit }) => {
  if (!camera) return null;

  // Prevenir que el clic en el modal cierre el overlay
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Solar': return 'text-yellow-400';
      case 'Eléctrica': return 'text-blue-400';
      case 'Híbrida': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'en uso': return 'text-red-400';
      case 'disponible': return 'text-green-400';
      case 'mantenimiento': return 'text-orange-400';
      case 'reparación': return 'text-purple-400';
      case 'dañada': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{camera.id}</h3>
              <StatusBadge status={camera.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Información de la cámara */}
        <div className="space-y-4">
          {/* Información Básica */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">Información Básica</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Camera className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Modelo</span>
                  <p className="text-white">{camera.model}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Wifi className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Tipo</span>
                  <p className={`${getTypeColor(camera.type)}`}>{camera.type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Identificación */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">Identificación</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Hash className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Número de Serie</span>
                  <p className="text-white font-mono">{camera.serialNumber}</p>
                </div>
              </div>
              {camera.simNumber && (
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-gray-400 text-sm">Número de SIM</span>
                    <p className="text-white font-mono">{camera.simNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ubicación y Asignación */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">Ubicación y Asignación</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Ubicación</span>
                  <p className="text-white">{camera.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Asignada a</span>
                  <p className="text-white">{camera.assignedTo || 'No asignada'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estado Detallado */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">Estado del Equipo</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Estado:</span>
                <span className={`capitalize ${getStatusColor(camera.status)}`}>
                  {camera.status}
                </span>
              </div>
              {camera.notes && (
                <div className="mt-3">
                  <span className="text-gray-400 text-sm">Observaciones:</span>
                  <p className="text-white text-sm mt-1 bg-white/10 p-3 rounded-lg">
                    {camera.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información de Registro */}
          {(camera.createdAt || camera.updatedAt) && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Información de Registro</span>
              </h4>
              <div className="space-y-2 text-sm">
                {camera.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creada:</span>
                    <span className="text-gray-300">{formatDate(camera.createdAt)}</span>
                  </div>
                )}
                {camera.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Actualizada:</span>
                    <span className="text-gray-300">{formatDate(camera.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Indicadores de Estado */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">Indicadores</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  camera.status === 'en uso' ? 'bg-red-500' :
                  camera.status === 'disponible' ? 'bg-green-500' :
                  camera.status === 'mantenimiento' ? 'bg-orange-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-gray-400 text-xs">Estado</span>
              </div>
              <div className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  camera.assignedTo ? 'bg-blue-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-gray-400 text-xs">Asignada</span>
              </div>
              <div className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  camera.simNumber ? 'bg-green-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-gray-400 text-xs">SIM Activa</span>
              </div>
              <div className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  camera.notes ? 'bg-yellow-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-gray-400 text-xs">Observaciones</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => onEdit(camera)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>Editar Cámara</span>
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

export default CameraCard;