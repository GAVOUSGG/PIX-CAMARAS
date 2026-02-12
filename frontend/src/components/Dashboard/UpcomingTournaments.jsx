import React, { useState, useMemo } from 'react';
import { Calendar, Trophy, MapPin, Eye } from 'lucide-react';
import TournamentDetailsModal from './TournamentDetailsModal';

const UpcomingTournaments = ({ tournaments }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);

  const upcomingTournaments = useMemo(() => {
    if (!tournaments) return [];
    
    const today = new Date();
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
      <div className="glass-card rounded-3xl p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/10 text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-white">Torneos de la Semana</h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            {upcomingTournaments.length} Próximos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingTournaments.length > 0 ? (
            upcomingTournaments.map(tournament => {
              const dateStr = new Date(tournament.date).toLocaleDateString('es-MX', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              });

              return (
                <div 
                  key={tournament.id} 
                  className="bg-white/5 rounded-2xl border border-white/5 p-4 hover:bg-white/10 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                  onClick={() => setSelectedTournament(tournament)}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center min-w-[50px] py-1 bg-white/5 rounded-xl border border-white/5 text-center">
                        <span className="text-[10px] uppercase text-blue-400 font-bold tracking-tighter">
                          {dateStr.split(' ')[0]}
                        </span>
                        <span className="text-lg font-bold text-white leading-none">
                          {dateStr.split(' ')[1]}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{tournament.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <p className="text-gray-400 text-xs truncate max-w-[120px]">{tournament.location}</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="p-2 rounded-xl bg-white/5 text-gray-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500 hover:text-white shadow-lg"
                      title="Ver Detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Progress/Urgency visual indicator */}
                  <div className="absolute bottom-0 left-0 h-1 bg-blue-500/20 w-full">
                    <div className="h-full bg-blue-500 opacity-50" style={{ width: '10%' }}></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-500 font-medium">No hay torneos programados</p>
              <p className="text-gray-600 text-sm mt-1">Para los próximos 7 días</p>
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
};

export default UpcomingTournaments;
