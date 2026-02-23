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

const ShipmentRow = memo(({ shipment, onEdit, onDelete, onView, darkMode = true }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "enviado": return "text-emerald-400";
      case "preparando": return "text-amber-400";
      case "pendiente": return "text-orange-400";
      case "entregado": return "text-blue-400";
      case "cancelado": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  return (
    <tr className={`transition-colors duration-300 ${darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <Truck className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <div>
            <div className={`text-sm font-black font-mono transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{shipment.id}</div>
            {shipment.sender && <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{shipment.sender}</div>}
          </div>
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
          {shipment.cameras && shipment.cameras.map((cameraId) => (
            <span key={cameraId} className={`px-2 py-0.5 rounded-lg text-[9px] font-black border transition-all duration-300 ${
              darkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              {cameraId}
            </span>
          ))}
        </div>
        <div className="text-[9px] text-slate-500 mt-1.5 uppercase font-black tracking-widest">
          {shipment.cameras?.length || 0} dispositivos DECL.
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <MapPin className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <div className={`text-xs font-bold transition-colors duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{shipment.destination}</div>
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-xs font-bold">
        <div className={`transition-colors duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{shipment.recipient}</div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-xs font-bold">
        <div className={`transition-colors duration-500 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          {shipment.shipper || <span className="text-slate-500 italic opacity-50">No asignado</span>}
        </div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-xs font-bold text-slate-500">
        {shipment.date}
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <StatusBadge status={shipment.status} />
      </td>
      <td className="px-6 py-5 whitespace-nowrap font-mono text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
        {shipment.trackingNumber || "PENDIENTE"}
      </td>
      <td className="px-6 py-5 whitespace-nowrap text-right">
        <div className="flex items-center space-x-2 justify-end">
          <button
            onClick={() => onView(shipment)}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              darkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
            }`}
            title="Visualizar Log"
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
                darkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className={`absolute right-0 mt-3 w-56 rounded-[1.5rem] border shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-300 ${
                  darkMode ? 'bg-slate-900 border-white/10 shadow-black/50' : 'bg-white border-black/5'
                }`}>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => { onView(shipment); setShowMenu(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-white hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-emerald-500" />
                      <span>Ver Detalles</span>
                    </button>

                    <button
                      onClick={() => { onEdit(shipment); setShowMenu(false); }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                        darkMode ? 'text-blue-400 hover:bg-white/5' : 'text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modificar</span>
                    </button>

                    <div className={`border-t my-1 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}></div>
                    <div className="px-4 py-2 text-[9px] text-slate-500 font-black uppercase tracking-widest">Estado Rápido</div>
                    {["preparando", "enviado", "entregado"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          if (shipment.status !== status) onEdit({ ...shipment, status });
                          setShowMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-colors ${
                          shipment.status === status 
                            ? darkMode ? "bg-white/5 text-white" : "bg-slate-100 text-slate-900" 
                            : darkMode ? "text-slate-500 hover:bg-white/5 hover:text-white" : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(status).replace("text-", "bg- shadow-lg ")} shadow-current/50`} />
                        <span className="capitalize">{status}</span>
                      </button>
                    ))}

                    <div className={`border-t my-1 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}></div>
                    <button
                      onClick={() => { onDelete(shipment.id); setShowMenu(false); }}
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

const ShipmentsTable = ({
  shipments,
  onEditShipment,
  onDeleteShipment,
  onViewShipment,
  darkMode = true
}) => {
  const handleEdit = (shipment) => onEditShipment(shipment);
  const handleView = (shipment) => onViewShipment(shipment);
  const handleDelete = (shipmentId) => {
    if (confirm("¿Está seguro de eliminar este registro logístico de forma permanente?")) {
      onDeleteShipment(shipmentId);
    }
  };

  return (
    <>
      <div className="md:hidden space-y-4 p-4">
        {shipments && shipments.length > 0 ? (
          shipments.map((shipment) => (
            <ShipmentMobileCard
              key={shipment.id}
              shipment={shipment}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              darkMode={darkMode}
            />
          ))
        ) : (
          <div className={`text-center py-10 rounded-2xl border border-dashed ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Sin registros disponibles</p>
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto min-h-[500px]">
        <table className="w-full border-collapse">
          <thead className={darkMode ? 'bg-white/[0.02]' : 'bg-slate-50/50'}>
            <tr>
              {[
                "ID Expediente", "Unidades", "Dirección", "Receptor", 
                "Remitente", "Cronograma", "Estatus", "Tracking", "Acciones"
              ].map((h, i) => (
                <th key={h} className={`px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'} ${i === 8 ? 'text-right' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
            {shipments && shipments.length > 0 ? (
              shipments.map((shipment) => (
                <ShipmentRow 
                  key={shipment.id}
                  shipment={shipment}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  darkMode={darkMode}
                />
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <Truck className={`w-12 h-12 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
                    <p className="text-[10px] font-black uppercase tracking-widest md:tracking-[0.4em] text-slate-500">Sin correspondencia en el listado</p>
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

export default memo(ShipmentsTable);
