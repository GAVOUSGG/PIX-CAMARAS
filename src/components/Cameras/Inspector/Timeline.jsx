import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import EventCard from "./EventCard";

const Timeline = ({ events, onEventClick, onEventDelete, zoomLevel }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    handleScroll();
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
        <div className="text-center text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg">No hay eventos en el historial</p>
          <p className="text-sm mt-1">
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

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Línea de Tiempo
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {events.length} eventos registrados
          </p>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Scroll Buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 p-2 rounded-full shadow-lg transition-all backdrop-blur-sm"
            title="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 p-2 rounded-full shadow-lg transition-all backdrop-blur-sm"
            title="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Events Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-6 px-2 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          style={{ scrollBehavior: "smooth" }}
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "left center",
              }}
              className="flex-shrink-0 relative group/item"
            >
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 border border-white/10 rounded-full flex items-center justify-center text-xs font-bold text-white z-10">
                {events.length - index}
              </div>
              
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEventDelete(event.id);
                }}
                className="absolute -top-2 right-6 w-6 h-6 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/item:opacity-100 z-10"
                title="Eliminar evento"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>

              <EventCard event={event} onClick={() => onEventClick(event)} />
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-5 gap-3 pt-6 border-t border-white/10">
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <div className="text-lg font-bold text-white">{eventStats.total}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="text-lg font-bold text-blue-400">
            {eventStats.shipments}
          </div>
          <div className="text-xs text-blue-400">Envíos</div>
        </div>
        <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="text-lg font-bold text-purple-400">
            {eventStats.tournaments}
          </div>
          <div className="text-xs text-purple-400">Torneos</div>
        </div>
        <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <div className="text-lg font-bold text-orange-400">
            {eventStats.returns}
          </div>
          <div className="text-xs text-orange-400">Devoluciones</div>
        </div>
        <div className="text-center p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
          <div className="text-lg font-bold text-gray-400">
            {eventStats.maintenance}
          </div>
          <div className="text-xs text-gray-400">Mantenimiento</div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
