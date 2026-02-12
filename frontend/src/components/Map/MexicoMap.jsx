import React, { useState, useMemo, memo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polyline,
} from "react-leaflet";
import {
  MapPin,
  Camera,
  Users,
  Trophy,
  Truck,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Coordenadas aproximadas de los estados principales de México
const stateCoordinates = {
  CDMX: [19.4326, -99.1332],
  Jalisco: [20.6597, -103.3496],
  "Nuevo León": [25.6866, -100.3161],
  Yucatán: [20.9801, -89.6247],
  "Baja California": [30.8406, -115.2838],
  "Baja California Sur": [26.0444, -111.6661],
  "Quintana Roo": [19.1817, -88.4791],
  "Estado de México": [19.4969, -99.7233],
  Puebla: [19.0414, -98.2063],
  Veracruz: [19.1738, -96.1342],
  Guerrero: [17.4392, -99.5451],
  Chiapas: [16.7569, -93.1292],
  Oaxaca: [17.0732, -96.7266],
  Michoacán: [19.5665, -101.7068],
  Nayarit: [21.7514, -104.8455],
  Zacatecas: [22.7709, -102.5832],
  Hidalgo: [20.0911, -98.7620],
  Guanajuato: [21.019, -101.2574],
  Sonora: [29.2972, -110.3309],
  Chihuahua: [28.633, -106.0691],
  Coahuila: [27.0587, -101.7068],
  Tamaulipas: [24.2669, -98.8363],
  Sinaloa: [25.1721, -107.4795],
  Durango: [24.0277, -104.6532],
  "San Luis Potosí": [22.1565, -100.9855],
  Aguascalientes: [21.8818, -102.2916],
  Tlaxcala: [19.3182, -98.2375],
  Morelos: [18.6813, -99.1013],
  Colima: [19.2452, -103.7241],
  Tabasco: [17.8409, -92.6189],
  Campeche: [19.8301, -90.5349],
  Querétaro: [20.5888, -100.3899],
};

const MexicoMap = ({ 
  tournaments = [], 
  workers = [], 
  cameras = [], 
  shipments = [],
  showStatistics = true 
}) => {
  const [filters, setFilters] = useState({
    tournaments: true,
    workers: true,
    cameras: true,
    shipments: true,
  });

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Función auxiliar para obtener la fecha como string YYYY-MM-DD en hora local
  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Función para obtener los días de la semana actual (Lunes a Domingo)
  const getCurrentWeekDays = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(getLocalDateString(day));
    }
    return days;
  }, []);

  // Filtrar torneos de la semana actual cuando el filtro de torneos está activo
  const tournamentsThisWeek = useMemo(() => {
    if (!filters.tournaments) return tournaments;
    
    return tournaments.filter((tournament) => {
      if (!tournament.date || !tournament.endDate) return false;
      
      const tournamentStart = tournament.date.split("T")[0];
      const tournamentEnd = tournament.endDate.split("T")[0];
      
      // Verificar si el torneo se superpone con algún día de la semana actual
      // Un torneo está en la semana si su rango se superpone con algún día de la semana
      return getCurrentWeekDays.some((weekDay) => {
        return weekDay >= tournamentStart && weekDay <= tournamentEnd;
      });
    });
  }, [tournaments, filters.tournaments, getCurrentWeekDays]);

  // Agrupar datos por estado
  const mapData = useMemo(() => {
    const data = {};

    // Inicializar estados
    Object.keys(stateCoordinates).forEach((state) => {
      data[state] = {
        tournaments: [],
        workers: [],
        cameras: [],
        shipments: [],
        activeTournaments: 0,
      };
    });

    // Procesar torneos (solo los de la semana si el filtro está activo)
    tournamentsThisWeek.forEach((t) => {
      if (data[t.state]) {
        data[t.state].tournaments.push(t);
        if (t.status === "activo") {
          data[t.state].activeTournaments++;
        }
      }
    });

    // Procesar trabajadores
    workers.forEach((w) => {
      if (data[w.state]) {
        data[w.state].workers.push(w);
      }
    });

    // Procesar cámaras
    cameras.forEach((c) => {
      if (data[c.location]) {
        data[c.location].cameras.push(c);
      }
    });

    // Procesar envíos
    shipments.forEach((s) => {
      if (data[s.destination] && (s.status === "enviado" || s.status === "en envio")) {
        data[s.destination].shipments.push(s);
      }
    });

    return data;
  }, [tournamentsThisWeek, workers, cameras, shipments]);

  // Procesar rutas de envíos
  const shipmentRoutes = useMemo(() => {
    if (!filters.shipments) return [];
    
    return shipments
      .filter((s) => s.status === "enviado" || s.status === "en envio")
      .map((s) => {
        const originCoords = stateCoordinates["CDMX"]; 
        const destCoords = stateCoordinates[s.destination];

        if (originCoords && destCoords) {
          return {
            id: s.id,
            positions: [originCoords, destCoords],
            data: s,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [shipments, filters.shipments]);

  const getMarkerColor = (stateData) => {
    if (stateData.activeTournaments > 0) return "bg-emerald-500";
    if (stateData.tournaments.length > 0) return "bg-purple-500";
    if (stateData.cameras.length > 0) return "bg-blue-500";
    if (stateData.workers.length > 0) return "bg-orange-500";
    return "bg-gray-500";
  };

  const hasData = (stateData) => {
    return (
      (filters.tournaments && stateData.tournaments.length > 0) ||
      (filters.workers && stateData.workers.length > 0) ||
      (filters.cameras && stateData.cameras.length > 0) ||
      (filters.shipments && stateData.shipments.length > 0)
    );
  };

  return (
    <div className="relative glass-card rounded-3xl overflow-hidden animate-fade-in shadow-2xl">

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
      
      {/* Header & Controls */}
      <div className="relative p-4 md:p-6 border-b border-emerald-500/20 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-1.5 md:p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                <MapPin className="w-5 h-5 md:w-6 h-6 text-emerald-400" />
              </div>
              Mapa de Operaciones
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2 ml-10 md:ml-14">
              Visualización en tiempo real de recursos y logística
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleFilter("tournaments")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                filters.tournaments
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/20"
                  : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <Trophy className="w-4 h-4" />
              Torneos
            </button>
            <button
              onClick={() => toggleFilter("workers")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                filters.workers
                  ? "bg-orange-500/20 border-orange-500/50 text-orange-300 shadow-lg shadow-orange-500/20"
                  : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <Users className="w-4 h-4" />
              Personal
            </button>
            <button
              onClick={() => toggleFilter("cameras")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                filters.cameras
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20"
                  : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <Camera className="w-4 h-4" />
              Cámaras
            </button>
            <button
              onClick={() => toggleFilter("shipments")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                filters.shipments
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/20"
                  : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <Truck className="w-4 h-4" />
              Envíos
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[400px] md:h-[550px] relative z-0">
        <MapContainer
          center={[23.6345, -102.5528]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", background: "#0f172a" }}
        >
          {/* Dark Mode Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Shipment Routes */}
          {shipmentRoutes.map((route) => (
            <React.Fragment key={route.id}>
              <Polyline
                positions={route.positions}
                pathOptions={{
                  color: "#10b981",
                  weight: 3,
                  opacity: 0.8,
                  dashArray: "10, 15",
                }}
              />
              <Marker position={route.positions[0]} opacity={0}>
                 <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    <div className="text-xs font-bold text-emerald-400">
                       En tránsito: {route.data.trackingNumber}
                    </div>
                 </Tooltip>
              </Marker>
            </React.Fragment>
          ))}

          {/* State Markers */}
          {Object.entries(stateCoordinates).map(([state, coords]) => {
            const stateData = mapData[state];
            if (!stateData || !hasData(stateData)) return null;

            return (
              <Marker key={state} position={coords}>
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[200px]">
                    <h4 className="font-bold text-lg mb-3 border-b border-gray-200 pb-2">
                      {state}
                    </h4>
                    
                    <div className="space-y-3">
                      {/* Tournaments Section */}
                      {filters.tournaments && stateData.tournaments.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm mb-1">
                            <Trophy className="w-3 h-3" />
                            <span>Torneos de la semana ({stateData.tournaments.length})</span>
                          </div>
                          <ul className="text-xs text-gray-600 pl-5 list-disc">
                            {stateData.tournaments.slice(0, 3).map(t => (
                              <li key={t.id} className="truncate">{t.name}</li>
                            ))}
                            {stateData.tournaments.length > 3 && (
                              <li className="text-gray-400 italic">
                                +{stateData.tournaments.length - 3} más...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Workers Section */}
                      {filters.workers && stateData.workers.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm mb-1">
                            <Users className="w-3 h-3" />
                            <span>Personal ({stateData.workers.length})</span>
                          </div>
                          <ul className="text-xs text-gray-600 pl-5 list-disc">
                            {stateData.workers.slice(0, 3).map(w => (
                              <li key={w.id} className="truncate">{w.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Cameras Section */}
                      {filters.cameras && stateData.cameras.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
                            <Camera className="w-3 h-3" />
                            <span>Cámaras ({stateData.cameras.length})</span>
                          </div>
                          <ul className="text-xs text-gray-600 pl-5 list-disc space-y-1">
                            {stateData.cameras.map(c => (
                              <li key={c.id} className="flex items-center justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-blue-700">{c.id}</div>
                                  <div className="text-gray-500 truncate">{c.model}</div>
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                    c.status === 'en uso' ? 'bg-green-100 text-green-700' : 
                                    c.status === 'disponible' ? 'bg-blue-100 text-blue-700' : 
                                    c.status === 'mantenimiento' ? 'bg-orange-100 text-orange-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {c.status}
                                  </span>
                                  
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
                
                <Tooltip permanent direction="top" className="bg-transparent border-0 shadow-none">
                  <div
                    className={`px-3 py-1.5 rounded-full text-white text-[11px] font-bold shadow-lg backdrop-blur-sm border border-white/30 ${getMarkerColor(
                      stateData
                    )}`}
                  >
                    {state}
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
        
        {/* Legend Overlay */}
        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-xl p-3 md:p-4 rounded-xl md:rounded-2xl border border-emerald-500/30 z-[1000] text-[10px] md:text-xs space-y-2 md:space-y-2.5 shadow-2xl shadow-emerald-500/10">
           <div className="font-bold text-white mb-2 flex items-center gap-2">
             <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
             Simbología
           </div>
           <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <span className="text-gray-300 font-medium">Torneo Activo</span>
           </div>
           <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"></div>
              <span className="text-gray-300 font-medium">Torneo Programado</span>
           </div>
           <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
              <span className="text-gray-300 font-medium">Cámaras</span>
           </div>
           <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
              <span className="text-gray-300 font-medium">Personal</span>
           </div>
           <div className="flex items-center gap-2.5 pt-1 border-t border-white/10">
              <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300 border-t border-dashed border-emerald-300 shadow-lg shadow-emerald-500/30"></div>
              <span className="text-gray-300 font-medium">Envío en curso</span>
           </div>
        </div>
      </div>

      {/* State Statistics Section */}
      {showStatistics && (
        <div className="p-4 md:p-8 border-t border-white/5 bg-slate-900/40 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h4 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                Estadísticas por Estado
              </h4>
              <p className="text-gray-400 text-sm mt-1 ml-4">Desglose detallado de recursos y operaciones locales</p>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Sincronizado en Vivo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Object.entries(mapData)
              .filter(([_, data]) => hasData(data))
              .sort((a, b) => {
                // Priority sorting: states with active tournaments first, then total count
                const aActive = a[1].activeTournaments > 0 ? 1 : 0;
                const bActive = b[1].activeTournaments > 0 ? 1 : 0;
                if (aActive !== bActive) return bActive - aActive;
                
                const aTotal = a[1].tournaments.length + a[1].workers.length + a[1].cameras.length + a[1].shipments.length;
                const bTotal = b[1].tournaments.length + b[1].workers.length + b[1].cameras.length + b[1].shipments.length;
                if (aTotal !== bTotal) return bTotal - aTotal;
                
                return a[0].localeCompare(b[0]);
              })
              .map(([state, data]) => (
                <div 
                  key={state} 
                  className="group relative bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[2rem] p-6 transition-all duration-500"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-white uppercase tracking-tight">{state}</span>
                    {data.activeTournaments > 0 ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">En Curso</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 opacity-40">
                         <MapPin className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {filters.tournaments && (
                      <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                        data.tournaments.length > 0 
                          ? "bg-purple-500/10 border-purple-500/20 shadow-lg shadow-purple-500/5" 
                          : "bg-transparent border-white/5 opacity-40"
                      }`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Trophy className="w-3 h-3 text-purple-400" />
                          <span className="text-[10px] uppercase font-bold text-gray-400">Torneos</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <div className="text-xl font-black text-white">{data.tournaments.length}</div>
                          {data.activeTournaments > 0 && <span className="text-[10px] text-emerald-400 font-bold">({data.activeTournaments})</span>}
                        </div>
                      </div>
                    )}
                    
                    {filters.workers && (
                      <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                        data.workers.length > 0 
                          ? "bg-orange-500/10 border-orange-500/20 shadow-lg shadow-orange-500/5" 
                          : "bg-transparent border-white/5 opacity-40"
                      }`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Users className="w-3 h-3 text-orange-400" />
                          <span className="text-[10px] uppercase font-bold text-gray-400">Personal</span>
                        </div>
                        <div className="text-xl font-black text-white">{data.workers.length}</div>
                      </div>
                    )}
                    
                    {filters.cameras && (
                      <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                        data.cameras.length > 0 
                          ? "bg-blue-500/10 border-blue-500/20 shadow-lg shadow-blue-500/5" 
                          : "bg-transparent border-white/5 opacity-40"
                      }`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Camera className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] uppercase font-bold text-gray-400">Cámaras</span>
                        </div>
                        <div className="text-xl font-black text-white">{data.cameras.length}</div>
                      </div>
                    )}
                    
                    {filters.shipments && (
                      <div className={`p-3 rounded-2xl border transition-all duration-300 ${
                        data.shipments.length > 0 
                          ? "bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/5" 
                          : "bg-transparent border-white/5 opacity-40"
                      }`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Truck className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] uppercase font-bold text-gray-400">Envíos</span>
                        </div>
                        <div className="text-xl font-black text-white">{data.shipments.length}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MexicoMap);