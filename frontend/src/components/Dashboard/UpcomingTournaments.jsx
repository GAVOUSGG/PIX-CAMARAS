import React, { useState, useMemo, memo } from 'react';
import { Calendar, MapPin, Eye, Clock } from 'lucide-react';
import TournamentDetailsModal from './TournamentDetailsModal';

const UpcomingTournaments = memo(({ tournaments, darkMode }) => {
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
      <div className={`rounded-3xl p-5 lg:p-6 h-full border shadow-lg relative overflow-hidden transition-all duration-500 transform-gpu ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-900/90 to-[#0B1120] border-white/5' 
          : 'bg-white border-black/5 shadow-slate-200 shadow-sm'
      }`}>
        <div className={`absolute -left-24 -top-24 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-500/5 to-transparent rounded-full transition-opacity duration-500 pointer-events-none ${darkMode ? 'opacity-40' : 'opacity-10'}`}></div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border transition-colors duration-500 ${
              darkMode 
                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                : 'bg-blue-50 border-blue-100 text-blue-600'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
            <h3 className={`text-lg font-bold tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Próximos Torneos</h3>
          </div>
          <span className={`text-[10px] uppercase font-black px-3 py-1.5 rounded-lg border tracking-widest transition-all duration-500 shadow-sm ${
            darkMode 
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
              : 'bg-blue-50 text-blue-600 border-blue-100'
          }`}>
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
                  className={`group/card rounded-2xl border p-5 transition-all duration-300 cursor-pointer relative overflow-hidden shadow-sm ${
                    darkMode 
                      ? 'bg-white/[0.02] hover:bg-white/[0.04] border-white/5 hover:border-blue-500/10' 
                      : 'bg-slate-50 border-black/5 hover:border-blue-500/20 hover:bg-white'
                  }`}
                  onClick={() => setSelectedTournament(tournament)}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start gap-4">
                      
                      {/* Premium Date Calendar Icon */}
                      <div className={`flex flex-col items-center justify-center w-12 py-1.5 rounded-lg border text-center transition-all duration-500 ${
                        darkMode 
                          ? 'bg-gradient-to-b from-blue-500/20 to-blue-500/5 border-blue-500/20' 
                          : 'bg-white border-blue-100'
                      }`}>
                        <span className={`text-[8px] uppercase font-black tracking-widest leading-none mb-0.5 transition-colors duration-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {dayName}
                        </span>
                        <span className={`text-lg font-black leading-none transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {dayNum}
                        </span>
                      </div>

                      <div className="min-w-0 flex flex-col justify-center">
                        <h4 className={`font-bold text-base leading-tight line-clamp-2 transition-colors duration-300 mb-1 ${
                          darkMode ? 'text-white group-hover/card:text-blue-300' : 'text-slate-800 group-hover/card:text-blue-600'
                        }`}>
                          {tournament.name}
                        </h4>
                        <div className="flex items-center gap-1.5 opacity-60">
                          <MapPin className={`w-3.5 h-3.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                          <p className={`text-[10px] uppercase font-bold truncate tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{tournament.location}</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      className={`p-2.5 rounded-xl transition-all duration-300 shadow-lg border shrink-0 ${
                        darkMode 
                          ? 'bg-white/5 text-slate-400 group-hover/card:text-blue-400 group-hover/card:bg-blue-500/10 border-transparent group-hover/card:border-blue-500/20' 
                          : 'bg-white text-slate-500 group-hover/card:text-blue-600 group-hover/card:bg-blue-50 border-black/5 group-hover/card:border-blue-200'
                      }`}
                      title="Ver Detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Subtle Progress indicator */}
                  <div className={`absolute bottom-0 left-0 h-[2px] w-full transition-colors duration-500 ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                    <div className={`h-full opacity-60 transition-all duration-500 ${darkMode ? 'bg-blue-500/20' : 'bg-blue-500/40'}`} style={{width: '100%'}}></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`col-span-full flex flex-col items-center justify-center py-16 text-center opacity-60 rounded-2xl border border-dashed transition-all duration-500 ${
              darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-black/10'
            }`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
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

