import React, { useState, useMemo, memo } from 'react';
import StatusBadge from '../UI/StatusBadge';
import { Eye, Activity } from 'lucide-react';
import TournamentDetailsModal from './TournamentDetailsModal';

const ActiveTournaments = memo(({ tournaments, darkMode }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);
  
  const activeTournaments = useMemo(() => 
    tournaments ? tournaments.filter(t => t.status === 'activo') : []
  , [tournaments]);

  return (
    <>
      <div className={`rounded-3xl p-5 lg:p-6 h-full border shadow-lg relative overflow-hidden transition-all duration-500 transform-gpu ${
        darkMode 
          ? 'border-white/5' 
          : 'bg-white border-black/5 shadow-slate-200 shadow-sm'
      }`}>
        <div className={`absolute -right-24 -top-24 w-64 h-64 rounded-full transition-opacity duration-500 pointer-events-none ${darkMode ? 'opacity-40' : 'opacity-10'}`}></div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
             <div className={`p-2 rounded-lg border transition-all duration-500 ${
               darkMode 
                 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                 : 'bg-emerald-50 border-emerald-100 text-emerald-600'
             }`}>
               <Activity className="w-4 h-4" />
             </div>
             <h3 className={`text-lg font-bold tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Torneos Activos</h3>
          </div>

          <span className={`text-[10px] uppercase font-black px-3 py-1.5 rounded-lg border tracking-widest transition-all duration-500 shadow-sm ${
            darkMode 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            {activeTournaments.length} En curso
          </span>
        </div>
        
        <div className="space-y-4 relative z-10">
          {activeTournaments.length > 0 ? (
            activeTournaments.map(tournament => (
              <div 
                key={tournament.id} 
                className={`group/item border p-4 lg:p-5 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden shadow-sm ${
                  darkMode 
                    ? 'bg-white/[0.02] hover:bg-white/[0.04] border-white/5 hover:border-emerald-500/10' 
                    : 'bg-slate-50 border-black/5 hover:border-emerald-500/20 hover:bg-white'
                }`}
                onClick={() => setSelectedTournament(tournament)}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-xl border hidden sm:block shadow-inner transition-colors duration-500 ${darkMode ? 'bg-[#0B1120] border-white/5' : 'bg-white border-black/5'}`}>
                      <StatusBadge status={tournament.status} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-base lg:text-lg mb-0.5 tracking-tight transition-colors duration-300 ${
                        darkMode ? 'text-white group-hover/item:text-emerald-300' : 'text-slate-800 group-hover/item:text-emerald-600'
                      }`}>
                        {tournament.name}
                      </h4>
                      <p className={`text-[10px] lg:text-xs flex items-center gap-1.5 uppercase font-bold tracking-widest transition-colors duration-500 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.8)] animate-pulse"></span>
                        {tournament.location}, {tournament.state}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="text-right hidden sm:block">
                      <p className={`text-sm font-bold transition-colors duration-500 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{tournament.worker}</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mt-0.5">
                        {tournament.cameras?.length || 0} Cámaras
                      </p>
                    </div>
                    
                    <button 
                      className={`p-2.5 rounded-xl transition-all duration-300 border shadow-lg shrink-0 ${
                        darkMode 
                          ? 'bg-white/5 text-slate-400 group-hover/item:text-emerald-400 group-hover/item:bg-emerald-500/10 border-transparent group-hover/item:border-emerald-500/20' 
                          : 'bg-white text-slate-500 group-hover/item:text-emerald-600 group-hover/item:bg-emerald-50 border-black/5 group-hover/item:border-emerald-200'
                      }`}
                      title="Ver Detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`flex flex-col items-center justify-center py-16 text-center opacity-60 rounded-2xl border border-dashed transition-all duration-500 ${
              darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-black/10'
            }`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
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
