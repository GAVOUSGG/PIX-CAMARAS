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
    <div className="space-y-10 animate-fade-in py-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            {isEditing ? "Editar" : "Nuevo"} <span className="text-emerald-400">Torneo</span>
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Configuración técnica y operativa
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2.5 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-2xl transition-all border border-white/5"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Información Básica */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Información General</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre del Torneo *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full bg-slate-800/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                placeholder="Ej: Torneo Empresarial CDMX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Estado *</label>
              <select
                required
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full bg-slate-800/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
              >
                <option value="">Seleccionar estado</option>
                {estadosMexico.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Campo de Golf *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={formData.field}
                  onChange={(e) => handleInputChange("field", e.target.value)}
                  className="w-full bg-slate-800/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  placeholder="Ej: Club de Golf Chapultepec"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Ciudad/Localidad *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full bg-slate-800/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                placeholder="Ej: Ciudad de México"
              />
            </div>
          </div>
        </section>

        {/* Logística y Fechas */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Logística y Tiempos</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Fecha de Inicio *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full bg-slate-800/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Días de Duración *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.days}
                onChange={(e) => handleInputChange("days", e.target.value)}
                className="w-full bg-slate-800/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Fecha de Fin</label>
              <input
                type="date"
                readOnly
                value={endDate}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hoyos a cubrir * (2 cámaras por hoyo)</label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[1,2,3,4,5,6,7,8,9,18].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleInputChange("holes", num)}
                  className={`py-3 rounded-xl font-bold text-xs transition-all ${
                    formData.holes === num
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 font-bold mt-2 ml-1">
              Cámaras necesarias: <span className="text-emerald-500">{requiredCameras}</span>
            </p>
          </div>
        </section>

        {/* Asignación de Recursos */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Recursos Asignados</h4>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Users className="w-3 h-3" /> Visor/Trabajador {formData.state && `(Disponibles en ${formData.state})`}
              </label>
              <select
                value={formData.workerId}
                onChange={(e) => handleInputChange("workerId", e.target.value)}
                className="w-full bg-slate-800/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
              >
                <option value="">Seleccionar trabajador (opcional)</option>
                {availableWorkers.map(w => (
                  <option key={w.id} value={w.id}>{w.name} - {w.phone} ({w.camerasAssigned?.length || 0} cámaras)</option>
                ))}
              </select>
            </div>

            {formData.workerId && (
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5" /> Selección de Cámaras
                  </h5>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${formData.assignedCameras.length >= requiredCameras ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {formData.assignedCameras.length} / {requiredCameras} ASIGNADAS
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {workerCameras.map(cam => (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => handleCameraSelection(cam.id)}
                      className={`p-3 rounded-xl border text-left transition-all group ${
                        formData.assignedCameras.includes(cam.id)
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                          : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-black group-hover:text-white transition-colors">{cam.id}</div>
                      <div className="text-[9px] opacity-50 truncate">{cam.model}</div>
                    </button>
                  ))}
                  {workerCameras.length === 0 && (
                    <div className="col-span-full py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                      <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Sin cámaras disponibles</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Resumen Final y Acciones */}
        <section className="bg-emerald-500/[0.03] rounded-3xl p-8 border border-emerald-500/10 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Estado Sugerido</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${currentStatus === 'activo' ? 'bg-emerald-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <span className="text-sm font-black text-white uppercase">{currentStatus}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Cámaras</p>
              <span className={`text-sm font-black ${formData.assignedCameras.length >= requiredCameras ? 'text-emerald-400' : 'text-red-400'}`}>
                {formData.assignedCameras.length} de {requiredCameras}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Operación</p>
              <span className="text-sm font-black text-white">{formData.holes || 0} Hoyos</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Periodo</p>
              <span className="text-sm font-black text-white">{formData.days || 0} Días</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="flex-grow bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.98]"
            >
              {isEditing ? "ACTUALIZAR DATOS DEL TORNEO" : "FINALIZAR Y CREAR TORNEO"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-10 py-4 bg-white/5 text-gray-400 font-bold rounded-2xl hover:text-white hover:bg-white/10 transition-all"
            >
              Cancelar
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};


export default TournamentForm;
