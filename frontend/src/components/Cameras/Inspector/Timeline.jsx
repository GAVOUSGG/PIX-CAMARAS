import React, { useState } from "react";
import { Calendar, Filter, Search } from "lucide-react";
import EventCard from "./EventCard";

const Timeline = ({ events, onEventClick, onEventDelete, zoomLevel, darkMode = true }) => {
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (events.length === 0) {
    return (
      <div className={`rounded-[2.5rem] border p-20 transition-all duration-500 overflow-hidden relative ${
        darkMode ? 'bg-slate-900 border-white/5 shadow-2xl backdrop-blur-xl' : 'bg-white border-black/5 shadow-xl shadow-slate-200'
      }`}>
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-all duration-500 ${
            darkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100'
          }`}>
            <Calendar className={`w-12 h-12 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <p className={`text-2xl font-black tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Historial vacío
          </p>
          <p className="text-slate-500 font-medium">
            Los eventos aparecerán aquí cuando la cámara sea utilizada en torneos o logística.
          </p>
        </div>
      </div>
    );
  }

  const eventStats = {
    total: events.length,
    shipments: events.filter((e) => e.type === "shipment").length,
    tournaments: events.filter((e) => e.type === "tournament").length,
    returns: events.filter((e) => e.type === "return").length,
    maintenance: events.filter((e) => e.type === "maintenance").length,
  };

  const filteredEvents = events.filter((event) => {
    const matchesType = filterType === "all" || event.type === filterType;
    const matchesSearch =
      searchTerm === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filterOptions = [
    { value: "all", label: "Todos", count: eventStats.total, color: "emerald" },
    { value: "shipment", label: "Envíos", count: eventStats.shipments, color: "blue" },
    { value: "tournament", label: "Torneos", count: eventStats.tournaments, color: "purple" },
    { value: "return", label: "Entregas", count: eventStats.returns, color: "orange" },
    { value: "maintenance", label: "Mantenimiento", count: eventStats.maintenance, color: "slate" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and Filter Controls */}
      <div className={`rounded-3xl border p-6 transition-all duration-500 ${
        darkMode ? 'bg-slate-900 border-white/5 shadow-2xl backdrop-blur-lg' : 'bg-white border-black/5 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl border transition-all duration-500 ${
              darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-500 border-emerald-600 shadow-lg shadow-emerald-500/20'
            }`}>
              <Calendar className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-white'}`} />
            </div>
            <div>
              <h2 className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Evolución Temporal</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                Visualizando {filteredEvents.length} de {events.length} eventos
              </p>
            </div>
          </div>

          <div className="relative group flex-1 lg:max-w-xs">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-500'}`} />
            <input
              type="text"
              placeholder="Identificador, evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 pl-10 transition-all duration-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 group-hover:bg-white/10' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 group-hover:bg-slate-100'
              }`}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterType(option.value)}
              disabled={option.count === 0}
              className={`
                px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border
                ${
                  filterType === option.value
                    ? darkMode
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-lg'
                      : 'bg-emerald-500 border-emerald-600 text-white shadow-lg'
                    : option.count > 0
                    ? darkMode
                      ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    : 'bg-white/5 border-white/5 text-slate-700 cursor-not-allowed opacity-30'
                }
              `}
            >
              {option.label} <span className="ml-1 opacity-50">({option.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className={`rounded-[2.5rem] border p-8 transition-all duration-500 overflow-hidden relative ${
        darkMode ? 'bg-slate-900/30 border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-slate-200'
      }`}>
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Filter className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
            <p className={`text-lg font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No se encontraron eventos</p>
          </div>
        ) : (
          <div className="relative">
            <div className={`absolute left-8 top-0 bottom-0 w-0.5 opacity-20 bg-gradient-to-b from-emerald-500 via-blue-500 to-transparent`}></div>

            <div className="space-y-12 transition-all duration-500" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="relative pl-24 group transition-all duration-500 hover:translate-x-1">
                  {/* Timeline Node */}
                  <div className="absolute left-0 top-0 transition-all duration-500 group-hover:scale-110">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-xl transition-all duration-500 ${
                        darkMode 
                          ? 'bg-slate-950 border-white/10 text-emerald-400 group-hover:border-emerald-500/50' 
                          : 'bg-white border-slate-100 text-emerald-600 group-hover:border-emerald-500/50'
                      }`}>
                        <span className="text-sm font-black uppercase tracking-tighter">
                          #{filteredEvents.length - index}
                        </span>
                      </div>
                      <div className={`absolute -inset-2 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity bg-emerald-500`}></div>
                    </div>
                  </div>

                  <div className={`rounded-3xl border transition-all duration-500 group-hover:shadow-2xl ${
                    darkMode ? 'hover:border-white/10 hover:bg-white/[0.02]' : 'hover:border-black/5 hover:shadow-slate-200'
                  }`}>
                    <EventCard
                      event={event}
                      onClick={() => onEventClick(event)}
                      onEventDelete={onEventDelete}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analytics Summary */}
      <div className={`rounded-3xl border p-6 transition-all duration-500 ${
        darkMode ? 'bg-slate-900/50 border-white/5 shadow-2xl backdrop-blur-lg' : 'bg-white border-black/5 shadow-sm'
      }`}>
        <h3 className={`text-[10px] font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Dashboard Analítico</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Eventos', count: eventStats.total, color: 'emerald' },
            { label: 'Envíos', count: eventStats.shipments, color: 'blue' },
            { label: 'Torneos', count: eventStats.tournaments, color: 'purple' },
            { label: 'Entregas', count: eventStats.returns, color: 'orange' },
            { label: 'Mantenimiento', count: eventStats.maintenance, color: 'slate' }
          ].map((stat, i) => (
            <div 
              key={i}
              className={`p-4 rounded-2xl border transition-all duration-500 ${
                darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-black transition-colors duration-500 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>{stat.count}</p>
              <div className={`h-1 w-8 mt-2 rounded-full bg-${stat.color}-500/50`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
