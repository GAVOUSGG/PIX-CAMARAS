import React, { useState, useMemo, memo } from 'react';
import { Calendar, MapPin, Eye, Clock } from 'lucide-react';
import TournamentDetailsModal from './TournamentDetailsModal';

const UpcomingTournaments = memo(({ tournaments }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);

  const upcomingTournaments = useMemo(() => {
    if (!tournaments) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const parseLocalDate = (dateStr) => {
      if (!dateStr) return new Date();
      const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    return tournaments
      .filter(t => {
        if (!t.date || t.status === 'activo') return false;
        const tournamentDate = parseLocalDate(t.date);
        return tournamentDate >= today && tournamentDate <= nextWeek;
      })
      .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
  }, [tournaments]);

  return (
    <>
      <div className="rounded-3xl p-5 lg:p-6 h-full bg-gradient-to-br from-slate-900/90 to-[#0B1120] border border-white/5 shadow-lg relative overflow-hidden transform-gpu">
        <div className="absolute -left-24 -top-24 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-500/5 to-transparent rounded-full opacity-40 pointer-events-none"></div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Próximos Torneos</h3>
          </div>
          <span className="text-[10px] uppercase font-black px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.1)]">
            {upcomingTournaments.length} En semana
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 relative z-10">
          {upcomingTournaments.length > 0 ? (
            upcomingTournaments.map(tournament => {
              const [year, month, day] = tournament.date.split('T')[0].split('-').map(Number);
              const dateObj = new Date(year, month - 1, day);
              const dayName = dateObj.toLocaleDateString('es-MX', { weekday: 'short' }).replace('.', '');
              const dayNum = dateObj.getDate();

              return (
                <div 
                  key={tournament.id} 
                  className="group/card bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 hover:border-blue-500/10 p-5 transition-all duration-300 cursor-pointer relative overflow-hidden shadow-sm"
                  onClick={() => setSelectedTournament(tournament)}
                >


                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start gap-4">
                      
                      {/* Premium Date Calendar Icon */}
                      <div className="flex flex-col items-center justify-center w-12 py-1.5 bg-gradient-to-b from-blue-500/20 to-blue-500/5 rounded-lg border border-blue-500/20 text-center">
                        <span className="text-[8px] uppercase text-blue-400 font-black tracking-widest leading-none mb-0.5">
                          {dayName}
                        </span>
                        <span className="text-lg font-black text-white leading-none">
                          {dayNum}
                        </span>
                      </div>

                      
                      <div className="min-w-0 flex flex-col justify-center">
                        <h4 className="font-bold text-white text-base leading-tight line-clamp-2 group-hover/card:text-blue-300 transition-colors mb-1">
                          {tournament.name}
                        </h4>
                        <div className="flex items-center gap-1.5 opacity-60">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <p className="text-slate-400 text-[10px] uppercase font-bold truncate tracking-wider">{tournament.location}</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="p-2.5 rounded-xl bg-white/5 text-slate-400 group-hover/card:text-blue-400 group-hover/card:bg-blue-500/10 transition-all duration-300 shadow-lg border border-transparent group-hover/card:border-blue-500/20 shrink-0"
                      title="Ver Detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Subtle Progress indicator */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                    <div className="h-full bg-blue-500/20 w-full opacity-60"></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center opacity-60 bg-white/[0.02] rounded-2xl border border-white/5 border-dashed">
              <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm font-bold tracking-wide">No hay torneos programados</p>
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

export default UpcomingTournaments;

