import React, { useState, useMemo, Suspense, lazy } from "react";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Grid,
  List,
  CalendarDays,
  X,
  Trophy,
} from "lucide-react";

const TournamentTable = lazy(() => import("../components/Tournaments/TournamentTable"));
const TournamentModal = lazy(() => import("../components/Tournaments/TournamentModal"));
const WeeklyView = lazy(() => import("../components/Tournaments/WeeklyView"));
const TournamentDetailsModal = lazy(() => import("../components/Dashboard/TournamentDetailsModal"));



const Tournaments = ({
  tournamentsData,
  workersData,
  camerasData,
  onCreateTournament,
  onUpdateTournament,
  onDeleteTournament,
  onSetSelectedTournament,
  darkMode = true,
}) => {
  const [editingTournament, setEditingTournament] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Estados para el buscador y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [stateFilter, setStateFilter] = useState("todos");
  const [workerFilter, setWorkerFilter] = useState("todos");

  // Nuevos estados para filtros de fecha
  const [dateFilterType, setDateFilterType] = useState("todos"); // 'todos', 'mes', 'rango'
  const [monthFilter, setMonthFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Nuevo estado para la vista (semana o tabla)
  const [viewMode, setViewMode] = useState("tabla"); // 'semana' o 'tabla'

  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Obtener datos únicos para los filtros
  const uniqueStatuses = useMemo(() => {
    const statuses = [
      ...new Set(tournamentsData.map((tournament) => tournament.status)),
    ];
    return statuses.sort();
  }, [tournamentsData]);

  const uniqueStates = useMemo(() => {
    const states = [
      ...new Set(tournamentsData.map((tournament) => tournament.state)),
    ];
    return states.filter((state) => state).sort();
  }, [tournamentsData]);

  const uniqueWorkers = useMemo(() => {
    const workers = [
      ...new Set(tournamentsData.map((tournament) => tournament.worker)),
    ];
    return workers
      .filter((worker) => worker && worker !== "Por asignar")
      .sort();
  }, [tournamentsData]);

  // Obtener meses únicos disponibles en los torneos
  const uniqueMonths = useMemo(() => {
    const months = new Set();

    tournamentsData.forEach((tournament) => {
      if (tournament.date) {
        const date = parseLocalDate(tournament.date);
        const monthYear = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        months.add(monthYear);
      }
    });

    return Array.from(months).sort().reverse(); // Más recientes primero
  }, [tournamentsData]);

  // Filtrar torneos
  const filteredTournaments = useMemo(() => {
    return tournamentsData.filter((tournament) => {
      // Filtro por búsqueda
      const matchesSearch =
        searchTerm === "" ||
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tournament.worker &&
          tournament.worker.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro por estado
      const matchesStatus =
        statusFilter === "todos" || tournament.status === statusFilter;

      // Filtro por estado (México)
      const matchesState =
        stateFilter === "todos" || tournament.state === stateFilter;

      // Filtro por trabajador
      const matchesWorker =
        workerFilter === "todos" || tournament.worker === workerFilter;

      // Filtro por fecha
      let matchesDate = true;

      if (dateFilterType === "mes" && monthFilter && tournament.date) {
        const tournamentDate = parseLocalDate(tournament.date);
        const tournamentMonth = `${tournamentDate.getFullYear()}-${String(
          tournamentDate.getMonth() + 1
        ).padStart(2, "0")}`;
        matchesDate = tournamentMonth === monthFilter;
      }

      if (
        dateFilterType === "rango" &&
        startDateFilter &&
        endDateFilter &&
        tournament.date
      ) {
        const tournamentDate = parseLocalDate(tournament.date);
        const startDate = parseLocalDate(startDateFilter);
        const endDate = parseLocalDate(endDateFilter);
        matchesDate = tournamentDate >= startDate && tournamentDate <= endDate;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesState &&
        matchesWorker &&
        matchesDate
      );
    });
  }, [
    tournamentsData,
    searchTerm,
    statusFilter,
    stateFilter,
    workerFilter,
    dateFilterType,
    monthFilter,
    startDateFilter,
    endDateFilter,
  ]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setStateFilter("todos");
    setWorkerFilter("todos");
    setDateFilterType("todos");
    setMonthFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "todos" ||
    stateFilter !== "todos" ||
    workerFilter !== "todos" ||
    dateFilterType !== "todos";

  // Estadísticas rápidas
  const tournamentStats = useMemo(() => {
    return {
      total: tournamentsData.length,
      activos: tournamentsData.filter((t) => t.status === "activo").length,
      pendientes: tournamentsData.filter((t) => t.status === "pendiente")
        .length,
      terminados: tournamentsData.filter((t) => t.status === "terminado")
        .length,
      estaSemana: filteredTournaments.filter((t) => {
        if (!t.date) return false;
        const tournamentDate = parseLocalDate(t.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

        return tournamentDate >= startOfWeek && tournamentDate <= endOfWeek;
      }).length,
    };
  }, [tournamentsData, filteredTournaments]);

  // Formatear mes para mostrar
  const formatMonth = (monthString) => {
    if (!monthString) return "";
    const [year, month] = monthString.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
  };

  const handleSaveTournament = async (tournamentData) => {
    try {
      if (editingTournament) {
        await onUpdateTournament(editingTournament.id, tournamentData);
        alert("Torneo actualizado correctamente");
      } else {
        await onCreateTournament(tournamentData);
        alert("Torneo creado correctamente");
      }
      setShowForm(false);
      setEditingTournament(null);
    } catch (error) {
      alert("Error al guardar el torneo");
    }
  };

  const handleEditTournament = (tournament) => {
    setEditingTournament(tournament);
    setShowForm(true);
  };

  const handleDeleteTournament = async (tournamentId) => {
    if (
      confirm(
        "¿Estás seguro de que quieres eliminar este torneo? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await onDeleteTournament(tournamentId);
        alert("Torneo eliminado correctamente");
      } catch (error) {
        alert("Error al eliminar el torneo");
      }
    }
  };

  const handleUpdateStatus = async (tournamentId, newStatus) => {
    try {
      await onUpdateTournament(tournamentId, { status: newStatus });
      alert(`Estado cambiado a: ${newStatus}`);
    } catch (error) {
      alert("Error al cambiar el estado");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTournament(null);
  };

  const handleViewDetails = (tournament) => {
    setSelectedTournament(tournament);
    onSetSelectedTournament(tournament);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header con título y botones */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-bold tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Gestión de <span className="text-emerald-500">Torneos</span></h2>
          <p className="text-slate-500 mt-1">
            Visualización y control de eventos: {filteredTournaments.length} resultados encontrados.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex rounded-2xl p-1.5 border backdrop-blur-xl transition-all duration-500 ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-black/5'
          }`}>
            <button
              onClick={() => setViewMode("semana")}
              className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                viewMode === "semana"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : darkMode 
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Cronograma</span>
            </button>
            <button
              onClick={() => setViewMode("tabla")}
              className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                viewMode === "tabla"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : darkMode 
                    ? "text-slate-400 hover:text-white hover:bg-white/5"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white"
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">Tabla</span>
            </button>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="group bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-5 py-2.5 rounded-2xl transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Nuevo Torneo</span>
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas - Rediseño estilo Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {[
          { label: 'Total', val: tournamentStats.total, color: 'blue', icon: Grid },
          { label: 'Activos', val: tournamentStats.activos, color: 'emerald', icon: Trophy },
          { label: 'Pendientes', val: tournamentStats.pendientes, color: 'yellow', icon: CalendarDays },
          { label: 'Terminados', val: tournamentStats.terminados, color: 'slate', icon: List },
          { label: 'Esta Semana', val: tournamentStats.estaSemana, color: 'purple', icon: Calendar },
        ].map((stat, i) => {
          const colorMap = {
            blue: { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', darkText: 'text-blue-400' },
            emerald: { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', darkText: 'text-emerald-400' },
            yellow: { text: 'text-yellow-600', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', darkText: 'text-yellow-400' },
            slate: { text: 'text-slate-600', bg: 'bg-slate-500/10', border: 'border-slate-500/20', darkText: 'text-slate-400' },
            purple: { text: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', darkText: 'text-purple-400' }
          };
          const colors = colorMap[stat.color];
          
          return (
            <div key={i} className={`rounded-2xl p-4 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 border shadow-sm ${
              darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-black/5'
            }`}>
               <div className="flex items-center gap-3 relative z-10">
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-500 ${colors.bg} ${colors.border}`}>
                   {<stat.icon className={`w-4 h-4 transition-colors duration-500 ${darkMode ? colors.darkText : colors.text}`} />}
                 </div>
                 <div>
                   <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider leading-none">{stat.label}</p>
                   <p className={`text-xl font-bold mt-1 leading-none transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.val}</p>
                 </div>
               </div>
               {/* Sutil brillo de fondo */}
               <div className={`absolute -right-4 -bottom-4 w-12 h-12 blur-xl rounded-full transition-opacity duration-500 ${darkMode ? colors.bg : 'bg-slate-100 opacity-50'}`}></div>
            </div>
          );
        })}
      </div>

      {/* Buscador y Filtros - Rediseño Compacto y Premium */}
      <div className={`rounded-3xl p-6 border transition-all duration-500 overflow-hidden relative ${
        darkMode ? 'bg-slate-900/50 border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-sm'
      }`}>
        <div className={`absolute top-0 right-0 p-8 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none transition-opacity duration-500 ${darkMode ? 'bg-emerald-500/5 opacity-100' : 'bg-emerald-500/10 opacity-50'}`}></div>
        
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 relative z-10">
          {/* Campo de Búsqueda Principal */}
          <div className="xl:col-span-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
              <Search className="w-3.5 h-3.5" />
              Buscador Inteligente
            </label>
            <div className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, club, estado o trabajador..."
                className={`w-full border rounded-2xl px-5 py-3 pl-12 transition-all duration-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  darkMode 
                    ? 'bg-white/5 border-white/5 text-white placeholder-slate-500 group-hover:bg-white/10' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 group-hover:bg-slate-100'
                }`}
              />
              <Search className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                darkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-500'
              }`} />
            </div>
          </div>

          {/* Grupo de Filtros Selectores */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1">Fase Operativa</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full border rounded-2xl px-4 py-3 text-sm appearance-none outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500/50 ${
                  darkMode 
                    ? 'bg-white/5 border-white/5 text-white hover:bg-white/10' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                }`}
              >
                <option value="todos" className={darkMode ? "bg-slate-900" : "bg-white"}>Todos los estados</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status} className="bg-[#0f172a] capitalize">{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1">Zona Geográfica</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className={`w-full border rounded-2xl px-4 py-3 text-sm appearance-none outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500/50 ${
                  darkMode 
                    ? 'bg-white/5 border-white/5 text-white hover:bg-white/10' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                }`}
              >
                <option value="todos" className={darkMode ? "bg-slate-900" : "bg-white"}>Toda la República</option>
                {uniqueStates.map((state) => (
                  <option key={state} value={state} className="bg-[#0f172a]">{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1">Temporalidad</label>
              <select
                value={dateFilterType}
                onChange={(e) => {
                  setDateFilterType(e.target.value);
                  setMonthFilter("");
                  setStartDateFilter("");
                  setEndDateFilter("");
                }}
                className={`w-full border rounded-2xl px-4 py-3 text-sm appearance-none outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500/50 ${
                  darkMode 
                    ? 'bg-white/5 border-white/5 text-white hover:bg-white/10' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                }`}
              >
                <option value="todos" className={darkMode ? "bg-slate-900" : "bg-white"}>Cualquier fecha</option>
                <option value="mes" className={darkMode ? "bg-slate-900" : "bg-white"}>Por Mes</option>
                <option value="rango" className={darkMode ? "bg-slate-900" : "bg-white"}>Rango Personalizado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expansión de Filtros de Fecha */}
        {dateFilterType !== "todos" && (
          <div className={`mt-6 pt-6 border-t animate-fade-in relative z-10 flex flex-wrap gap-4 items-end transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
            {dateFilterType === "mes" ? (
              <div className="w-full max-w-xs">
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Seleccionar Periodo</label>
                 <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none transition-all ${
                      darkMode 
                        ? 'bg-white/5 border-white/5 text-white hover:bg-white/10' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <option value="" className={darkMode ? "bg-slate-900" : "bg-white"}>Elegir mes...</option>
                    {uniqueMonths.map((month) => (
                      <option key={month} value={month} className={darkMode ? "bg-slate-900" : "bg-white"}>{formatMonth(month)}</option>
                    ))}
                  </select>
              </div>
            ) : (
              <>
                <div className="w-full max-w-[180px]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Desde</label>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className={`w-full border rounded-2xl px-4 py-2.5 text-sm outline-none transition-all ${
                      darkMode ? 'bg-white/5 border-white/5 text-white hover:bg-white/10 color-scheme-dark' : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                    }`}
                  />
                </div>
                <div className="w-full max-w-[180px]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Hasta</label>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className={`w-full border rounded-2xl px-4 py-2.5 text-sm outline-none transition-all ${
                      darkMode ? 'bg-white/5 border-white/5 text-white hover:bg-white/10 color-scheme-dark' : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                    }`}
                  />
                </div>
                {startDateFilter && endDateFilter && new Date(startDateFilter) > new Date(endDateFilter) && (
                  <p className="text-red-400 text-[10px] font-medium mb-3">La fecha inicial no puede ser mayor</p>
                )}
              </>
            )}
          </div>
        )}

        {/* Chips de Filtros Activos Compactos */}
        {hasActiveFilters && (
          <div className={`mt-6 flex items-center justify-between gap-4 pt-4 border-t relative z-10 transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-wider mr-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Activos:</span>
              <button 
                onClick={clearFilters} 
                className={`text-[10px] font-bold underline underline-offset-4 decoration-emerald-500/30 transition-colors duration-300 ${
                  darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
                }`}
              >
                Limpiar todo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vista Semanal o Tabla */}
      <div className="relative">
        <Suspense fallback={
          <div className={`rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 animate-pulse border transition-all duration-500 ${
            darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-black/5 shadow-sm shadow-slate-200'
          }`}>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
            <p className="text-slate-500 font-medium tracking-wide">Cargando vista de torneos...</p>
          </div>
        }>
          {viewMode === "semana" ? (
            <div className={`animate-fade-in transition-all duration-500 ${darkMode ? 'shadow-2xl' : 'shadow-xl shadow-slate-200'}`}>
              <WeeklyView
                tournaments={filteredTournaments}
                onViewDetails={handleViewDetails}
                onEditTournament={handleEditTournament}
                onDeleteTournament={handleDeleteTournament}
                onUpdateStatus={handleUpdateStatus}
                darkMode={darkMode}
              />
            </div>
          ) : (
            <div className={`animate-fade-in transition-all duration-500 ${darkMode ? 'shadow-2xl' : 'shadow-xl shadow-slate-200'}`}>
              <TournamentTable
                tournaments={filteredTournaments}
                onViewDetails={handleViewDetails}
                onEditTournament={handleEditTournament}
                onDeleteTournament={handleDeleteTournament}
                onUpdateStatus={handleUpdateStatus}
                darkMode={darkMode}
              />
            </div>
          )}
        </Suspense>
      </div>


      {/* Estado cuando no hay resultados */}
      {filteredTournaments.length === 0 && (
        <div className={`text-center py-12 rounded-3xl border border-dashed transition-all duration-500 mt-8 ${
          darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-lg mb-4 font-medium transition-colors duration-500 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {hasActiveFilters
              ? "No se encontraron torneos con los filtros aplicados"
              : "No hay torneos registrados"}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`px-6 py-2 rounded-xl transition-all duration-300 font-bold tracking-wide border ${
                darkMode 
                  ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' 
                  : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              Limpiar filtros aplicados
            </button>
          )}
        </div>
      )}

      {/* Formulario para crear/editar (Modal con Portal) */}
      <Suspense fallback={null}>
        <TournamentModal
          isOpen={showForm || !!editingTournament}
          onClose={handleCancelForm}
          onSave={handleSaveTournament}
          workers={workersData}
          cameras={camerasData}
          tournament={editingTournament}
        />
      </Suspense>

      {selectedTournament && (
        <Suspense fallback={null}>
          <TournamentDetailsModal 
            tournament={selectedTournament} 
            onClose={() => setSelectedTournament(null)} 
          />
        </Suspense>
      )}

    </div>
  );
};

export default Tournaments;
