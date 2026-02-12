import React, { useState, useMemo } from "react";
import ShipmentsTable from "../components/Logistics/ShipmentsTable";
import ShipmentForm from "../components/Logistics/ShipmentsForm";
import ShipmentCard from "../components/Logistics/ShipmentsCard";
import { Search, Filter, Plus, Truck, Package, MapPin } from "lucide-react";

const Logistics = ({
  shipmentsData,
  camerasData,
  workersData,
  onCreateShipment,
  onUpdateShipment,
  onDeleteShipment,
}) => {
  const [editingShipment, setEditingShipment] = useState(null);
  const [viewingShipment, setViewingShipment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Estados para el buscador y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [destinationFilter, setDestinationFilter] = useState("todos");

  // Obtener datos únicos para los filtros
  const uniqueStatuses = useMemo(() => {
    const statuses = [
      ...new Set(shipmentsData.map((shipment) => shipment.status)),
    ];
    return statuses.sort();
  }, [shipmentsData]);

  const uniqueDestinations = useMemo(() => {
    const destinations = [
      ...new Set(shipmentsData.map((shipment) => shipment.destination)),
    ];
    return destinations.sort();
  }, [shipmentsData]);

  // Filtrar envíos
  const filteredShipments = useMemo(() => {
    return shipmentsData.filter((shipment) => {
      // Filtro por búsqueda en ID, destino, destinatario o tracking
      const matchesSearch =
        searchTerm === "" ||
        shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shipment.shipper && shipment.shipper.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (shipment.sender && shipment.sender.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (shipment.trackingNumber &&
          shipment.trackingNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      // Filtro por status
      const matchesStatus =
        statusFilter === "todos" || shipment.status === statusFilter;

      // Filtro por destino
      const matchesDestination =
        destinationFilter === "todos" ||
        shipment.destination === destinationFilter;

      return matchesSearch && matchesStatus && matchesDestination;
    });
  }, [shipmentsData, searchTerm, statusFilter, destinationFilter]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setDestinationFilter("todos");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "todos" ||
    destinationFilter !== "todos";

  // Estadísticas
  const stats = useMemo(() => {
    const total = shipmentsData.length;
    const enviados = shipmentsData.filter((s) => s.status === "enviado").length;
    const preparando = shipmentsData.filter(
      (s) => s.status === "preparando"
    ).length;
    const pendientes = shipmentsData.filter(
      (s) => s.status === "pendiente"
    ).length;
    const entregados = shipmentsData.filter(
      (s) => s.status === "entregado"
    ).length;

    return { total, enviados, preparando, pendientes, entregados };
  }, [shipmentsData]);

  // Funciones para manejar las acciones
  const handleSaveShipment = async (shipmentData) => {
    try {
      if (editingShipment) {
        await onUpdateShipment(editingShipment.id, shipmentData);
        alert("Envío actualizado correctamente");
      } else {
        await onCreateShipment(shipmentData);
        alert("Envío creado correctamente");
      }
      setShowForm(false);
      setEditingShipment(null);
    } catch (error) {
      alert("Error al guardar el envío");
    }
  };

  const handleEditShipment = (shipment) => {
    setEditingShipment(shipment);
    setShowForm(true);
    setViewingShipment(null);
  };

  const handleDeleteShipment = async (shipmentId) => {
    try {
      await onDeleteShipment(shipmentId);
      alert("Envío eliminado correctamente");
    } catch (error) {
      alert("Error al eliminar el envío");
    }
  };

  const handleViewShipment = (shipment) => {
    setViewingShipment(shipment);
  };

  const handleCloseCard = () => {
    setViewingShipment(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingShipment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header con título y botón */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Logística
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            <span className="text-emerald-400 font-bold">{filteredShipments.length}</span> de {shipmentsData.length} envíos gestionados
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 font-bold shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Envío</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
          <div className="text-gray-400 text-sm">Total</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {stats.preparando}
          </div>
          <div className="text-gray-400 text-sm">Preparando</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {stats.pendientes}
          </div>
          <div className="text-gray-400 text-sm">Pendientes</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {stats.enviados}
          </div>
          <div className="text-gray-400 text-sm">Enviados</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {stats.entregados}
          </div>
          <div className="text-gray-400 text-sm">Entregados</div>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Buscador */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Buscar envío
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por ID, destino, destinatario o tracking..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Filtro por Status */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
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

          {/* Filtro por Destino */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Destino
            </label>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="todos" className="text-white bg-gray-700">
                Todos los destinos
              </option>
              {uniqueDestinations.map((destination) => (
                <option
                  key={destination}
                  value={destination}
                  className="text-white bg-gray-700"
                >
                  {destination}
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
              {statusFilter !== "todos" && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs capitalize">
                  Estado: {statusFilter}
                </span>
              )}
              {destinationFilter !== "todos" && (
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">
                  Destino: {destinationFilter}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <span>Limpiar filtros</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabla de envíos */}
      <ShipmentsTable
        shipments={filteredShipments}
        onEditShipment={handleEditShipment}
        onDeleteShipment={handleDeleteShipment}
        onViewShipment={handleViewShipment}
      />

      {/* Estado cuando no hay resultados */}
      {filteredShipments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">
            {hasActiveFilters
              ? "No se encontraron envíos con los filtros aplicados"
              : "No hay envíos registrados"}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Limpiar filtros para ver todos los envíos
            </button>
          )}
        </div>
      )}

      {/* Formulario para crear/editar */}
      {(showForm || editingShipment) && (
        <ShipmentForm
          onSave={handleSaveShipment}
          onCancel={handleCancelForm}
          shipment={editingShipment}
          cameras={camerasData}
          workers={workersData}
          shipmentsData={shipmentsData} // ← Agregar esta línea
          isOpen={true}
        />
      )}

      {/* Tarjeta de envío */}
      {viewingShipment && (
        <ShipmentCard
          shipment={viewingShipment}
          onClose={handleCloseCard}
          onEdit={handleEditShipment}
        />
      )}
    </div>
  );
};

export default Logistics;
