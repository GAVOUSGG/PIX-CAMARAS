import React, { useState, useMemo, Suspense } from "react";
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
  darkMode = true,
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
    <div className="space-y-6 animate-fade-in">
      {/* Header con título y botón */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Logística
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            <span className="text-emerald-400 font-bold">{filteredShipments.length}</span> de {shipmentsData.length} envíos gestionados
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 font-bold shadow-lg shadow-emerald-500/20 active:scale-95 group"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          <span>Nuevo Envío</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', count: stats.total, color: 'blue', val: 'todos' },
          { label: 'Preparando', count: stats.preparando, color: 'yellow', val: 'preparando' },
          { label: 'Pendientes', count: stats.pendientes, color: 'orange', val: 'pendiente' },
          { label: 'Enviados', count: stats.enviados, color: 'emerald', val: 'enviado' },
          { label: 'Entregados', count: stats.entregados, color: 'purple', val: 'entregado' }
        ].map((stat, i) => (
          <button 
            key={i}
            onClick={() => setStatusFilter(stat.val)}
            className={`p-4 rounded-2xl border transition-all duration-500 text-left group hover:scale-[1.02] ${
              darkMode ? 'bg-slate-900 border-white/5 hover:border-white/20' : 'bg-white border-black/5 shadow-sm hover:border-black/10'
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black transition-colors duration-500 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>{stat.count}</p>
            <div className={`h-1 w-8 mt-2 rounded-full transition-all duration-500 bg-${stat.color}-500/50 group-hover:w-full`}></div>
          </button>
        ))}
      </div>

      {/* Buscador y Filtros */}
      <div className={`rounded-2xl border p-6 transition-all duration-500 ${
        darkMode ? 'bg-slate-900/50 border-white/5 shadow-2xl backdrop-blur-lg' : 'bg-white border-black/5 shadow-sm'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1 leading-none">
              <Search className="w-3.5 h-3.5 inline mr-1" />
              Buscador inteligente
            </label>
            <div className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID, destino, destinatario..."
                className={`w-full border rounded-xl px-4 py-2.5 pl-10 transition-all duration-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 ${
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

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1 leading-none">Estado del envío</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm appearance-none outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
              }`}
            >
              <option value="todos" className={darkMode ? "bg-slate-900" : "bg-white"}>Todos los estados</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status} className={`${darkMode ? "bg-slate-900" : "bg-white"} capitalize`}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1 leading-none">Destino / Sede</label>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm appearance-none outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
              }`}
            >
              <option value="todos" className={darkMode ? "bg-slate-900" : "bg-white"}>Todos los destinos</option>
              {uniqueDestinations.map((destination) => (
                <option key={destination} value={destination} className={darkMode ? "bg-slate-900" : "bg-white"}>{destination}</option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className={`mt-4 flex flex-wrap items-center justify-between pt-4 border-t gap-3 transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mr-2">Filtros:</span>
              <button 
                onClick={clearFilters}
                className={`text-[10px] font-black uppercase tracking-widest underline underline-offset-4 decoration-emerald-500/30 transition-colors duration-300 ${
                  darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
                }`}
              >
                Limpiar todo
              </button>
            </div>
            <div className="flex items-center space-x-2">
               {searchTerm && <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${darkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>"{searchTerm}"</span>}
               {statusFilter !== 'todos' && <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 uppercase'}`}>{statusFilter}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Tabla de envíos */}
      <div className={`rounded-3xl border overflow-hidden transition-all duration-500 ${
        darkMode ? 'bg-[#0B1120] border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-slate-200'
      }`}>
        <ShipmentsTable
          shipments={filteredShipments}
          onEditShipment={handleEditShipment}
          onDeleteShipment={handleDeleteShipment}
          onViewShipment={handleViewShipment}
          darkMode={darkMode}
        />
      </div>

      {/* Empty States */}
      {filteredShipments.length === 0 && (
        <div className={`text-center py-20 rounded-3xl border border-dashed transition-all duration-500 ${
          darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-lg mb-4 font-medium transition-colors duration-500 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {hasActiveFilters
              ? "No se encontraron envíos con los filtros aplicados"
              : "No hay envíos registrados"}
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

      {/* Modals and Forms */}
      <Suspense fallback={null}>
        {(showForm || editingShipment) && (
          <ShipmentForm
            onSave={handleSaveShipment}
            onCancel={handleCancelForm}
            shipment={editingShipment}
            cameras={camerasData}
            workers={workersData}
            shipmentsData={shipmentsData}
            isOpen={true}
            darkMode={darkMode}
          />
        )}

        {viewingShipment && (
          <ShipmentCard
            shipment={viewingShipment}
            onClose={handleCloseCard}
            onEdit={handleEditShipment}
            darkMode={darkMode}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Logistics;
