import React, { useState, useMemo } from "react";
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
}) => {
  const isEditing = !!shipment;
  const [showForm, setShowForm] = useState(isOpen);

  const estadosMexico = [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "CDMX",
    "Coahuila",
    "Colima",
    "Durango",
    "Estado de México",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas",
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
    origin: shipment?.origin || "", // Nuevo campo origen
    destination: shipment?.destination || "",
    recipient: shipment?.recipient || "",
    sender: shipment?.sender || "",
    shipper: shipment?.shipper || "", // Nueva persona que envía
    date: shipment?.date || new Date().toISOString().split("T")[0],
    status: shipment?.status || "preparando",
    trackingNumber: shipment?.trackingNumber || `TRK${Date.now()}`,
    extraItems: shipment?.extraItems || "", // Nuevo campo para items extra
  });

  // Cámaras disponibles (que no estén en uso)
  const availableCameras = useMemo(() => {
    // Si no hay remitente seleccionado, no mostrar ninguna cámara
    // Esto previene que se muestre "todo el inventario" por defecto
    if (!formData.shipper) return [];

    return cameras.filter((camera) => {
      const isAvailable =
        camera.status === "disponible" || formData.cameras.includes(camera.id);

      if (!isAvailable) return false;

      // Filtrar estrictamente por asignación al remitente
      return camera.assignedTo === formData.shipper;
    });
  }, [cameras, formData.cameras, formData.shipper]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Si cambia el remitente, limpiar las cámaras seleccionadas para evitar inconsistencias
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
      const result = await onSave(shipmentData);

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
      alert(
        `Error al ${
          isEditing ? "actualizar" : "guardar"
        } el envío. Por favor intenta nuevamente.`
      );
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    onCancel?.();
  };

  if (!showForm && !isEditing) {
    return null;
  }

  if (isEditing && !showForm) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 z-50">
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-none md:rounded-2xl border-x-0 border-t-0 md:border border-white/10 p-4 md:p-6 max-w-4xl w-full h-full md:h-auto md:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {isEditing ? "Editar Envío" : "Nuevo Envío"}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Truck className="w-4 h-4 inline mr-2" />
                ID de Envío
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange("id", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={isEditing}
              />
              <p className="text-xs text-gray-500 mt-1">
                ID consecutivo automático: {getNextShipmentId()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Número de Tracking
              </label>
              <input
                type="text"
                value={formData.trackingNumber}
                onChange={(e) =>
                  handleInputChange("trackingNumber", e.target.value)
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="TRK123456789"
              />
            </div>
          </div>

          {/* Origen, Destino y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Origen *
              </label>
              <select
                required
                value={formData.origin}
                onChange={(e) =>
                  handleInputChange("origin", e.target.value)
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" className="text-white bg-gray-700">
                  Seleccionar origen
                </option>
                {estadosMexico.map((estado) => (
                  <option
                    key={estado}
                    value={estado}
                    className="text-white bg-gray-700"
                  >
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Destino *
              </label>
              <select
                required
                value={formData.destination}
                onChange={(e) =>
                  handleInputChange("destination", e.target.value)
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" className="text-white bg-gray-700">
                  Seleccionar destino
                </option>
                {estadosMexico.map((estado) => (
                  <option
                    key={estado}
                    value={estado}
                    className="text-white bg-gray-700"
                  >
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Fecha de Envío *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Personas: Destinatario y Remitente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Destinatario *
              </label>
              <select
                required
                value={formData.recipient}
                onChange={(e) => handleInputChange("recipient", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" className="text-white bg-gray-700">
                  Seleccionar destinatario
                </option>
                {workers.map((worker) => (
                  <option
                    key={worker.id}
                    value={worker.name}
                    className="text-white bg-gray-700"
                  >
                    {worker.name} - {worker.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Persona que Envía *
              </label>
              <select
                required
                value={formData.shipper}
                onChange={(e) => handleInputChange("shipper", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" className="text-white bg-gray-700">
                  Seleccionar remitente
                </option>
                {workers.map((worker) => (
                  <option
                    key={worker.id}
                    value={worker.name}
                    className="text-white bg-gray-700"
                  >
                    {worker.name} - {worker.state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estado y Remitente (Empresa) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="preparando" className="text-white bg-gray-700">
                  Preparando
                </option>
                <option value="pendiente" className="text-white bg-gray-700">
                  Pendiente
                </option>
                <option value="enviado" className="text-white bg-gray-700">
                  Enviado
                </option>
                <option value="entregado" className="text-white bg-gray-700">
                  Entregado
                </option>
                <option value="cancelado" className="text-white bg-gray-700">
                  Cancelado
                </option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.status === "enviado" &&
                  'Las cámaras cambiarán a estado "EN ENVIO" automáticamente'}
                {formData.status === "entregado" &&
                  "Las cámaras se asignarán automáticamente al destinatario"}
                {formData.status === "cancelado" &&
                  'Las cámaras volverán a estado "disponible"'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Empresa/Remitente
              </label>
              <input
                type="text"
                value={formData.sender}
                onChange={(e) => handleInputChange("sender", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: Almacén Central, Sucursal CDMX, etc."
              />
            </div>
          </div>

          {/* Items Extra */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Items Extra Incluidos
            </label>
            <textarea
              value={formData.extraItems}
              onChange={(e) => handleInputChange("extraItems", e.target.value)}
              rows="3"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Ej: 2 trípodes, 5 cables de alimentación, 1 maletín de herramientas, etc."
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe cualquier item adicional que se incluya en el envío
            </p>
          </div>

          {/* Selección de Cámaras */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-4">
              <Camera className="w-4 h-4 inline mr-2" />
              Cámaras a Incluir ({formData.cameras.length} seleccionadas)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto bg-white/5 rounded-lg p-4">
              {availableCameras.length > 0 ? (
                availableCameras.map((camera) => (
                  <label
                    key={camera.id}
                    className="flex items-center space-x-3 p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.cameras.includes(camera.id)}
                      onChange={() => handleCameraSelection(camera.id)}
                      className="rounded border-white/20"
                    />
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        {camera.id}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {camera.model}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {camera.location}
                      </div>
                      <div
                        className={`text-xs ${
                          camera.status === "disponible"
                            ? "text-green-400"
                            : "text-blue-400"
                        }`}
                      >
                        {camera.status}
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-gray-400">
                  No hay cámaras disponibles para enviar
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Solo se muestran cámaras con estado "disponible"
            </p>
          </div>

          {/* Resumen */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Resumen del Envío</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">ID:</span>
                <span className="text-white ml-2 font-mono">{formData.id}</span>
              </div>
              <div>
                <span className="text-gray-400">Tracking:</span>
                <span className="text-white ml-2 font-mono">
                  {formData.trackingNumber}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Origen:</span>
                <span className="text-white ml-2">
                  {formData.origin || "No especificado"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Destino:</span>
                <span className="text-white ml-2">
                  {formData.destination || "No especificado"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Destinatario:</span>
                <span className="text-white ml-2">
                  {formData.recipient || "No especificado"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Remitente:</span>
                <span className="text-white ml-2">
                  {formData.shipper || "No especificado"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Empresa:</span>
                <span className="text-white ml-2">
                  {formData.sender || "No especificada"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Fecha:</span>
                <span className="text-white ml-2">{formData.date}</span>
              </div>
              <div>
                <span className="text-gray-400">Estado:</span>
                <span className="text-white ml-2 capitalize">
                  {formData.status}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-400">Cámaras incluidas:</span>
                <span className="text-white ml-2">
                  {formData.cameras.length > 0
                    ? formData.cameras.join(", ")
                    : "Ninguna"}
                </span>
              </div>
              {formData.extraItems && (
                <div className="md:col-span-2">
                  <span className="text-gray-400">Items extra:</span>
                  <span className="text-white ml-2">{formData.extraItems}</span>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={
                !formData.destination ||
                !formData.recipient ||
                !formData.date ||
                !formData.shipper
              }
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{isEditing ? "Actualizar Envío" : "Crear Envío"}</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipmentForm;
