import React, { useState, useMemo } from "react";
import WorkersTable from "../components/Workers/WorkersTable";
import WorkerForm from "../components/Workers/WorkerForm";
import WorkerCard from "../components/Workers/WorkerCard";
import { Search, Filter, X } from "lucide-react";

const Workers = ({
  workersData,
  camerasData,
  onCreateWorker,
  onUpdateWorker,
  onDeleteWorker,
  darkMode = true,
}) => {
  const [editingWorker, setEditingWorker] = useState(null);
  const [viewingWorker, setViewingWorker] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Estados para el buscador y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Obtener estados únicos para el filtro
  const uniqueStates = useMemo(() => {
    const states = [...new Set(workersData.map((worker) => worker.state))];
    return states.sort();
  }, [workersData]);

  // Obtener status únicos para el filtro
  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(workersData.map((worker) => worker.status))];
    return statuses.sort();
  }, [workersData]);

  // Filtrar y ordenar trabajadores
  const filteredWorkers = useMemo(() => {
    return workersData
      .filter((worker) => {
        // Filtro por búsqueda en nombre, email o teléfono
        const matchesSearch =
          searchTerm === "" ||
          worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          worker.phone.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por estado
        const matchesState =
          stateFilter === "todos" || worker.state === stateFilter;

        // Filtro por status
        const matchesStatus =
          statusFilter === "todos" || worker.status === statusFilter;

        return matchesSearch && matchesState && matchesStatus;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [workersData, searchTerm, stateFilter, statusFilter]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStateFilter("todos");
    setStatusFilter("todos");
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    searchTerm !== "" || stateFilter !== "todos" || statusFilter !== "todos";

  const handleSaveWorker = async (workerData) => {
    try {
      if (editingWorker) {
        await onUpdateWorker(editingWorker.id, workerData);
        alert("Trabajador actualizado correctamente");
      } else {
        await onCreateWorker(workerData);
        alert("Trabajador creado correctamente");
      }
      setShowForm(false);
      setEditingWorker(null);
    } catch (error) {
      alert("Error al guardar el trabajador");
    }
  };

  const handleEditWorker = (worker) => {
    setEditingWorker(worker);
    setShowForm(true);
    setViewingWorker(null);
  };

  const handleDeleteWorker = async (workerId) => {
    try {
      await onDeleteWorker(workerId);
      alert("Trabajador eliminado correctamente");
    } catch (error) {
      alert("Error al eliminar el trabajador");
    }
  };

  const handleViewWorker = (worker) => {
    setViewingWorker(worker);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingWorker(null);
  };

  const handleCloseCard = () => {
    setViewingWorker(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header con título y botón */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Trabajadores</h2>
          <p className="text-slate-500 text-sm mt-1">
            <span className="text-emerald-500 font-bold">{filteredWorkers.length}</span> de {workersData.length} trabajadores registrados
          </p>
        </div>
        <div className="flex-shrink-0">
          <WorkerForm
            onSave={handleSaveWorker}
            onCancel={handleCancelForm}
            camerasData={camerasData}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className={`rounded-2xl border p-6 transition-all duration-500 ${
        darkMode ? 'bg-slate-900/50 border-white/5 shadow-2xl backdrop-blur-lg' : 'bg-white border-black/5 shadow-sm'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Buscador */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-500 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Buscar trabajador
            </label>
            <div className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, email o teléfono..."
                className={`w-full border rounded-xl px-4 py-2 pl-10 transition-all duration-300 outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 group-hover:bg-white/10' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 group-hover:bg-slate-100'
                }`}
              />
              <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                darkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-500'
              }`} />
            </div>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Estado
            </label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2 appearance-none outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
              }`}
            >
              <option value="todos" className={darkMode ? 'bg-slate-900' : 'bg-white'}>
                Todos los estados
              </option>
              {uniqueStates.map((state) => (
                <option
                  key={state}
                  value={state}
                  className={darkMode ? 'bg-slate-900' : 'bg-white'}
                >
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Status */}
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-2">
              Estatus
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2 appearance-none outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
              }`}
            >
              <option value="todos" className={darkMode ? 'bg-slate-900' : 'bg-white'}>
                Todos los estatus
              </option>
              {uniqueStatuses.map((status) => (
                <option
                  key={status}
                  value={status}
                  className={`${darkMode ? 'bg-slate-900' : 'bg-white'} capitalize`}
                >
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Controles de filtros activos */}
        {hasActiveFilters && (
          <div className={`mt-4 flex items-center justify-between pt-4 border-t transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mr-2">Activos:</span>
              {searchTerm && (
                <span className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  "{searchTerm}"
                </span>
              )}
              {stateFilter !== "todos" && (
                <span className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                  darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                  {stateFilter}
                </span>
              )}
              {statusFilter !== "todos" && (
                <span className={`px-2 py-1 rounded text-xs font-bold transition-colors capitalize ${
                  darkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
                }`}>
                  {statusFilter}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className={`flex items-center space-x-2 transition-colors text-xs font-bold uppercase tracking-widest ${
                darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabla de trabajadores */}
      <div className={`rounded-3xl border overflow-hidden transition-all duration-500 ${
        darkMode ? 'bg-[#0B1120] border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-slate-200'
      }`}>
        <WorkersTable
          workers={filteredWorkers}
          onEditWorker={handleEditWorker}
          onDeleteWorker={handleDeleteWorker}
          onViewWorker={handleViewWorker}
          darkMode={darkMode}
        />
      </div>

      {/* Estado cuando no hay resultados */}
      {filteredWorkers.length === 0 && (
        <div className={`text-center py-16 rounded-3xl border border-dashed transition-all duration-500 ${
          darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-lg mb-4 font-medium transition-colors duration-500 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {hasActiveFilters
              ? "No se encontraron trabajadores con los filtros aplicados"
              : "No hay trabajadores registrados"}
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

      {/* Formulario para crear/editar */}
      {(showForm || editingWorker) && (
        <WorkerForm
          onSave={handleSaveWorker}
          onCancel={handleCancelForm}
          worker={editingWorker}
          camerasData={camerasData}
          isOpen={true}
          darkMode={darkMode}
        />
      )}

      {/* Tarjeta de trabajador */}
      {viewingWorker && (
        <WorkerCard
          worker={viewingWorker}
          onClose={handleCloseCard}
          onEdit={handleEditWorker}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Workers;
