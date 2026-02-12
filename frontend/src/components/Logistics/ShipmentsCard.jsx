import React from 'react';
import { X, Truck, Package, MapPin, Calendar, User, Hash, Camera } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const ShipmentCard = ({ shipment, onClose, onEdit }) => {
  if (!shipment) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'enviado': return 'text-green-400';
      case 'preparando': return 'text-yellow-400';
      case 'pendiente': return 'text-orange-400';
      case 'entregado': return 'text-blue-400';
      case 'cancelado': return 'text-red-400';
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{shipment.id}</h3>
              <StatusBadge status={shipment.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Información del envío */}
        <div className="space-y-4">
          {/* Información de Envío */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">Información de Envío</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Destino</span>
                  <p className="text-white">{shipment.destination}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Destinatario</span>
                  <p className="text-white">{shipment.recipient}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Fecha</span>
                  <p className="text-white">{shipment.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Hash className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Tracking</span>
                  <p className="text-white font-mono">{shipment.trackingNumber || 'No asignado'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cámaras Incluidas */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Cámaras Incluidas ({shipment.cameras?.length || 0})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {shipment.cameras && shipment.cameras.length > 0 ? (
                shipment.cameras.map(cameraId => (
                  <span key={cameraId} className="bg-blue-500/20 text-blue-400 px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>{cameraId}</span>
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No hay cámaras en este envío</span>
              )}
            </div>
          </div>

          {/* Información de Origen */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">Información de Origen</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Persona que envía:</span>
                <span className="text-white font-medium">{shipment.shipper || 'Por definir'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Empresa/Transporte:</span>
                <span className="text-white">{shipment.sender || 'Potosinos'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estado:</span>
                <span className={`capitalize ${getStatusColor(shipment.status)}`}>
                  {shipment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Información de Registro */}
          {(shipment.createdAt || shipment.updatedAt) && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Información de Registro</h4>
              <div className="space-y-2 text-sm">
                {shipment.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creado:</span>
                    <span className="text-gray-300">{formatDate(shipment.createdAt)}</span>
                  </div>
                )}
                {shipment.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Actualizado:</span>
                    <span className="text-gray-300">{formatDate(shipment.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => onEdit(shipment)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>Editar Envío</span>
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

export default ShipmentCard;