import React, { useState, memo } from "react";
import {
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  Truck,
  MapPin,
  Calendar,
  User,
  Hash,
} from "lucide-react";
import StatusBadge from "../UI/StatusBadge";
import ShipmentMobileCard from "./ShipmentMobileCard";

const ShipmentRow = memo(({ shipment, onEdit, onDelete, onView }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "enviado": return "text-green-400";
      case "preparando": return "text-yellow-400";
      case "pendiente": return "text-orange-400";
      case "entregado": return "text-blue-400";
      case "cancelado": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-white font-mono">{shipment.id}</div>
            {shipment.sender && <div className="text-xs text-gray-400">{shipment.sender}</div>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-1">
          {shipment.cameras && shipment.cameras.map((cameraId) => (
            <span key={cameraId} className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] border border-blue-500/20">
              {cameraId}
            </span>
          ))}
        </div>
        <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">
          {shipment.cameras?.length || 0} unidades
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <div className="text-sm text-gray-300">{shipment.destination}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <div className="text-sm text-gray-300">{shipment.recipient}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <div className="text-sm text-gray-300">{shipment.shipper}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div className="text-sm text-gray-300">{shipment.date}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={shipment.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-400">
        {shipment.trackingNumber || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center space-x-2 justify-end">
          <button
            onClick={() => onView(shipment)}
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
                      onClick={() => { onView(shipment); setShowMenu(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver detalles</span>
                    </button>

                    <button
                      onClick={() => { onEdit(shipment); setShowMenu(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-400 hover:bg-white/10 rounded-md transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>

                    <div className="border-t border-white/10 my-1"></div>
                    <div className="px-3 py-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Estado rápido</div>
                    {["preparando", "enviado", "entregado"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          if (shipment.status !== status) onEdit({ ...shipment, status });
                          setShowMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-1.5 text-sm rounded-md transition-colors ${
                          shipment.status === status ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(status).replace("text-", "bg-")}`} />
                        <span className="capitalize">{status}</span>
                      </button>
                    ))}

                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={() => { onDelete(shipment.id); setShowMenu(false); }}
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

const ShipmentsTable = ({
  shipments,
  onEditShipment,
  onDeleteShipment,
  onViewShipment,
}) => {
  const handleEdit = (shipment) => onEditShipment(shipment);
  const handleView = (shipment) => onViewShipment(shipment);
  const handleDelete = (shipmentId) => {
    if (confirm("¿Estás seguro de que quieres eliminar este envío?")) {
      onDeleteShipment(shipmentId);
    }
  };

  return (
    <>
      <div className="md:hidden space-y-3">
        {shipments && shipments.length > 0 ? (
          shipments.map((shipment) => (
            <ShipmentMobileCard
              key={shipment.id}
              shipment={shipment}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="bg-black/20 rounded-xl border border-white/10 p-8 text-center text-gray-400">
            No hay envíos para mostrar
          </div>
        )}
      </div>

      <div className="hidden md:block bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID Envío</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cámaras</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Destino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Destinatario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Persona Envía</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tracking</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {shipments && shipments.length > 0 ? (
                shipments.map((shipment) => (
                  <ShipmentRow 
                    key={shipment.id}
                    shipment={shipment}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-400">
                    No hay envíos para mostrar
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

export default memo(ShipmentsTable);
