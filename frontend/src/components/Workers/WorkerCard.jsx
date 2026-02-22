import React from "react";
import { X, Mail, Phone, MapPin, Calendar, Camera, User, Edit } from "lucide-react";
import StatusBadge from "../UI/StatusBadge";

const WorkerCard = ({ worker, onClose, onEdit, darkMode = true }) => {
  if (!worker) return null;

  const handleModalClick = (e) => e.stopPropagation();

  const getStatusColor = (status) => {
    switch (status) {
      case "activo": return "text-emerald-400";
      case "disponible": return "text-blue-400";
      case "ocupado": return "text-amber-400";
      case "vacaciones": return "text-orange-400";
      default: return "text-slate-400";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificado";
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in text-left">
      {/* Overlay */}
      <div 
        className={`fixed inset-0 transition-colors duration-500 ${
          darkMode ? 'bg-slate-950/40' : 'bg-slate-900/10'
        }`} 
        onClick={onClose} 
      />

      <div 
        className={`w-full max-w-xl relative z-10 shadow-2xl rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
          darkMode 
            ? 'bg-slate-900 border-white/5' 
            : 'bg-white border-black/5 shadow-slate-300'
        }`}
        onClick={handleModalClick}
      >
        {/* Header Visual */}
        <div className={`h-32 relative overflow-hidden ${darkMode ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
          <div className="absolute inset-0 opacity-20">
            <div className={`absolute top-0 left-0 w-full h-full ${darkMode ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent)]' : 'bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent)]'}`}></div>
          </div>
        </div>

        {/* Content Container */}
        <div className="px-8 pb-8 -mt-16 relative z-10">
          {/* Header Content */}
          <div className="flex items-end justify-between mb-8">
            <div className="flex items-end gap-5">
              <div className={`w-24 h-24 rounded-[2rem] shadow-2xl flex items-center justify-center border-4 ${
                darkMode ? 'bg-slate-800 border-slate-900 text-emerald-400 shadow-black' : 'bg-white border-white text-emerald-500 shadow-slate-200'
              }`}>
                <User className="w-10 h-10" />
              </div>
              <div className="pb-2">
                <div className={`text-2xl font-black uppercase tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{worker.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Operativo:</span>
                  <span className={`text-[10px] font-mono font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{worker.id}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-3 rounded-2xl transition-all duration-300 mb-2 ${
                darkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8 max-h-[55vh] overflow-y-auto custom-scrollbar pr-2">
            {/* Medios de Contacto */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-4 rounded-full ${darkMode ? 'bg-emerald-500/50' : 'bg-emerald-500'}`}></div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Información de Contacto</h4>
              </div>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-3xl border transition-all duration-500 ${darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Teléfono Directo</p>
                      <p className={`text-xs font-mono font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{worker.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Email Corporativo</p>
                      <p className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{worker.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Estado / Plaza</p>
                    <p className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{worker.state}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Perfil Laboral */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-4 rounded-full ${darkMode ? 'bg-blue-500/50' : 'bg-blue-500'}`}></div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Perfil Profesional</h4>
              </div>
              <div className={`grid grid-cols-2 gap-8 p-6 rounded-3xl border transition-all duration-500 ${darkMode ? 'bg-[#0B1120] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Especialidad</span>
                  <p className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{worker.specialty}</p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Estatus Laboral</span>
                  <div className="flex justify-end mt-1">
                    <StatusBadge status={worker.status} />
                  </div>
                </div>
              </div>
            </section>

            {/* Inventario */}
            {worker.camerasAssigned && worker.camerasAssigned.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-4 rounded-full ${darkMode ? 'bg-amber-500/50' : 'bg-amber-500'}`}></div>
                  <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Unidades PIX Asignadas</h4>
                </div>
                <div className={`flex flex-wrap gap-2 p-4 rounded-3xl border transition-all ${darkMode ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                  {worker.camerasAssigned.map((cameraId) => (
                    <div
                      key={cameraId}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                        darkMode ? 'bg-slate-900 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <Camera className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] font-mono font-black">{cameraId}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Metadatos */}
            <section className={`p-6 rounded-3xl border transition-all duration-500 ${darkMode ? 'bg-white/[0.02] border-white/5' : 'border-slate-100 bg-slate-50/50'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-4 h-4 text-slate-500" />
                <h4 className={`text-[9px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Cronología del Operador</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center px-4 py-2 rounded-xl bg-black/5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Alta</span>
                  <span className={`text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{formatDate(worker.createdAt)}</span>
                </div>
                {worker.updatedAt && (
                   <div className="flex justify-between items-center px-4 py-2 rounded-xl bg-black/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Últ. Act</span>
                    <span className={`text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{formatDate(worker.updatedAt)}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => onEdit(worker)}
              className="flex-grow bg-emerald-500 text-white font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
            >
              Modificar Perfil
            </button>
            <button
              onClick={onClose}
              className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 border ${
                darkMode 
                  ? 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
