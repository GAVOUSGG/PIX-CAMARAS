import React, { useState } from "react";
import { createPortal } from "react-dom";
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
  darkMode = true,
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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleCancel}
      />
      
      <div className={`relative w-full max-w-3xl border shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden transition-all duration-500 ${
        darkMode ? 'bg-slate-900 border-white/10 shadow-black' : 'bg-white border-black/5 shadow-slate-300'
      }`}>
        <div className={`flex items-center justify-between p-6 md:p-8 border-b transition-colors duration-500 flex-shrink-0 ${
          darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'
        }`}>
          <div>
            <h3 className={`text-xl md:text-2xl font-black tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {isEditing ? "Modificar Unidad PIX" : "Registro de Nueva Unidad"}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
              Configure los parámetros técnicos de la cámara
            </p>
          </div>
          <button
            onClick={handleCancel}
            className={`p-3 transition-all duration-300 ${
              darkMode ? 'hover:bg-white/5 text-slate-500 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          <form id="camera-form" onSubmit={handleSubmit} className="space-y-8">
            {/* ID y Número de Serie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  ID de Cámara *
                </label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  className={`w-full px-4 py-3 text-sm font-bold font-mono transition-all duration-300 outline-none border focus:ring-2 focus:ring-emerald-500/50 ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-emerald-500/50 hover:bg-white/10' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500/50 hover:bg-slate-100'
                  } ${isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="Ej: CS15"
                  disabled={isEditing}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  Número de Serie *
                </label>
                <input
                  type="text"
                  required
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                  className={`w-full px-4 py-3 text-sm font-bold font-mono transition-all duration-300 outline-none border focus:ring-2 focus:ring-emerald-500/50 ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-emerald-500/50 hover:bg-white/10' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500/50 hover:bg-slate-100'
                  }`}
                  placeholder="Ej: HIK123456789"
                />
              </div>
            </div>

            {/* Modelo y Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center">
                  <Camera className="w-3.5 h-3.5 mr-1.5" />
                  Modelo *
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className={`w-full px-4 py-3 text-sm font-bold transition-all duration-300 outline-none border appearance-none focus:ring-2 focus:ring-emerald-500/50 ${
                      darkMode 
                        ? 'bg-white/5 border-white/10 text-emerald-400 focus:border-emerald-500/50 hover:bg-white/10' 
                        : 'bg-slate-50 border-slate-200 text-emerald-600 focus:border-emerald-500/50 hover:bg-slate-100'
                    }`}
                  >
                    {modelosHikvision.map((modelo) => (
                      <option key={modelo} value={modelo} className={darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>
                        {modelo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  Tipo
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className={`w-full px-4 py-3 text-sm font-bold transition-all duration-300 outline-none border appearance-none focus:ring-2 focus:ring-emerald-500/50 ${
                      darkMode 
                        ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50 hover:bg-white/10' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500/50 hover:bg-slate-100'
                    }`}
                  >
                    <option value="Solar" className={darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}> Solar</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Estado y Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  Estatus Cámara
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className={`w-full px-4 py-3 text-sm font-bold transition-all duration-300 outline-none border appearance-none focus:ring-2 focus:ring-emerald-500/50 ${
                      darkMode 
                        ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50 hover:bg-white/10' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500/50 hover:bg-slate-100'
                    }`}
                  >
                    <option value="disponible" className={darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>Disponible en Almacén</option>
                    <option value="en uso" className={darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>Activa / En Uso</option>
                    <option value="en envio" className={darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>En Tránsito / Envío</option>
                    <option value="mantenimiento" className={darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>Mantenimiento Preventivo</option>
                    <option value="reparación" className={darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>Reparación Mayor</option>
                    <option value="dañada" className={darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>Baja Definitiva / Dañada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  Ubicación *
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={`w-full px-4 py-3 text-sm font-bold transition-all duration-300 outline-none border appearance-none focus:ring-2 focus:ring-emerald-500/50 ${
                      darkMode 
                        ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50 hover:bg-white/10' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500/50 hover:bg-slate-100'
                    }`}
                  >
                    <option value="" disabled className={darkMode ? "bg-slate-800 text-slate-400" : "bg-white text-slate-400"}>Seleccionar zona...</option>
                    {estadosMexico.map((estado) => (
                      <option key={estado} value={estado} className={darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SIM y Persona Asignada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center">
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Numero de telefono
                </label>
                <input
                  type="text"
                  value={formData.simNumber}
                  onChange={(e) => handleInputChange("simNumber", e.target.value)}
                  className={`w-full px-4 py-3 text-sm font-bold font-mono transition-all duration-300 outline-none border focus:ring-2 focus:ring-emerald-500/50 ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-emerald-500/50 hover:bg-white/10' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500/50 hover:bg-slate-100'
                  }`}
                  placeholder="Ej: 52 1234 567 890"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5" />
                  Responsable Asignado
                </label>
                <div className="relative">
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                    className={`w-full px-4 py-3 text-sm font-bold transition-all duration-300 outline-none border appearance-none focus:ring-2 focus:ring-emerald-500/50 ${
                      darkMode 
                        ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50 hover:bg-white/10' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500/50 hover:bg-slate-100'
                    }`}
                  >
                    <option value="" className={darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>Ninguno (En Almacén)</option>
                    {[...workers].sort((a, b) => a.name.localeCompare(b.name)).map((worker) => (
                      <option key={worker.id} value={worker.name} className={darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}>
                        {worker.name} ({worker.state})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notas/Observaciones */}
            <div className={`p-6 border transition-colors duration-500 ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                Bitácora de Observaciones
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows="3"
                className={`w-full px-4 py-3 text-sm font-medium transition-all duration-300 outline-none border focus:ring-2 focus:ring-emerald-500/50 resize-none ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-600 focus:border-emerald-500/50 hover:bg-white/10' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500/50 hover:bg-slate-50'
                }`}
                placeholder="Redacte aquí novedades operativas, incidentes, mantenimientos o estado físico del equipo..."
              />
            </div>
            
          </form>
        </div>

        {/* Botones - Footer */}
        <div className={`flex items-center justify-end px-6 md:px-8 py-5 border-t transition-colors duration-500 flex-shrink-0 gap-4 ${
          darkMode ? 'border-white/5 bg-slate-900/50' : 'border-slate-100 bg-white'
        }`}>
          <button
            type="button"
            onClick={handleCancel}
            className={`px-6 py-2.5 font-bold text-sm transition-all duration-300 ${
              darkMode 
                ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="camera-form"
            disabled={!formData.id || !formData.location || !formData.serialNumber}
            className="group px-6 py-2.5 font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>{isEditing ? "Guardar Cambios" : "Confirmar Registro"}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CameraForm;
