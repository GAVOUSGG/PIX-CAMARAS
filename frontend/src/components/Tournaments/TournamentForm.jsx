import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Save,
  Calendar,
  MapPin,
  Users,
  Camera,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";

const TournamentForm = ({
  onSave,
  onCancel,
  workers = [],
  cameras = [],
  tournament = null,
  darkMode = true
}) => {
  const isEditing = !!tournament;

  const estadosMexico = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
    "Chihuahua", "CDMX", "Coahuila", "Colima", "Durango", "Estado de México",
    "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos",
    "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo",
    "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala",
    "Veracruz", "Yucatán", "Zacatecas",
  ];

  // Helper functions
  const extractFieldFromLocation = (location) => location?.split(", ")[0] || "";
  const extractCityFromLocation = (location) => location?.split(", ")[1] || "";

  // Form State
  const [formData, setFormData] = useState({
    name: tournament?.name || "",
    state: tournament?.state || "",
    location: extractCityFromLocation(tournament?.location) || "",
    field: tournament?.field || extractFieldFromLocation(tournament?.location) || "",
    holes: tournament?.holes || 0,
    days: tournament?.days || 1,
    startDate: tournament?.date || "",
    workerId: tournament?.workerId?.toString() || "",
    assignedCameras: tournament?.cameras || [],
    status: tournament?.status || "pendiente",
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Derived Data
  const requiredCameras = useMemo(() => (formData.holes || 0) * 2, [formData.holes]);

  const endDate = useMemo(() => {
    if (!formData.startDate || !formData.days) return "";
    const start = new Date(formData.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + parseInt(formData.days) - 1);
    return end.toISOString().split("T")[0];
  }, [formData.startDate, formData.days]);

  const availableWorkers = useMemo(() => {
    if (!formData.state) return [];
    return workers.filter(w => w.state === formData.state && w.status === "disponible");
  }, [formData.state, workers]);

  const selectedWorker = useMemo(() => 
    workers.find(w => w.id.toString() === formData.workerId)
  , [formData.workerId, workers]);

  const workerCameras = useMemo(() => {
    if (!selectedWorker) return [];
    return cameras.filter(camera => 
      ((selectedWorker.camerasAssigned || []).includes(camera.id) || 
       camera.assignedTo === selectedWorker.name) && 
      camera.status === "disponible"
    );
  }, [selectedWorker, cameras]);

  const currentStatus = useMemo(() => {
    if (!formData.startDate || !endDate) return "pendiente";
    const today = new Date();
    today.setHours(0,0,0,0);
    const start = new Date(formData.startDate);
    const end = new Date(endDate);
    
    if (today >= start && today <= end) return "activo";
    if (today > end) return "terminado";
    return "pendiente";
  }, [formData.startDate, endDate]);

  const handleCameraSelection = (cameraId) => {
    setFormData(prev => {
      const isSelected = prev.assignedCameras.includes(cameraId);
      const assignedCameras = isSelected
        ? prev.assignedCameras.filter(id => id !== cameraId)
        : [...prev.assignedCameras, cameraId];
      return { ...prev, assignedCameras };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tournamentData = {
      id: isEditing ? tournament.id : Date.now().toString(),
      name: formData.name,
      location: `${formData.field}, ${formData.location}`,
      state: formData.state,
      date: formData.startDate,
      endDate: endDate,
      status: currentStatus,
      worker: selectedWorker ? selectedWorker.name : "Por asignar",
      workerId: formData.workerId,
      cameras: formData.assignedCameras,
      holes: parseInt(formData.holes),
      days: parseInt(formData.days),
      field: formData.field,
      updatedAt: new Date().toISOString(),
      ...( !isEditing && { createdAt: new Date().toISOString() } )
    };

    try {
      await onSave(tournamentData);
    } catch (error) {
      alert("Error al guardar el torneo.");
    }
  };

  return (
    <div className={`space-y-10 animate-fade-in py-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-8 transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
        <div>
          <h3 className={`text-2xl font-black transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>
            {isEditing ? "Editar" : "Nuevo"} <span className="text-emerald-500">Expediente de Torneo</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
            Gestión y seguimiento de logística deportiva
          </p>
        </div>
        <button
          onClick={onCancel}
          className={`p-3 transition-all duration-300 border ${
            darkMode 
              ? 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white' 
              : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Información Básica */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-1.5 h-6 ${darkMode ? 'bg-emerald-500/50' : 'bg-emerald-500'}`}></div>
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Información Primaria</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Identificador del Torneo *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full border px-5 py-4 transition-all duration-300 outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  darkMode 
                    ? 'bg-slate-950/50 border-white/5 text-white placeholder-slate-600 focus:bg-slate-950' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
                placeholder="Nombre del evento deportivo"
              />
            </div>
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Zona de Cobertura *</label>
              <select
                required
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={`w-full border px-5 py-4 transition-all duration-300 outline-none ${
                  darkMode 
                    ? 'bg-slate-950/50 border-white/5 text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="">Seleccionar estado federativo</option>
                {estadosMexico.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Instalaciones (Campo de Golf) *</label>
              <div className="relative group">
                <MapPin className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-slate-600 group-focus-within:text-emerald-500' : 'text-slate-400 group-focus-within:text-emerald-600'}`} />
                <input
                  type="text"
                  required
                  value={formData.field}
                  onChange={(e) => handleInputChange("field", e.target.value)}
                  className={`w-full border pl-12 pr-5 py-4 transition-all duration-300 outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    darkMode 
                      ? 'bg-slate-950/50 border-white/5 text-white placeholder-slate-600' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                  placeholder="Ubicación técnica del campo"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Sede Ciudad/Localidad *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`w-full border px-5 py-4 transition-all duration-300 outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  darkMode 
                    ? 'bg-slate-950/50 border-white/5 text-white placeholder-slate-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
                placeholder="Entidad municipal"
              />
            </div>
          </div>
        </section>

        {/* Logística y Fechas */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-1.5 h-6 ${darkMode ? 'bg-blue-500/50' : 'bg-blue-500'}`}></div>
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tiempos y Operación</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <Calendar className="w-3.5 h-3.5" /> Inicio de Operaciones *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={`w-full border px-5 py-4 transition-all duration-300 outline-none ${
                  darkMode 
                    ? 'bg-slate-950/50 border-white/5 text-white scheme-dark' 
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Plazo de Duración (Días) *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.days}
                onChange={(e) => handleInputChange("days", e.target.value)}
                className={`w-full border px-5 py-4 transition-all duration-300 outline-none ${
                   darkMode 
                  ? 'bg-slate-950/50 border-white/5 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Cierre Previsto (Fin de Obra)</label>
              <input
                type="date"
                readOnly
                value={endDate}
                className={`w-full border px-5 py-4 transition-all duration-300 outline-none cursor-not-allowed ${
                  darkMode 
                  ? 'bg-white/5 border-white/5 text-slate-500' 
                  : 'bg-slate-100 border-slate-100 text-slate-400'
                }`}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Configuración de Hoyos Logística *</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-3">
              {[1,2,3,4,5,6,7,8,9].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleInputChange("holes", num)}
                  className={`py-4 font-black text-xs transition-all duration-300 border ${
                    formData.holes === num
                      ? darkMode
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-xl shadow-emerald-500/10'
                        : 'bg-emerald-500 border-emerald-600 text-white shadow-xl shadow-emerald-500/20'
                      : darkMode
                        ? 'bg-slate-950/50 border-white/5 text-slate-500 hover:bg-slate-950 hover:text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className={`mt-4 p-4 border flex items-center gap-4 transition-colors duration-500 ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
              <Camera className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <p className="text-[10px] font-black uppercase tracking-[0.1em]">
                Unidades requeridas para despliegue: <span className={`${darkMode ? 'text-white' : 'text-slate-900'} text-xs ml-1`}>{requiredCameras} DISPOSITIVOS</span>
              </p>
            </div>
          </div>
        </section>

        {/* Asignación de Recursos */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-1.5 h-6 ${darkMode ? 'bg-purple-500/50' : 'bg-purple-500'}`}></div>
            <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Recursos Maestros</h4>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <Users className="w-3.5 h-3.5" /> Visor de Campo Asignado
              </label>
              <select
                value={formData.workerId}
                onChange={(e) => handleInputChange("workerId", e.target.value)}
                className={`w-full border px-5 py-4 transition-all duration-300 outline-none ${
                    darkMode 
                  ? 'bg-slate-950/50 border-white/5 text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="">Seleccionar responsable táctico</option>
                {availableWorkers.map(w => (
                  <option key={w.id} value={w.id}>{w.name} - {w.phone} ({w.camerasAssigned?.length || 0} unidades)</option>
                ))}
              </select>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 ml-1">
                Mostrando personal disponible en {formData.state || "la zona seleccionada"}
              </p>
            </div>

            {formData.workerId && (
              <div className={`p-8 border transition-all duration-500 space-y-6 ${darkMode ? 'bg-white/[0.02] border-white/5 shadow-2xl' : 'bg-slate-50/50 border-slate-200 shadow-sm'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h5 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <Camera className="w-4 h-4" /> Selección Táctica de Hardware
                  </h5>
                  <div className={`px-4 py-2 text-[10px] font-black tracking-widest border transition-all duration-500 ${
                    formData.assignedCameras.length >= requiredCameras 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                  }`}>
                    {formData.assignedCameras.length} / {requiredCameras} UNIDADES VINCULADAS
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                  {workerCameras.map(cam => (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => handleCameraSelection(cam.id)}
                      className={`p-4 border text-left transition-all duration-300 group relative ${
                        formData.assignedCameras.includes(cam.id)
                          ? darkMode 
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 ring-2 ring-emerald-500/20' 
                            : 'bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                          : darkMode
                            ? 'bg-slate-950/50 border-white/5 text-slate-500 hover:border-white/20 hover:text-white'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900 shadow-sm'
                      }`}
                    >
                      <div className="text-[11px] font-black transition-colors duration-300 mb-1">{cam.id}</div>
                      <div className="text-[9px] font-bold opacity-60 truncate uppercase tracking-tighter">{cam.model}</div>
                      {formData.assignedCameras.includes(cam.id) && (
                        <CheckCircle className="absolute top-2 right-2 w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                  {workerCameras.length === 0 && (
                    <div className={`col-span-full py-12 text-center border border-dashed transition-all duration-500 ${darkMode ? 'bg-white/[0.01] border-white/10' : 'bg-slate-100/50 border-slate-200'}`}>
                      <Package className={`w-12 h-12 mx-auto mb-4 opacity-20 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">El responsable no tiene unidades asignadas en inventario</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Resumen Final y Acciones */}
        <section className={`p-10 border transition-all duration-500 space-y-8 ${
          darkMode ? 'bg-emerald-500/[0.02] border-emerald-500/10' : 'bg-slate-50 border-slate-100 shadow-xl shadow-slate-200/50'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Estado Previsto</p>
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 ${currentStatus === 'activo' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-amber-500 shadow-lg shadow-amber-500/40'} animate-pulse`}></div>
                <span className={`text-sm font-black uppercase tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{currentStatus}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Cuota Unidades</p>
              <span className={`text-lg font-black tracking-tighter ${formData.assignedCameras.length >= requiredCameras ? 'text-emerald-500' : 'text-amber-500'}`}>
                {formData.assignedCameras.length} <span className="text-xs text-slate-500 ml-1">/ {requiredCameras}</span>
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Complejidad</p>
              <span className={`text-lg font-black tracking-tighter transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {formData.holes || 0} <span className="text-xs text-slate-500 ml-1">HOYOS</span>
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Extensión</p>
              <span className={`text-lg font-black tracking-tighter transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {formData.days || 0} <span className="text-xs text-slate-500 ml-1">DÍAS</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 pt-6">
            <button
              type="submit"
              className="flex-grow bg-emerald-500 text-white font-black py-5 hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
            >
              {isEditing ? "Consolidar Cambios Maestros" : "Autorizar y Generar Expediente"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`px-12 py-5 font-black uppercase tracking-widest text-xs transition-all duration-300 border ${
                darkMode 
                  ? 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              Descartar
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};


export default TournamentForm;
