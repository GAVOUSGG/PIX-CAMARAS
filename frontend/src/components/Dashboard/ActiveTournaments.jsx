import React, { useState } from 'react';
import StatusBadge from '../UI/StatusBadge';
import { Eye } from 'lucide-react';
import TournamentDetailsModal from './TournamentDetailsModal';

const ActiveTournaments = ({ tournaments }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const activeTournaments = tournaments ? tournaments.filter(t => t.status === 'activo') : [];

  return (
    <>
      <div className="glass-card rounded-3xl p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Torneos Activos</h3>
          <span className="text-xs font-medium px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            {activeTournaments.length} En curso
          </span>
        </div>
        
        <div className="space-y-3">
          {activeTournaments.length > 0 ? (
            activeTournaments.map(tournament => (
              <div 
                key={tournament.id} 
                className="bg-white/5 rounded-2xl border border-white/5 p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedTournament(tournament)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/10 hidden sm:block">
                      <StatusBadge status={tournament.status} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{tournament.name}</h4>
                      <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        {tournament.location}, {tournament.state}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-white text-sm font-medium">{tournament.worker}</p>
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                        {tournament.cameras?.length || 0} Cámaras asignadas
                      </p>
                    </div>
                    
                    <button 
                      className="p-2.5 rounded-xl bg-white/5 text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg"
                      title="Ver Detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="flex flex-col items-center justify-center py-12 text-center">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                 <Eye className="w-8 h-8 text-gray-600" />
               </div>
               <p className="text-gray-500 font-medium">No hay torneos activos</p>
               <p className="text-gray-600 text-sm mt-1">Todos los sistemas están en espera</p>
             </div>
          )}
        </div>
      </div>


      {sessionStorage && (
         <TournamentDetailsModal 
           tournament={selectedTournament} 
           onClose={() => setSelectedTournament(null)} 
         />
      )}
    </>
  );
};

export default ActiveTournaments;