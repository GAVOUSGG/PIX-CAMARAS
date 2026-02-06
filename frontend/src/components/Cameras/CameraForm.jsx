import React, { useState } from "react";
import {
  X,
  Save,
  Camera,
  MapPin,
  User,
  Wifi,
  MessageCircle,
} from "lucide-react";

const CameraForm = ({
  onSave,
  onCancel,
  camera = null,
  isOpen = false,
  workers = [],
}) => {
  const isEditing = !!camera;
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
    "Almacén",
  ];

  const modelosHikvision = [
    "Hikvision DS-2XS6A25G0-I/CH20S40",
    "Hikvision DS-2XS6825G0-I/CH20S40",
    "Hikvision DS-2XS6A25G0-I/CH20S60",
    "Hikvision DS-2XS6825G0-I/CH20S60",
    "Hikvision DS-2XS6A25G0-I/CH40S40",
    "Hikvision DS-2XS6825G0-I/CH40S40",
  ];

  const [formData, setFormData] = useState({
    id: camera?.id || "",
    model: camera?.model || modelosHikvision[0],
    type: camera?.type || "Solar",
    status: camera?.status || "disponible",
    location: camera?.location || "",
    serialNumber: camera?.serialNumber || "",
    simNumber: camera?.simNumber || "",
    assignedTo: camera?.assignedTo || "",
    notes: camera?.notes || "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cameraData = {
      ...formData,
      ...(isEditing && { updatedAt: new Date().toISOString() }),
      ...(!isEditing && { createdAt: new Date().toISOString() }),
    };

    try {
      const result = await onSave(cameraData);

      setShowForm(false);
      if (!isEditing) {
        setFormData({
          id: "",
          model: modelosHikvision[0],
          type: "Solar",
          status: "disponible",
          location: "",
          serialNumber: "",
          simNumber: "",
          assignedTo: "",
          notes: "",
        });
      }
    } catch (error) {
      alert(
        `Error al ${
          isEditing ? "actualizar" : "guardar"
        } la cámara. Por favor intenta nuevamente.`
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
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-none md:rounded-2xl border-x-0 border-t-0 md:border border-white/10 p-4 md:p-6 max-w-2xl w-full h-full md:h-auto md:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {isEditing ? "Editar Cámara" : "Nueva Cámara Solar"}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID y Número de Serie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                ID de Cámara *
              </label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => handleInputChange("id", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: CS15"
                disabled={isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Número de Serie *
              </label>
              <input
                type="text"
                required
                value={formData.serialNumber}
                onChange={(e) =>
                  handleInputChange("serialNumber", e.target.value)
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: HIK123456789"
              />
            </div>
          </div>

          {/* Modelo y Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Camera className="w-4 h-4 inline mr-2" />
                Modelo *
              </label>
              <select
                required
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {modelosHikvision.map((modelo) => (
                  <option
                    key={modelo}
                    value={modelo}
                    className="text-white bg-gray-700"
                  >
                    {modelo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Solar" className="text-white bg-gray-700">
                  Solar
                </option>
                <option value="Eléctrica" className="text-white bg-gray-700">
                  Eléctrica
                </option>
                <option value="Híbrida" className="text-white bg-gray-700">
                  Híbrida
                </option>
              </select>
            </div>
          </div>

          {/* Estado y Ubicación */}
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
                <option value="disponible" className="text-white bg-gray-700">
                  Disponible
                </option>
                <option value="en uso" className="text-white bg-gray-700">
                  En uso
                </option>
                <option value="en envio" className="text-white bg-gray-700">
                  En envío
                </option>
                <option
                  value="mantenimiento"
                  className="text-white bg-gray-700"
                >
                  Mantenimiento
                </option>
                <option value="reparación" className="text-white bg-gray-700">
                  Reparación
                </option>
                <option value="dañada" className="text-white bg-gray-700">
                  Dañada
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Ubicación *
              </label>
              <select
                required
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" className="text-white bg-gray-700">
                  Seleccionar ubicación
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
          </div>

          {/* SIM y Persona Asignada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Número de SIM
              </label>
              <input
                type="text"
                value={formData.simNumber}
                onChange={(e) => handleInputChange("simNumber", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: 521234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Asignada a
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) =>
                  handleInputChange("assignedTo", e.target.value)
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" className="text-white bg-gray-700">
                  No asignada
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

          {/* Notas/Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Observaciones / Estado de la cámara
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows="3"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Ej: Antena rota, necesita mantenimiento, funciona correctamente, etc."
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe el estado actual de la cámara, problemas, observaciones,
              etc.
            </p>
          </div>

          {/* Resumen */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">
              Resumen de la Cámara
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">ID:</span>
                <span className="text-white ml-2">
                  {formData.id || "Por asignar"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Número de Serie:</span>
                <span className="text-white ml-2">
                  {formData.serialNumber || "No especificado"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Modelo:</span>
                <span className="text-white ml-2">{formData.model}</span>
              </div>
              <div>
                <span className="text-gray-400">Tipo:</span>
                <span className="text-white ml-2">{formData.type}</span>
              </div>
              <div>
                <span className="text-gray-400">Estado:</span>
                <span className="text-white ml-2 capitalize">
                  {formData.status}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Ubicación:</span>
                <span className="text-white ml-2">
                  {formData.location || "No especificada"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">SIM:</span>
                <span className="text-white ml-2">
                  {formData.simNumber || "No especificado"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Asignada a:</span>
                <span className="text-white ml-2">
                  {formData.assignedTo || "No asignada"}
                </span>
              </div>
              {formData.notes && (
                <div className="md:col-span-2">
                  <span className="text-gray-400">Observaciones:</span>
                  <span className="text-white ml-2">{formData.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={
                !formData.id || !formData.location || !formData.serialNumber
              }
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{isEditing ? "Actualizar Cámara" : "Crear Cámara"}</span>
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

export default CameraForm;
