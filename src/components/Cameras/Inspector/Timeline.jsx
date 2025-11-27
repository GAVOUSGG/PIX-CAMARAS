import React, { useState } from "react";
import { Calendar, Filter, Search } from "lucide-react";
import EventCard from "./EventCard";

const Timeline = ({ events, onEventClick, onEventDelete, zoomLevel }) => {
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (events.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-12">
        <div className="text-center text-gray-400">
          <div className="w-20 h-20 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-emerald-400/50" />
          </div>
          <p className="text-xl font-semibold text-white mb-2">
            No hay eventos en el historial
          </p>
          <p className="text-sm">
            Los eventos aparecerán aquí cuando la cámara sea utilizada
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
    { value: "maintenance", label: "Mantenimiento", count: eventStats.maintenance, color: "gray" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              Historial de Eventos
            </h2>
            <p className="text-gray-400 text-sm mt-2 ml-14">
              {filteredEvents.length} de {events.length} eventos
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all w-full lg:w-64"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterType(option.value)}
              disabled={option.count === 0}
              className={`
                px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border
                ${
                  filterType === option.value
                    ? `bg-${option.color}-500/20 border-${option.color}-500/50 text-${option.color}-300 shadow-lg shadow-${option.color}-500/20`
                    : option.count > 0
                    ? "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                    : "bg-white/5 border-white/10 text-gray-600 cursor-not-allowed opacity-50"
                }
              `}
            >
              <span>{option.label}</span>
              <span className="ml-2 text-xs opacity-75">({option.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p className="text-gray-400">No se encontraron eventos con estos filtros</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 opacity-20"></div>

            {/* Events */}
            <div className="space-y-6">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="relative pl-20"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "left center",
                  }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-6 flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="text-lg font-bold text-emerald-400">
                          {filteredEvents.length - index}
                        </span>
                      </div>
                      <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur-md -z-10"></div>
                    </div>
                  </div>

                  {/* Event Card */}
                  <div className="group/item">
                    <EventCard
                      event={event}
                      onClick={() => onEventClick(event)}
                      onDelete={() => onEventDelete(event.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Resumen Estadístico</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl border border-emerald-500/20">
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {eventStats.total}
            </div>
            <div className="text-xs text-emerald-400/70 font-medium">Total de Eventos</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl border border-blue-500/20">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {eventStats.shipments}
            </div>
            <div className="text-xs text-blue-400/70 font-medium">Envíos</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/20">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {eventStats.tournaments}
            </div>
            <div className="text-xs text-purple-400/70 font-medium">Torneos</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-2xl border border-orange-500/20">
            <div className="text-3xl font-bold text-orange-400 mb-1">
              {eventStats.returns}
            </div>
            <div className="text-xs text-orange-400/70 font-medium">Entregas</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-gray-500/10 to-gray-500/5 rounded-2xl border border-gray-500/20">
            <div className="text-3xl font-bold text-gray-400 mb-1">
              {eventStats.maintenance}
            </div>
            <div className="text-xs text-gray-400/70 font-medium">Mantenimiento</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
