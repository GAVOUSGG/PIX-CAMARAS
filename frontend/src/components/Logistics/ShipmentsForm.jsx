import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Save,
  Truck,
  Package,
  MapPin,
  Calendar,
  User,
  Hash,
  Camera,
  MessageCircle,
} from "lucide-react";

const ShipmentForm = ({
  onSave,
  onCancel,
  shipment = null,
  cameras = [],
  workers = [],
  shipmentsData = [],
  isOpen = false,
  darkMode = true
}) => {
  const isEditing = !!shipment;
  const [showForm, setShowForm] = useState(isOpen);

  const estadosMexico = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
    "Chihuahua", "CDMX", "Coahuila", "Colima", "Durango", "Estado de México",
    "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos",
    "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo",
    "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala",
    "Veracruz", "Yucatán", "Zacatecas",
  ];

  // Calcular el próximo ID consecutivo
  const getNextShipmentId = () => {
    if (shipmentsData && shipmentsData.length > 0) {
      const numericIds = shipmentsData
        .map((s) => {
          const match = s.id.match(/ENV-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter((id) => !isNaN(id));

      const maxId = Math.max(...numericIds, 0);
      return `ENV-${String(maxId + 1).padStart(3, "0")}`;
    }
    return "ENV-001";
  };

  const [formData, setFormData] = useState({
    id: shipment?.id || getNextShipmentId(),
    cameras: shipment?.cameras || [],
    origin: shipment?.origin || "",
    destination: shipment?.destination || "",
    recipient: shipment?.recipient || "",
    sender: shipment?.sender || "",
    shipper: shipment?.shipper || "",
    date: shipment?.date || new Date().toISOString().split("T")[0],
    status: shipment?.status || "preparando",
    trackingNumber: shipment?.trackingNumber || `TRK${Date.now()}`,
    extraItems: shipment?.extraItems || "",
  });

  // Efecto para sincronizar el estado cuando cambia el envío a editar
  useEffect(() => {
    if (shipment) {
      setFormData({
        id: shipment.id || "",
        cameras: shipment.cameras || [],
        origin: shipment.origin || "",
        destination: shipment.destination || "",
        recipient: shipment.recipient || "",
        sender: shipment.sender || "",
        shipper: shipment.shipper || "",
        date: shipment.date || new Date().toISOString().split("T")[0],
        status: shipment.status || "preparando",
        trackingNumber: shipment.trackingNumber || "",
        extraItems: shipment.extraItems || "",
      });
    } else {
      setFormData({
        id: getNextShipmentId(),
        cameras: [],
        origin: "",
        destination: "",
        recipient: "",
        sender: "",
        shipper: "",
        date: new Date().toISOString().split("T")[0],
        status: "preparando",
        trackingNumber: `TRK${Date.now()}`,
        extraItems: "",
      });
    }
  }, [shipment, shipmentsData]);

  // Ordenar trabajadores alfabéticamente
  const sortedWorkers = useMemo(() => {
    return [...workers].sort((a, b) => a.name.localeCompare(b.name));
  }, [workers]);

  // Cámaras disponibles
  const availableCameras = useMemo(() => {
    if (!formData.shipper) return [];

    return cameras.filter((camera) => {
      const isAvailable =
        camera.status === "disponible" || formData.cameras.includes(camera.id);

      if (!isAvailable) return false;

      return camera.assignedTo === formData.shipper;
    });
  }, [cameras, formData.cameras, formData.shipper]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "shipper") {
        newData.cameras = [];
      }
      return newData;
    });
  };

  const handleCameraSelection = (cameraId) => {
    setFormData((prev) => {
      const isSelected = prev.cameras.includes(cameraId);
      const selectedCameras = isSelected
        ? prev.cameras.filter((id) => id !== cameraId)
        : [...prev.cameras, cameraId];

      return { ...prev, cameras: selectedCameras };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const shipmentData = {
      ...formData,
      ...(isEditing && { updatedAt: new Date().toISOString() }),
      ...(!isEditing && { createdAt: new Date().toISOString() }),
    };

    try {
      await onSave(shipmentData);
      setShowForm(false);
      if (!isEditing) {
        setFormData({
          id: getNextShipmentId(),
          cameras: [],
          origin: "",
          destination: "",
          recipient: "",
          sender: "",
          shipper: "",
          date: new Date().toISOString().split("T")[0],
          status: "preparando",
          trackingNumber: `TRK${Date.now()}`,
          extraItems: "",
        });
      }
    } catch (error) {
      alert(`Error al ${isEditing ? "actualizar" : "guardar"} el envío.`);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    onCancel?.();
  };

  if (!showForm) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in text-left">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" 
        onClick={handleCancel} 
      />
      <div 
        className={`relative w-full max-w-5xl border shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden transition-all duration-500 ${
          darkMode ? 'bg-zinc-900 border-white/10 shadow-black' : 'bg-white border-black/5 shadow-zinc-300'
        }`}
      >
        {/* Header */}
        <div className={`p-4 md:p-8 border-b flex items-start sm:items-center justify-between transition-colors duration-500 gap-4 ${darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-zinc-50 bg-zinc-50/50'}`}>
          <div>
            <h3 className={`text-2xl font-black transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'} tracking-tight`}>
              {isEditing ? "Gestión de" : "Nuevo"} <span className="text-emerald-500">Envío</span>
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
              Logística y control de envíos
            </p>
          </div>
          <button
            onClick={handleCancel}
            className={`p-3 transition-all duration-300 ${
              darkMode ? 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6 md:space-y-10">
          {/* Fila 1: ID, Tracking, Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-white' : 'text-zinc-400'}`}>
                <Hash className="w-3.5 h-3.5 inline mr-1" />
                ID de Envío
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange("id", e.target.value)}
                className={`w-full border px-5 py-4 transition-all duration-300 outline-none font-mono ${
                  darkMode 
                    ? 'bg-zinc-950/50 border-white/5 text-zinc-400' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                }`}
                disabled
              />
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-white' : 'text-zinc-400'}`}>
                <Hash className="w-3.5 h-3.5 inline mr-1" />
                Guía de Seguimiento
              </label>
              <input
                type="text"
                value={formData.trackingNumber}
                onChange={(e) => handleInputChange("trackingNumber", e.target.value)}
                className={`w-full border px-5 py-4 transition-all duration-300 outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  darkMode 
                    ? 'bg-zinc-950/50 border-white/5 text-zinc-400 placeholder-zinc-700' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                }`}
                placeholder="TRK_CODE_PIX"
              />
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-white' : 'text-zinc-400'}`}>
                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                Fecha de envío
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={`w-full border px-5 py-4 transition-all duration-300 outline-none ${
                   darkMode 
                  ? 'bg-zinc-950/50 border-white/5 text-zinc-400 scheme-dark' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Sección Ruta */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-1.5 h-6 ${darkMode ? 'bg-blue-500/50' : 'bg-blue-500'}`}></div>
                <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? 'text-white' : 'text-zinc-500'}`}>Información Logística</h4>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-white' : 'text-zinc-400'}`}>Punto de Origen *</label>
                  <select
                    required
                    value={formData.origin}
                    onChange={(e) => handleInputChange("origin", e.target.value)}
                    className={`w-full border px-5 py-4 transition-all duration-300 outline-none ${
                      darkMode 
                        ? 'bg-zinc-950/50 border-white/5 text-zinc-400' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  >
                    <option value="">Seleccionar procedencia</option>
                    {estadosMexico.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-white' : 'text-zinc-400'}`}>Punto de Destino *</label>
                  <select
                    required
                    value={formData.destination}
                    onChange={(e) => handleInputChange("destination", e.target.value)}
                    className={`w-full border px-5 py-4 transition-all duration-300 outline-none ${
                        darkMode 
                      ? 'bg-zinc-950/50 border-white/5 text-zinc-400' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  >
                    <option value="">Seleccionar punto de destino</option>
                    {estadosMexico.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Sección Agentes */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-1.5 h-6 ${darkMode ? 'bg-purple-500/50' : 'bg-purple-500'}`}></div>
                <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? 'text-white' : 'text-zinc-500'}`}>Personas Involucradas</h4>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-white' : 'text-zinc-400'}`}>Persona *</label>
                  <select
                    required
                    value={formData.shipper}
                    onChange={(e) => handleInputChange("shipper", e.target.value)}
                    className={`w-full border px-5 py-4 transition-all duration-300 outline-none ${
                        darkMode 
                      ? 'bg-zinc-950/50 border-white/5 text-zinc-400' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  >
                    <option value="">Seleccionar responsable de salida</option>
                    {sortedWorkers.map(worker => (
                      <option key={worker.id} value={worker.name}>{worker.name} - {worker.state}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-white' : 'text-zinc-400'}`}>Persona Destinataria *</label>
                  <select
                    required
                    value={formData.recipient}
                    onChange={(e) => handleInputChange("recipient", e.target.value)}
                    className={`w-full border px-5 py-4 transition-all duration-300 outline-none ${
                      darkMode 
                        ? 'bg-zinc-950/50 border-white/5 text-zinc-400' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  >
                    <option value="">Seleccionar responsable de recepción</option>
                    {sortedWorkers.map(worker => (
                      <option key={worker.id} value={worker.name}>{worker.name} - {worker.state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Estado y Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-white' : 'text-zinc-400'}`}>Estado Logístico Actual</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className={`w-full border px-5 py-4 transition-all duration-300 outline-none ${
                    darkMode 
                  ? 'bg-zinc-950/50 border-white/5 text-zinc-400' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                }`}
              >
                <option value="preparando">Preparando (Picking)</option>
                <option value="pendiente">Pendiente (A la espera)</option>
                <option value="enviado">Enviado (En Tránsito)</option>
                <option value="entregado">Entregado (Almacenado)</option>
                <option value="cancelado">Cancelado (Anulado)</option>
              </select>
              <div className={`mt-3 p-4 border flex items-center gap-3 transition-colors duration-500 ${darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-zinc-50/50 border-zinc-100'}`}>
                <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                <p className="text-[9px] font-bold uppercase tracking-tight text-zinc-500">
                  {formData.status === "enviado" && 'En camino a su destino'}
                  {formData.status === "entregado" && "Visor recogio las camaras"}
                  {formData.status === "preparando" && "preparando envio"}
                  {formData.status === "pendiente" && "Por definir"}
                  {formData.status === "cancelado" && 'reasignar camaras'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-white' : 'text-zinc-400'}`}>Empresa logística</label>
              <div className="relative group">
                <Truck className={`absolute left-5 top-1/2 -tranzinc-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-zinc-600 group-focus-within:text-emerald-500' : 'text-zinc-400 group-focus-within:text-emerald-600'}`} />
                <input
                  type="text"
                  value={formData.sender}
                  onChange={(e) => handleInputChange("sender", e.target.value)}
                  className={`w-full border pl-12 pr-5 py-4 transition-all duration-300 outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                     darkMode 
                    ? 'bg-zinc-950/50 border-white/5 text-white' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                  placeholder="Potosinos, tres guerras, etc..."
                />
              </div>
            </div>
          </div>

          {/* Items Extra */}
          <div className="space-y-3">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Items Adicionales</label>
            <div className="relative group">
              <Package className={`absolute left-5 top-6 w-4 h-4 transition-colors ${darkMode ? 'text-zinc-600 group-focus-within:text-emerald-500' : 'text-zinc-400 group-focus-within:text-emerald-600'}`} />
              <textarea
                value={formData.extraItems}
                onChange={(e) => handleInputChange("extraItems", e.target.value)}
                rows="3"
                className={`w-full border pl-12 pr-6 py-5 transition-all duration-300 outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none ${
                    darkMode 
                  ? 'bg-zinc-950/50 border-white/5 text-white placeholder-zinc-700' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'
                }`}
                placeholder="Escribe aqui cualquier item adicional"
              />
            </div>
          </div>

          {/* Selección de Cámaras */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-1.5 h-6 ${darkMode ? 'bg-emerald-500/50' : 'bg-emerald-500'}`}></div>
              <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? 'text-white' : 'text-zinc-500'}`}>Camaras a enviar</h4>
            </div>

            <div className={`border transition-all duration-500 ${darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-zinc-50/50 border-zinc-200'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-8 max-h-[350px] overflow-y-auto custom-scrollbar">
                {availableCameras.length > 0 ? (
                  availableCameras.map((camera) => (
                    <button
                      key={camera.id}
                      type="button"
                      onClick={() => handleCameraSelection(camera.id)}
                      className={`p-5 border text-left transition-all duration-300 group relative flex items-start gap-4 ${
                        formData.cameras.includes(camera.id)
                          ? darkMode 
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 ring-2 ring-emerald-500/20' 
                            : 'bg-emerald-500 border-emerald-600 text-white shadow-xl shadow-emerald-500/20'
                          : darkMode
                            ? 'bg-zinc-950/50 border-white/5 text-white hover:border-white/20'
                            : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-400 shadow-sm'
                      }`}
                    >
                      <div className={`p-2 transition-colors duration-300 ${
                         formData.cameras.includes(camera.id)
                         ? darkMode ? 'bg-emerald-500/20' : 'bg-white/20'
                         : darkMode ? 'bg-white/5' : 'bg-zinc-100'
                      }`}>
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black transition-colors duration-300 mb-0.5">{camera.id}</div>
                        <div className="text-[10px] font-bold opacity-60 truncate uppercase tracking-tighter mb-1">{camera.model}</div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 ${
                            camera.status === 'disponible' 
                              ? formData.cameras.includes(camera.id) && !darkMode ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-500'
                              : formData.cameras.includes(camera.id) && !darkMode ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-500'
                          }`}>
                            {camera.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <Package className={`w-16 h-16 mx-auto mb-6 opacity-20 ${darkMode ? 'text-white' : 'text-zinc-900'}`} />
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                      {formData.shipper 
                        ? `El responsable "${formData.shipper}" no posee unidades disponibles para este traspaso` 
                        : "Seleccione un remitente para listar unidades disponibles"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel de Consolidación */}
          <section className={`p-4 md:p-10 border transition-all duration-500 ${
            darkMode ? 'bg-emerald-500/[0.02] border-emerald-500/10' : 'bg-zinc-50 border-zinc-100 shadow-xl shadow-zinc-200/50'
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-10">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Expediente</p>
                <span className={`text-sm font-black font-mono transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{formData.id}</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Tracking</p>
                <span className={`text-sm font-black font-mono transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{formData.trackingNumber || "PENDIENTE"}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Unidades Decl.</p>
                <span className={`text-2xl font-black tracking-tighter ${formData.cameras.length > 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {formData.cameras.length} <span className="text-xs text-zinc-500 font-bold ml-1">PIX_UNITS</span>
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Ruta de Transferencia</p>
                <div className={`flex items-center gap-3 text-xs font-black transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  <span className="uppercase">{formData.origin || "?"}</span>
                  <div className="flex-1 h-px border-t border-dashed border-zinc-500"></div>
                  <Truck className="w-4 h-4 text-emerald-500" />
                  <div className="flex-1 h-px border-t border-dashed border-zinc-500"></div>
                  <span className="uppercase">{formData.destination || "?"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-5 pt-6 md:pt-10">
              <button
                type="submit"
                disabled={!formData.destination || !formData.recipient || !formData.date || !formData.shipper}
                className="w-full sm:w-auto flex-grow bg-emerald-500 text-white font-black py-3 md:py-5 hover:bg-emerald-400 disabled:bg-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xl shadow-emerald-500/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
              >
                {isEditing ? "Consolidar Actualización" : "Autorizar y Lanzar Envío"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={`w-full sm:w-auto px-6 md:px-12 py-3 md:py-5 font-black uppercase tracking-widest text-xs transition-all duration-300 border ${
                  darkMode 
                    ? 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' 
                    : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                Abortar
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ShipmentForm;
