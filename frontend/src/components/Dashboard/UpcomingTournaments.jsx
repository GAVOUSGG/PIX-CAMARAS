import React, { useState, useMemo, memo } from 'react';
import { Calendar, Trophy, MapPin, Eye } from 'lucide-react';
import TournamentDetailsModal from './TournamentDetailsModal';

const UpcomingTournaments = memo(({ tournaments }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);

  const upcomingTournaments = useMemo(() => {
    if (!tournaments) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return tournaments
      .filter(t => {
        if (t.status === 'activo') return false;
        const tournamentDate = new Date(t.date);
        return tournamentDate >= today && tournamentDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [tournaments]);

  return (
    <>
      <div className="glass-card rounded-3xl p-6 h-full transform-gpu">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/10 text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-white">Torneos de la Semana</h3>
          </div>
          <span className="text-[10px] uppercase font-bold px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 tracking-wider">
            {upcomingTournaments.length} Próximos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingTournaments.length > 0 ? (
            upcomingTournaments.map(tournament => {
              const dateObj = new Date(tournament.date);
              const dayName = dateObj.toLocaleDateString('es-MX', { weekday: 'short' });
              const dayNum = dateObj.getDate();

              return (
                <div 
                  key={tournament.id} 
                  className="bg-white/[0.03] rounded-2xl border border-white/5 p-4 hover:bg-white/10 transition-colors duration-200 group cursor-pointer relative overflow-hidden"
                  onClick={() => setSelectedTournament(tournament)}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center min-w-[50px] py-2 bg-blue-500/10 rounded-xl border border-blue-500/10 text-center">
                        <span className="text-[9px] uppercase text-blue-400 font-black tracking-tighter">
                          {dayName}
                        </span>
                        <span className="text-xl font-black text-white leading-none">
                          {dayNum}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1 text-sm">{tournament.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1 opacity-60">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <p className="text-gray-400 text-[10px] uppercase font-bold truncate">{tournament.location}</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="p-2 rounded-xl bg-white/5 text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-lg"
                      title="Ver Detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Subtle Progress indicator */}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500/10 w-full overflow-hidden">
                    <div className="h-full bg-blue-500/40 w-1/4 rounded-full"></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center opacity-60">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No hay torneos programados</p>
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

