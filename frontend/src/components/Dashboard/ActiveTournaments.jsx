import React, { useState, useMemo, memo } from 'react';
import StatusBadge from '../UI/StatusBadge';
import { Eye } from 'lucide-react';
import TournamentDetailsModal from './TournamentDetailsModal';

const ActiveTournaments = memo(({ tournaments }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);
  
  const activeTournaments = useMemo(() => 
    tournaments ? tournaments.filter(t => t.status === 'activo') : []
  , [tournaments]);

  return (
    <>
      <div className="glass-card rounded-3xl p-6 h-full transform-gpu">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Torneos Activos</h3>
          <span className="text-[10px] uppercase font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 tracking-wider">
            {activeTournaments.length} En curso
          </span>
        </div>
        
        <div className="space-y-3">
          {activeTournaments.length > 0 ? (
            activeTournaments.map(tournament => (
              <div 
                key={tournament.id} 
                className="bg-white/[0.03] rounded-2xl border border-white/5 p-4 transition-colors duration-200 cursor-pointer"
                onClick={() => setSelectedTournament(tournament)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/10 hidden sm:block">
                      <StatusBadge status={tournament.status} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{tournament.name}</h4>
                      <p className="text-gray-500 text-[10px] flex items-center gap-1 mt-0.5 uppercase font-medium tracking-tight">
                        <span className="w-1 h-1 bg-emerald-500/50 rounded-full"></span>
                        {tournament.location}, {tournament.state}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-white text-sm font-medium">{tournament.worker}</p>
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold opacity-60">
                        {tournament.cameras?.length || 0} Cámaras
                      </p>
                    </div>
                    
                    <button 
                      className="p-2.5 rounded-xl bg-white/5 text-gray-400 transition-colors shadow-lg"
                      title="Ver Detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No hay torneos activos</p>
            </div>
          )}
        </div>
      </div>

      {selectedTournament && (
         <TournamentDetailsModal 
           tournament={selectedTournament} 
           onClose={() => setSelectedTournament(null)} 
         />
      )}
    </>
  );
});

export default ActiveTournaments;
