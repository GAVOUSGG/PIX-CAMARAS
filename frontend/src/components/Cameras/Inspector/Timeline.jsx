import React, { useState, useMemo, useCallback } from "react";
import { Calendar, Filter, Search } from "lucide-react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import GraphEventNode from "./GraphEventNode";

const nodeTypes = {
  customEvent: GraphEventNode,
};

const Timeline = ({ events, onEventClick, onEventDelete, zoomLevel, darkMode = true }) => {
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (events.length === 0) {
    return (
      <div className={`rounded-[2.5rem] border p-20 transition-all duration-500 overflow-hidden relative ${
        darkMode ? 'bg-zinc-900 border-white/5 shadow-2xl backdrop-blur-xl' : 'bg-white border-black/5 shadow-xl shadow-zinc-200'
      }`}>
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-all duration-500 ${
            darkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100'
          }`}>
            <Calendar className={`w-12 h-12 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <p className={`text-2xl font-black tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            Historial vacío
          </p>
          <p className="text-zinc-500 font-medium">
            Los eventos aparecerán aquí cuando la cámara sea utilizada en torneos o logística.
          </p>
        </div>
      </div>
    );
  }

  const eventStats = useMemo(() => ({
    total: events.length,
    shipments: events.filter((e) => e.type === "shipment").length,
    tournaments: events.filter((e) => e.type === "tournament").length,
    returns: events.filter((e) => e.type === "return").length,
    maintenance: events.filter((e) => e.type === "maintenance").length,
  }), [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesType = filterType === "all" || event.type === filterType;
      
      if (!matchesType) return false;
      if (searchTerm === "") return true;

      const term = searchTerm.toLowerCase();
      const searchableValues = [
        event.title,
        event.id,
        event.type,
        event.details?.destination,
        event.details?.recipient,
        event.details?.trackingNumber
      ]
        .filter(Boolean)
        .map(v => String(v).toLowerCase());

      return searchableValues.some(val => val.includes(term));
    });
  }, [events, filterType, searchTerm]);

  const filterOptions = [
    { value: "all", label: "Todos", count: eventStats.total, color: "emerald" },
    { value: "shipment", label: "Envíos", count: eventStats.shipments, color: "blue" },
    { value: "tournament", label: "Torneos", count: eventStats.tournaments, color: "purple" },
    { value: "return", label: "Entregas", count: eventStats.returns, color: "orange" },
    { value: "maintenance", label: "Mantenimiento", count: eventStats.maintenance, color: "slate" },
  ];

  // ============================================
  // GRAPH LOGIC (React Flow)
  // ============================================

  const initialNodes = useMemo(() => {
    return filteredEvents.map((event, index) => ({
      id: String(event.id),
      type: 'customEvent',
      position: { x: 250, y: index * 320 }, // Vertical Spacing
      data: {
        event,
        darkMode,
        onClick: onEventClick,
      },
    }));
  }, [filteredEvents, darkMode, onEventClick]);

  const initialEdges = useMemo(() => {
    const edges = [];
    for (let i = 0; i < filteredEvents.length - 1; i++) {
      edges.push({
        id: `e-${filteredEvents[i].id}-${filteredEvents[i + 1].id}`,
        source: String(filteredEvents[i].id),
        target: String(filteredEvents[i + 1].id),
        animated: true,
        style: { stroke: darkMode ? '#10b981' : '#059669', strokeWidth: 2 },
      });
    }
    return edges;
  }, [filteredEvents, darkMode]);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // Sync state if filteredEvents change
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredEvents, darkMode]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="space-y-8 animate-fade-in flex flex-col h-full">
      {/* Header and Filter Controls */}
      <div className={`rounded-3xl border p-6 transition-all duration-500 flex-shrink-0 ${
        darkMode ? 'bg-zinc-900 border-white/5 shadow-2xl backdrop-blur-lg' : 'bg-white border-black/5 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl border transition-all duration-500 ${
              darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-500 border-emerald-600 shadow-lg shadow-emerald-500/20'
            }`}>
              <Calendar className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-white'}`} />
            </div>
            <div>
              <h2 className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Evolución Temporal</h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                Visualizando {filteredEvents.length} de {events.length} eventos
              </p>
            </div>
          </div>

          <div className="relative group flex-1 lg:max-w-xs">
            <Search className={`absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 transition-colors ${darkMode ? 'text-zinc-500 group-focus-within:text-emerald-400' : 'text-zinc-400 group-focus-within:text-emerald-500'}`} />
            <input
              type="text"
              placeholder="Identificador, evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 pl-10 transition-all duration-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white placeholder-zinc-500 group-hover:bg-white/10' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 group-hover:bg-zinc-100'
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
                      ? 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                    : 'bg-white/5 border-white/5 text-zinc-700 cursor-not-allowed opacity-30'
                }
              `}
            >
              {option.label} <span className="ml-1 opacity-50">({option.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Graph Timeline Area */}
      <div className={`rounded-[3rem] border transition-all duration-500 overflow-hidden relative flex-1 min-h-[600px] ${
        darkMode ? 'bg-zinc-900 border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-zinc-200'
      }`}>
        {filteredEvents.length === 0 ? (
          <div className="h-full flex items-center justify-center py-20">
            <div className="text-center">
              <Filter className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-zinc-600' : 'text-zinc-300'}`} />
              <p className={`text-lg font-medium ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>No se encontraron eventos</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full absolute inset-0">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.2}
              maxZoom={1.5}
              proOptions={{ hideAttribution: true }}
            >
              <Background 
                color={darkMode ? '#334155' : '#cbd5e1'} 
                gap={16} 
                size={1} 
              />
              <Controls 
                className={darkMode ? 'bg-zinc-800 text-white fill-white border-white/10' : ''}
                showInteractive={false} 
              />
            </ReactFlow>
          </div>
        )}
      </div>

      {/* Analytics Summary */}
      <div className={`rounded-3xl border p-6 transition-all duration-500 ${
        darkMode ? 'bg-zinc-900/50 border-white/5 shadow-2xl backdrop-blur-lg' : 'bg-white border-black/5 shadow-sm'
      }`}>
        <h3 className={`text-[10px] font-black uppercase tracking-widest mb-6 ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Dashboard Analítico</h3>
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
                darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-zinc-50 border-zinc-100'
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-black transition-colors duration-500 ${
                darkMode ? 'text-white' : 'text-zinc-900'
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
