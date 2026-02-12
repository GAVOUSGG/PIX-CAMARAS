import React from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MapPin, Flag, User, Camera, Layers, Clock } from 'lucide-react';
import StatusBadge from '../UI/StatusBadge';

const TournamentDetailsModal = ({ tournament, onClose }) => {
  if (!tournament) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900 border-b border-white/10 p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{tournament.name}</h2>
              <StatusBadge status={tournament.status} />
            </div>
            <div className="flex items-center text-gray-400 gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{tournament.location}, {tournament.state}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          
          {/* Operación */}
          <section>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Detalles Operativos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Duración</p>
                <div className="flex items-center gap-2">
                   <Clock className="w-5 h-5 text-blue-400" />
                   <span className="text-lg font-medium text-white">
                     {tournament.days} {tournament.days === 1 ? 'Día' : 'Días'}
                   </span>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                 <p className="text-gray-400 text-sm mb-1">Hoyos</p>
                 <div className="flex items-center gap-2">
                   <Flag className="w-5 h-5 text-red-400" />
                   <span className="text-lg font-medium text-white">
                     {tournament.holes > 0 
                       ? `${tournament.holes} ${tournament.holes === 1 ? 'Hoyo' : 'Hoyos'}`
                       : 'Sin asignar'}
                   </span>
                 </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 md:col-span-2">
                 <p className="text-gray-400 text-sm mb-1">Campo</p>
                 <p className="text-lg font-medium text-white">{tournament.field || 'No especificado'}</p>
              </div>
            </div>
          </section>

          {/* Fechas */}
          <section>
             <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
               <Calendar className="w-4 h-4" />
               Fechas
             </h3>
             <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Inicio</p>
                  <p className="text-white font-medium">{tournament.date}</p>
                </div>
                <div>
                   <p className="text-gray-400 text-sm mb-1">Fin</p>
                   <p className="text-white font-medium">{tournament.endDate || tournament.date}</p>
                </div>
             </div>
          </section>

          {/* Recursos */}
          <section>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Recursos Asignados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Personal</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-white font-medium">{tournament.worker || 'Sin asignar'}</span>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Cámaras ({tournament.cameras?.length || 0})</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tournament.cameras && tournament.cameras.length > 0 ? (
                    tournament.cameras.map((cam, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        <Camera className="w-3 h-3" />
                        {cam}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic text-sm">Sin cámaras</span>
                  )}
                </div>
              </div>
            </div>
          </section>
          
        </div>

      </div>
    </div>,
    document.body
  );
};

export default TournamentDetailsModal;
