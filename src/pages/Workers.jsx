import React, { useState, useMemo } from "react";
import WorkersTable from "../components/Workers/WorkersTable";
import WorkerForm from "../components/Workers/WorkerForm";
import WorkerCard from "../components/Workers/WorkerCard";
import { Search, Filter, X } from "lucide-react";

const Workers = ({
  workersData,
  onCreateWorker,
  onUpdateWorker,
  onDeleteWorker,
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

  // Filtrar trabajadores
  const filteredWorkers = useMemo(() => {
    return workersData.filter((worker) => {
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
    });
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
    console.log("💾 Guardando trabajador:", workerData);
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
      console.error("❌ Error guardando trabajador:", error);
      alert("Error al guardar el trabajador");
    }
  };

  const handleEditWorker = (worker) => {
    console.log("✏️ Editando trabajador:", worker);
    setEditingWorker(worker);
    setShowForm(true);
    setViewingWorker(null);
  };

  const handleDeleteWorker = async (workerId) => {
    console.log("🗑️ Eliminando trabajador:", workerId);
    try {
      await onDeleteWorker(workerId);
      alert("Trabajador eliminado correctamente");
    } catch (error) {
      console.error("❌ Error eliminando trabajador:", error);
      alert("Error al eliminar el trabajador");
    }
  };

  const handleViewWorker = (worker) => {
    console.log("👀 Viendo trabajador:", worker);
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
    <div className="space-y-6">
      {/* Header con título y botón */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Trabajadores</h2>
          <p className="text-gray-400 text-sm">
            {filteredWorkers.length} de {workersData.length} trabajadores
            mostrados
          </p>
        </div>
        <WorkerForm onSave={handleSaveWorker} onCancel={handleCancelForm} />
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Buscador */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Buscar trabajador
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, email o teléfono..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Estado
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

          {/* Filtro por Status */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Estatus
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="todos" className="text-white bg-gray-700">
                Todos los estatus
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

        {/* Controles de filtros activos */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Filtros activos:</span>
              {searchTerm && (
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs">
                  Búsqueda: "{searchTerm}"
                </span>
              )}
              {stateFilter !== "todos" && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                  Estado: {stateFilter}
                </span>
              )}
              {statusFilter !== "todos" && (
                <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs capitalize">
                  Estatus: {statusFilter}
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

      {/* Tabla de trabajadores */}
      <WorkersTable
        workers={filteredWorkers}
        onEditWorker={handleEditWorker}
        onDeleteWorker={handleDeleteWorker}
        onViewWorker={handleViewWorker}
      />

      {/* Estado cuando no hay resultados */}
      {filteredWorkers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">
            {hasActiveFilters
              ? "No se encontraron trabajadores con los filtros aplicados"
              : "No hay trabajadores registrados"}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Limpiar filtros para ver todos los trabajadores
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
          isOpen={true}
        />
      )}

      {/* Tarjeta de trabajador */}
      {viewingWorker && (
        <WorkerCard
          worker={viewingWorker}
          onClose={handleCloseCard}
          onEdit={handleEditWorker}
        />
      )}
    </div>
  );
};

export default Workers;
