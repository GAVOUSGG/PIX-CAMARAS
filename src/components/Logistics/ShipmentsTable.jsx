import React, { useState } from "react";
import {
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  Truck,
  Package,
  MapPin,
  Calendar,
  User,
  Hash,
} from "lucide-react";
import StatusBadge from "../UI/StatusBadge";

const ShipmentsTable = ({
  shipments,
  onEditShipment,
  onDeleteShipment,
  onViewShipment,
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

  const handleEdit = (shipment) => {
    console.log("✏️ Editando envío:", shipment);
    onEditShipment(shipment);
    setActionMenu(null);
  };

  const handleDelete = (shipmentId) => {
    console.log("🗑️ Solicitando eliminar envío:", shipmentId);
    if (confirm("¿Estás seguro de que quieres eliminar este envío?")) {
      onDeleteShipment(shipmentId);
    }
    setActionMenu(null);
  };

  const handleView = (shipment) => {
    console.log("👀 Viendo envío:", shipment);
    onViewShipment(shipment);
    setActionMenu(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "enviado":
        return "text-green-400";
      case "preparando":
        return "text-yellow-400";
      case "pendiente":
        return "text-orange-400";
      case "entregado":
        return "text-blue-400";
      case "cancelado":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <>
      <div className="bg-black/20 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID Envío
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cámaras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Destino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Destinatario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Envía
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tracking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {shipments && shipments.length > 0 ? (
                shipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {/* ID Envío */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-white font-mono">
                            {shipment.id}
                          </div>
                          {shipment.sender && (
                            <div className="text-xs text-gray-400">
                              {shipment.sender}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Cámaras */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {shipment.cameras &&
                          shipment.cameras.map((cameraId) => (
                            <span
                              key={cameraId}
                              className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs"
                            >
                              {cameraId}
                            </span>
                          ))}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {shipment.cameras?.length || 0} cámaras
                      </div>
                      {shipment.extraItems && (
                        <div
                          className="text-xs text-yellow-400 mt-1"
                          title={shipment.extraItems}
                        >
                          + items extra
                        </div>
                      )}
                    </td>

                    {/* Destino */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-300">
                          {shipment.destination}
                        </div>
                      </div>
                    </td>

                    {/* Destinatario */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-300">
                          {shipment.recipient}
                        </div>
                      </div>
                    </td>

                    {/* Persona que Envía */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-300">
                          {shipment.shipper}
                        </div>
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-300">
                          {shipment.date}
                        </div>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={shipment.status} />
                    </td>

                    {/* Tracking */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-300 font-mono">
                          {shipment.trackingNumber || "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {/* Botón Ver */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("👀 Click en botón Ver envío");
                            handleView(shipment);
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
                              console.log("📋 Click en menú acciones envío");
                              setActionMenu(
                                actionMenu === shipment.id ? null : shipment.id
                              );
                            }}
                            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {actionMenu === shipment.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50">
                              <div className="p-2">
                                {/* Ver detalles */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleView(shipment);
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>Ver detalles</span>
                                </button>

                                {/* Editar */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(shipment);
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Editar envío</span>
                                </button>

                                {/* Eliminar */}
                                <div className="border-t border-white/10 my-1"></div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(shipment.id);
                                  }}
                                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Eliminar envío</span>
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

export default ShipmentsTable;
