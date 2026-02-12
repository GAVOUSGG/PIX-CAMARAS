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
        const date = new Date(tournament.date);
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
        const tournamentDate = new Date(tournament.date);
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
        const tournamentDate = new Date(tournament.date);
        const startDate = new Date(startDateFilter);
        const endDate = new Date(endDateFilter);
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
        const tournamentDate = new Date(t.date);
        const today = new Date();
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
          <h2 className="text-3xl font-bold text-white tracking-tight">Gestión de <span className="text-emerald-400">Torneos</span></h2>
          <p className="text-gray-400 mt-1">
            Visualización y control de eventos: {filteredTournaments.length} resultados encontrados.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded-2xl p-1.5 border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setViewMode("semana")}
              className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 ${
                viewMode === "semana"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
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
                  : "text-gray-400 hover:text-white hover:bg-white/5"
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', val: tournamentStats.total, color: 'blue', icon: Grid },
          { label: 'Activos', val: tournamentStats.activos, color: 'emerald', icon: Trophy },
          { label: 'Pendientes', val: tournamentStats.pendientes, color: 'yellow', icon: CalendarDays },
          { label: 'Terminados', val: tournamentStats.terminados, color: 'slate', icon: List },
          { label: 'Esta Semana', val: tournamentStats.estaSemana, color: 'purple', icon: Calendar },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
             <div className="flex items-center gap-3 relative z-10">
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${stat.color}-500/10 border border-${stat.color}-500/10`}>
                 {<stat.icon className={`w-4 h-4 text-${stat.color}-400`} />}
               </div>
               <div>
                 <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider leading-none">{stat.label}</p>
                 <p className="text-xl font-bold text-white mt-1 leading-none">{stat.val}</p>
               </div>
             </div>
             {/* Sutil brillo de fondo */}
             <div className={`absolute -right-4 -bottom-4 w-12 h-12 bg-${stat.color}-500/5 blur-xl rounded-full`}></div>
          </div>
        ))}
      </div>

      {/* Buscador y Filtros - Rediseño Compacto y Premium */}
      <div className="glass-card rounded-3xl p-6 border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 relative z-10">
          {/* Campo de Búsqueda Principal */}
          <div className="xl:col-span-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5 ml-1">
              <Search className="w-3.5 h-3.5" />
              Buscador Inteligente
            </label>
            <div className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, club, estado o trabajador..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 group-hover:bg-white/10 transition-all duration-300 text-sm"
              />
              <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors" />
            </div>
          </div>

          {/* Grupo de Filtros Selectores */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2.5 ml-1">Fase Operativa</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm appearance-none outline-none hover:bg-white/10 transition-all cursor-pointer"
              >
                <option value="todos" className="bg-[#0f172a]">Todos los estados</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status} className="bg-[#0f172a] capitalize">{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2.5 ml-1">Zona Geográfica</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm appearance-none outline-none hover:bg-white/10 transition-all cursor-pointer"
              >
                <option value="todos" className="bg-[#0f172a]">Toda la República</option>
                {uniqueStates.map((state) => (
                  <option key={state} value={state} className="bg-[#0f172a]">{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2.5 ml-1">Temporalidad</label>
              <select
                value={dateFilterType}
                onChange={(e) => {
                  setDateFilterType(e.target.value);
                  setMonthFilter("");
                  setStartDateFilter("");
                  setEndDateFilter("");
                }}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm appearance-none outline-none hover:bg-white/10 transition-all cursor-pointer"
              >
                <option value="todos" className="bg-[#0f172a]">Cualquier fecha</option>
                <option value="mes" className="bg-[#0f172a]">Por Mes</option>
                <option value="rango" className="bg-[#0f172a]">Rango Personalizado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expansión de Filtros de Fecha */}
        {dateFilterType !== "todos" && (
          <div className="mt-6 pt-6 border-t border-white/5 animate-fade-in relative z-10 flex flex-wrap gap-4 items-end">
            {dateFilterType === "mes" ? (
              <div className="w-full max-w-xs">
                 <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Seleccionar Periodo</label>
                 <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white text-sm outline-none hover:bg-white/10 transition-all"
                  >
                    <option value="" className="bg-[#0f172a]">Elegir mes...</option>
                    {uniqueMonths.map((month) => (
                      <option key={month} value={month} className="bg-[#0f172a]">{formatMonth(month)}</option>
                    ))}
                  </select>
              </div>
            ) : (
              <>
                <div className="w-full max-w-[180px]">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Desde</label>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 text-white text-sm outline-none hover:bg-white/10 transition-all"
                  />
                </div>
                <div className="w-full max-w-[180px]">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Hasta</label>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 text-white text-sm outline-none hover:bg-white/10 transition-all"
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
          <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-white/5 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mr-2">Activos:</span>
              <button onClick={clearFilters} className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 underline decoration-emerald-500/30 underline-offset-4">Limpiar todo</button>
            </div>
          </div>
        )}
      </div>

      {/* Vista Semanal o Tabla */}
      <div className="relative">
        <Suspense fallback={
          <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
            <p className="text-gray-400 font-medium tracking-wide">Cargando vista de torneos...</p>
          </div>
        }>
          {viewMode === "semana" ? (
            <div className="animate-fade-in">
              <WeeklyView
                tournaments={filteredTournaments}
                onViewDetails={handleViewDetails}
                onEditTournament={handleEditTournament}
                onDeleteTournament={handleDeleteTournament}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>
          ) : (
            <div className="animate-fade-in shadow-2xl">
              <TournamentTable
                tournaments={filteredTournaments}
                onViewDetails={handleViewDetails}
                onEditTournament={handleEditTournament}
                onDeleteTournament={handleDeleteTournament}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>
          )}
        </Suspense>
      </div>


      {/* Estado cuando no hay resultados */}
      {filteredTournaments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">
            {hasActiveFilters
              ? "No se encontraron torneos con los filtros aplicados"
              : "No hay torneos registrados"}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Limpiar filtros para ver todos los torneos
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
