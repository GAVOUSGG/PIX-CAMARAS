// Tournaments.jsx - Versión actualizada con filtros de fecha
import React, { useState, useMemo } from "react";
import TournamentTable from "../components/Tournaments/TournamentTable";
import TournamentForm from "../components/Tournaments/TournamentForm";
import WeeklyView from "../components/Tournaments/WeeklyView";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Grid,
  List,
  CalendarDays,
  X,
} from "lucide-react";
import TournamentDetailsModal from "../components/Dashboard/TournamentDetailsModal";

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
  const [viewMode, setViewMode] = useState("semana"); // 'semana' o 'tabla'

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
    <div className="space-y-6">
      {/* Header con título y botones */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Torneos</h2>
          <p className="text-gray-400 text-sm">
            {filteredTournaments.length} de {tournamentsData.length} torneos
            mostrados
            {viewMode === "semana" &&
              ` • ${tournamentStats.estaSemana} torneos esta semana`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Selector de vista */}
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewMode("semana")}
              className={`px-3 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                viewMode === "semana"
                  ? "bg-emerald-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Semana</span>
            </button>
            <button
              onClick={() => setViewMode("tabla")}
              className={`px-3 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                viewMode === "tabla"
                  ? "bg-emerald-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm">Tabla</span>
            </button>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Torneo</span>
          </button>
        </div>
      </div>

      {/* Buscador y Filtros - ACTUALIZADO */}
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Primera fila de filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Buscador */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Buscar torneo
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, ubicación, campo o trabajador..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Filtro por Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="todos" className="text-white bg-gray-700">
                  Todos los estados
                </option>
                {uniqueStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="text-white bg-gray-700 capitalize"
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Segunda fila de filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtro por Estado (México) */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Estado (México)
              </label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="todos" className="text-white bg-gray-700">
                  Todos los estados
                </option>
                {uniqueStates.map((state) => (
                  <option
                    key={state}
                    value={state}
                    className="text-white bg-gray-700"
                  >
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Trabajador */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Trabajador
              </label>
              <select
                value={workerFilter}
                onChange={(e) => setWorkerFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="todos" className="text-white bg-gray-700">
                  Todos los trabajadores
                </option>
                {uniqueWorkers.map((worker) => (
                  <option
                    key={worker}
                    value={worker}
                    className="text-white bg-gray-700"
                  >
                    {worker}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Tipo de Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <CalendarDays className="w-4 h-4 inline mr-2" />
                Fecha
              </label>
              <select
                value={dateFilterType}
                onChange={(e) => {
                  setDateFilterType(e.target.value);
                  setMonthFilter("");
                  setStartDateFilter("");
                  setEndDateFilter("");
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="todos" className="text-white bg-gray-700">
                  Todas las fechas
                </option>
                <option value="mes" className="text-white bg-gray-700">
                  Por mes
                </option>
                <option value="rango" className="text-white bg-gray-700">
                  Por rango
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Filtros de fecha específicos */}
        {dateFilterType === "mes" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Seleccionar mes
              </label>
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" className="text-white bg-gray-700">
                  Seleccionar mes
                </option>
                {uniqueMonths.map((month) => (
                  <option
                    key={month}
                    value={month}
                    className="text-white bg-gray-700"
                  >
                    {formatMonth(month)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {dateFilterType === "rango" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Fecha inicial
              </label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Fecha final
              </label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-end">
              {startDateFilter &&
                endDateFilter &&
                new Date(startDateFilter) > new Date(endDateFilter) && (
                  <p className="text-red-400 text-sm">
                    La fecha inicial no puede ser mayor a la final
                  </p>
                )}
            </div>
          </div>
        )}

        {/* Controles de filtros activos */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-400 flex-wrap gap-2">
              <span>Filtros activos:</span>
              {searchTerm && (
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs">
                  Búsqueda: "{searchTerm}"
                </span>
              )}
              {statusFilter !== "todos" && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs capitalize">
                  Estado: {statusFilter}
                </span>
              )}
              {stateFilter !== "todos" && (
                <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                  Estado: {stateFilter}
                </span>
              )}
              {workerFilter !== "todos" && (
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">
                  Trabajador: {workerFilter}
                </span>
              )}
              {dateFilterType === "mes" && monthFilter && (
                <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
                  Mes: {formatMonth(monthFilter)}
                </span>
              )}
              {dateFilterType === "rango" &&
                startDateFilter &&
                endDateFilter && (
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
                    Rango:{" "}
                    {new Date(startDateFilter).toLocaleDateString("es-MX")} -{" "}
                    {new Date(endDateFilter).toLocaleDateString("es-MX")}
                  </span>
                )}
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        )}
      </div>
      {/* Estadísticas rápidas - Actualizadas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {tournamentStats.total}
          </div>
          <div className="text-gray-400 text-sm">Total</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {tournamentStats.activos}
          </div>
          <div className="text-gray-400 text-sm">Activos</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {tournamentStats.pendientes}
          </div>
          <div className="text-gray-400 text-sm">Pendientes</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {tournamentStats.terminados}
          </div>
          <div className="text-gray-400 text-sm">Terminados</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {tournamentStats.estaSemana}
          </div>
          <div className="text-gray-400 text-sm">Esta Semana</div>
        </div>
      </div>

      {/* Vista Semanal o Tabla */}
      {viewMode === "semana" ? (
        <WeeklyView
          tournaments={filteredTournaments}
          onViewDetails={handleViewDetails}
          onEditTournament={handleEditTournament}
          onDeleteTournament={handleDeleteTournament}
          onUpdateStatus={handleUpdateStatus}
        />
      ) : (
        <TournamentTable
          tournaments={filteredTournaments}
          onViewDetails={handleViewDetails}
          onEditTournament={handleEditTournament}
          onDeleteTournament={handleDeleteTournament}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

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

      {/* Formulario para crear/editar */}
      {(showForm || editingTournament) && (
        <TournamentForm
          onSave={handleSaveTournament}
          onCancel={handleCancelForm}
          workers={workersData}
          cameras={camerasData}
          tournament={editingTournament}
          isOpen={true}
        />
      )}

      {selectedTournament && (
        <TournamentDetailsModal 
          tournament={selectedTournament} 
          onClose={() => setSelectedTournament(null)} 
        />
      )}
    </div>
  );
};

export default Tournaments;
