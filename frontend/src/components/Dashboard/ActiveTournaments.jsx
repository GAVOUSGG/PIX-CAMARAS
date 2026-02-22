import React, { useState, useMemo, memo } from 'react';
import StatusBadge from '../UI/StatusBadge';
import { Eye, Activity } from 'lucide-react';
import TournamentDetailsModal from './TournamentDetailsModal';

const ActiveTournaments = memo(({ tournaments }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);
  
  const activeTournaments = useMemo(() => 
    tournaments ? tournaments.filter(t => t.status === 'activo') : []
  , [tournaments]);

  return (
    <>
      <div className="rounded-3xl p-5 lg:p-6 h-full bg-gradient-to-br from-slate-900/90 to-[#0B1120] border border-white/5 shadow-lg relative overflow-hidden transform-gpu">
        <div className="absolute -right-24 -top-24 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-emerald-500/5 to-transparent rounded-full opacity-40 pointer-events-none"></div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
             <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
               <Activity className="w-4 h-4" />
             </div>
             <h3 className="text-lg font-bold text-white tracking-tight">Torneos Activos</h3>
          </div>

          <span className="text-[10px] uppercase font-black px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            {activeTournaments.length} En curso
          </span>
        </div>
        
        <div className="space-y-4 relative z-10">
          {activeTournaments.length > 0 ? (
            activeTournaments.map(tournament => (
              <div 
                key={tournament.id} 
                className="group/item bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 hover:border-emerald-500/10 p-4 lg:p-5 transition-all duration-300 cursor-pointer relative overflow-hidden shadow-sm"
                onClick={() => setSelectedTournament(tournament)}
              >


                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-[#0B1120] rounded-xl border border-white/5 hidden sm:block shadow-inner">
                      <StatusBadge status={tournament.status} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base lg:text-lg mb-0.5 tracking-tight group-hover/item:text-emerald-300 transition-colors">
                        {tournament.name}
                      </h4>
                      <p className="text-slate-400 text-[10px] lg:text-xs flex items-center gap-1.5 uppercase font-bold tracking-widest">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.8)] animate-pulse"></span>
                        {tournament.location}, {tournament.state}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="text-right hidden sm:block">
                      <p className="text-slate-200 text-sm font-bold">{tournament.worker}</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mt-0.5">
                        {tournament.cameras?.length || 0} Cámaras
                      </p>
                    </div>
                    
                    <button 
                      className="p-2.5 rounded-xl bg-white/5 text-slate-400 group-hover/item:text-emerald-400 group-hover/item:bg-emerald-500/10 transition-all duration-300 border border-transparent group-hover/item:border-emerald-500/20"
                      title="Ver Detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center opacity-60 bg-white/[0.02] rounded-2xl border border-white/5 border-dashed">
              <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm font-bold tracking-wide">No hay torneos activos</p>
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
