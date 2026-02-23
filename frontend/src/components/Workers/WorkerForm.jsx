import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Save,
  User,
  MapPin,
  Phone,
  Mail,
  Camera,
  CheckCircle,
} from "lucide-react";

const WorkerForm = ({
  onSave,
  onCancel,
  worker = null,
  isOpen = false,
  camerasData = [],
  darkMode = true,
}) => {
  const isEditing = !!worker;
  const [showForm, setShowForm] = useState(isOpen);

  const estadosMexico = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
    "Chihuahua", "CDMX", "Coahuila", "Colima", "Durango", "Estado de México",
    "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos",
    "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo",
    "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala",
    "Veracruz", "Yucatán", "Zacatecas",
  ];

  const [formData, setFormData] = useState({
    name: worker?.name || "",
    state: worker?.state || "",
    phone: worker?.phone || "",
    email: worker?.email || "",
    status: worker?.status || "disponible",
    specialty: worker?.specialty || "Instalación cámaras solares",
    camerasAssigned: worker?.camerasAssigned || [],
  });

  const availableCameras = useMemo(() => {
    const allAvailable = camerasData.filter(
      (camera) => camera.status === "disponible" && camera.location === "Almacén"
    );

    if (isEditing && worker) {
      const currentlyAssigned = camerasData.filter((camera) =>
        worker.camerasAssigned?.includes(camera.id)
      );
      return [...new Set([...allAvailable, ...currentlyAssigned])];
    }

    return allAvailable;
  }, [camerasData, isEditing, worker]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCameraSelection = (cameraId) => {
    setFormData((prev) => ({
      ...prev,
      camerasAssigned: prev.camerasAssigned.includes(cameraId)
        ? prev.camerasAssigned.filter((id) => id !== cameraId)
        : [...prev.camerasAssigned, cameraId]
    }));
  };

  const handleSelectAllCameras = () => {
    setFormData((prev) => ({
      ...prev,
      camerasAssigned: prev.camerasAssigned.length === availableCameras.length
        ? []
        : availableCameras.map((camera) => camera.id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workerId = isEditing ? worker.id : Date.now().toString();
    const workerData = {
      ...(isEditing && { id: workerId }),
      ...formData,
      photo: worker?.photo || "",
      ...(isEditing ? { updatedAt: new Date().toISOString() } : { createdAt: new Date().toISOString() }),
    };

    try {
      await onSave(workerData);
      setShowForm(false);
      if (!isEditing) {
        setFormData({
          name: "", state: "", phone: "", email: "", status: "disponible",
          specialty: "Instalación cámaras solares", camerasAssigned: [],
        });
      }
    } catch (error) {
      alert(`Error al ${isEditing ? "actualizar" : "guardar"} el trabajador.`);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    onCancel?.();
  };

  if (!showForm && !isEditing) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className={`group px-6 py-4 border font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center gap-3 shadow-xl ${
          darkMode 
            ? 'bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-400 ' 
            : 'bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600 shadow-emerald-500/10'
        }`}
      >
        <User className="w-5 h-5 transition-transform group-hover:scale-110" />
        Registrar Operador
      </button>
    );
  }

  if (isEditing && !showForm) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in text-left">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" 
        onClick={handleCancel} 
      />

      <div className={`relative w-full max-w-4xl border shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden transition-all duration-500 ${
        darkMode ? 'bg-slate-900 border-white/10 shadow-black' : 'bg-white border-black/5 shadow-slate-300'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 md:p-8 border-b transition-colors duration-500 flex-shrink-0 ${darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500 text-white'}`}>
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-xl font-black uppercase tracking-widest transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {isEditing ? "Modificar Operador" : "Registro de Operador"}
              </h3>
              <p className="text-xs font-bold text-slate-500 tracking-tight mt-0.5">Rellene los campos con la información del trabajador</p>
            </div>
          </div>
          <button onClick={handleCancel} className={`p-3 transition-all duration-300 ${darkMode ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
          {/* Información General */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-1 h-4 ${darkMode ? 'bg-blue-500/50' : 'bg-blue-500'}`}></div>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-black-400'}`}>Información General</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-black-400'}`}>Nombre Completo</label>
                <div className="relative group">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="text" required value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border font-bold text-sm transition-all focus:ring-2 outline-none ${
                      darkMode ? 'bg-white/5 border-white/5 text-white focus:ring-emerald-500/50' : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-emerald-500/30'
                    }`}
                    placeholder="Ej: Alejandro Gonzalez"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-black-400'}`}>Entidad Federativa</label>
                <div className="relative group">
                  <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <select
                    required value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border font-bold text-sm appearance-none transition-all focus:ring-2 outline-none cursor-pointer ${
                      darkMode ? 'bg-white/5 border-white/5 text-white focus:ring-emerald-500/50' : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-emerald-500/30'
                    }`}
                  >
                    <option value="" disabled className={darkMode ? 'bg-slate-900' : 'bg-white'}>Seleccionar...</option>
                    {estadosMexico.map((estado) => (
                      <option key={estado} value={estado} className={darkMode ? 'bg-slate-900' : 'bg-white'}>{estado}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Contacto & Perfil */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-1 h-4 ${darkMode ? 'bg-purple-500/50' : 'bg-purple-500'}`}></div>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-black-400'}`}>Medios de Contacto</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-black-400'}`}>Telefono</label>
                <div className="relative group">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="tel" required value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border font-mono font-bold text-sm transition-all focus:ring-2 outline-none ${
                      darkMode ? 'bg-white/5 border-white/5 text-white focus:ring-emerald-500/50' : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-emerald-500/30'
                    }`}
                    placeholder="+52 000-000-000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-black-400'}`}>Email</label>
                <div className="relative group">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-slate-500' : 'text-black-400'}`} />
                  <input
                    type="email" required value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 border font-bold text-sm transition-all focus:ring-2 outline-none ${
                      darkMode ? 'bg-white/5 border-white/5 text-white focus:ring-emerald-500/50' : 'bg-slate-50 border-slate-100 text-slate-600 focus:ring-emerald-500/30'
                    }`}
                    placeholder="trabajador@gmail.com"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Estatus Laboral & Especialidad */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-1 h-4 ${darkMode ? 'bg-amber-500/50' : 'bg-amber-500'}`}></div>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-black-400'}`}>Estatus & Roles</h4>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border transition-all duration-500 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-black-400'}`}>Situación Laboral</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className={`w-full px-4 py-4 border font-bold text-sm transition-all appearance-none outline-none cursor-pointer ${
                    darkMode ? 'bg-slate-900 border-white/5 text-white focus:ring-emerald-500/50' : 'bg-white border-slate-100 text-slate-900 focus:ring-emerald-500/30'
                  }`}
                >
                  <option value="disponible">Disponible</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-black-400'}`}>Especialización</label>
                <select
                  value={formData.specialty}
                  onChange={(e) => handleInputChange("specialty", e.target.value)}
                  className={`w-full px-4 py-4 border font-bold text-sm transition-all appearance-none outline-none cursor-pointer ${
                    darkMode ? 'bg-slate-900 border-white/5 text-white focus:ring-emerald-500/50' : 'bg-white border-slate-100 text-slate-900 focus:ring-emerald-500/30'
                  }`}
                >
                  <option value="Instalación cámaras solares">Instalación PIX GOLF</option>
                </select>
              </div>
            </div>
          </section>

          {/* Asignación de Inventario */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-4 ${darkMode ? 'bg-emerald-500/50' : 'bg-emerald-500'}`}></div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-black-400'}`}>Inventario Asignado</h4>
              </div>
              {availableCameras.length > 0 && (
                <button type="button" onClick={handleSelectAllCameras} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${darkMode ? 'text-emerald-500 hover:text-emerald-400' : 'text-emerald-600 hover:text-emerald-700'}`}>
                   <CheckCircle className="w-4 h-4" />
                   {formData.camerasAssigned.length === availableCameras.length ? "Liberar Todo" : "Vincular Todo"}
                </button>
              )}
            </div>

            {availableCameras.length > 0 ? (
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 opacity-70">Camaras disponibles para asignar </p>
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-4 border transition-all ${darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  {availableCameras.map((camera) => (
                    <button
                      key={camera.id} type="button"
                      onClick={() => handleCameraSelection(camera.id)}
                      className={`flex items-start text-left gap-4 p-4 border transition-all duration-300 transform active:scale-95 ${
                        formData.camerasAssigned.includes(camera.id)
                          ? darkMode ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20' : 'bg-emerald-500 border-emerald-600 text-white shadow-lg'
                          : darkMode ? 'bg-slate-900 border-white/5 text-slate-400 hover:border-emerald-500/50' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      <div className={`p-2 transition-colors ${formData.camerasAssigned.includes(camera.id) ? 'bg-white/20' : darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-black font-mono tracking-tighter transition-colors ${formData.camerasAssigned.includes(camera.id) ? 'text-white' : darkMode ? 'text-slate-200' : 'text-slate-900'}`}>{camera.id}</p>
                        <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 opacity-60 ${formData.camerasAssigned.includes(camera.id) ? 'text-white' : 'text-slate-500'}`}>{camera.model}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`text-center py-10 border border-dashed flex flex-col items-center gap-3 ${darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <Camera className="w-10 h-10 text-slate-600 opacity-30" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sin unidades PIX disponibles en Almacén</p>
              </div>
            )}
          </section>

          <section className={`p-6 border transition-all duration-500 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Colaborador</span>
                <p className={`text-xs font-bold font-mono transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{formData.name || 'SIN REGISTRO'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Ubicación Actual</span>
                <p className={`text-xs font-bold transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{formData.state || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Situación</span>
                <p className="text-xs font-black uppercase text-emerald-500 tracking-tighter">{formData.status}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Equipos Vinculados</span>
                <p className={`text-xs font-black transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{formData.camerasAssigned.length} Camaras</p>
              </div>
            </div>
          </section>
        </form>

        {/* Footer */}
        <div className={`flex items-center justify-end px-6 md:px-8 py-5 border-t transition-colors duration-500 flex-shrink-0 gap-4 ${darkMode ? 'border-white/5 bg-slate-900/50' : 'border-slate-100 bg-white'}`}>
          <button
            type="button" onClick={handleCancel}
            className={`px-6 py-2.5 font-bold text-sm transition-all duration-300 ${
              darkMode 
                ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            Cancelar
          </button>
          <button
            type="submit" onClick={handleSubmit}
            disabled={!formData.name || !formData.state || !formData.phone || !formData.email}
            className={`group px-6 py-2.5 font-bold text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 ${
              darkMode 
                ? 'bg-emerald-500 hover:bg-emerald-400' 
                : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>{isEditing ? "Actualizar Expediente" : "Finalizar Registro"}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WorkerForm;
