import React, { useState, useMemo } from 'react';
import CamerasTable from '../components/Cameras/CamerasTable';
import CameraForm from '../components/Cameras/CameraForm';
import CameraCard from '../components/Cameras/CameraCard';
import { Search, Filter, Plus } from 'lucide-react';

const Cameras = ({ camerasData, workersData, onCreateCamera, onUpdateCamera, onDeleteCamera }) => {
  const [editingCamera, setEditingCamera] = useState(null);
  const [viewingCamera, setViewingCamera] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Estados para el buscador y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [locationFilter, setLocationFilter] = useState('todos');

  // Obtener datos únicos para los filtros
  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(camerasData.map(camera => camera.status))];
    return statuses.sort();
  }, [camerasData]);

  const uniqueTypes = useMemo(() => {
    const types = [...new Set(camerasData.map(camera => camera.type))];
    return types.sort();
  }, [camerasData]);

  const uniqueLocations = useMemo(() => {
    const locations = [...new Set(camerasData.map(camera => camera.location))];
    return locations.sort();
  }, [camerasData]);

  // Filtrar cámaras
  const filteredCameras = useMemo(() => {
    return camerasData.filter(camera => {
      const matchesSearch = searchTerm === '' || 
        camera.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'todos' || camera.status === statusFilter;
      const matchesType = typeFilter === 'todos' || camera.type === typeFilter;
      const matchesLocation = locationFilter === 'todos' || camera.location === locationFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesLocation;
    });
  }, [camerasData, searchTerm, statusFilter, typeFilter, locationFilter]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setTypeFilter('todos');
    setLocationFilter('todos');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'todos' || typeFilter !== 'todos' || locationFilter !== 'todos';

  // Funciones para manejar las acciones
  const handleSaveCamera = async (cameraData) => {
    console.log("💾 Guardando cámara:", cameraData);
    try {
      if (editingCamera) {
        await onUpdateCamera(editingCamera.id, cameraData);
        alert("Cámara actualizada correctamente");
      } else {
        await onCreateCamera(cameraData);
        alert("Cámara creada correctamente");
      }
      setShowForm(false);
      setEditingCamera(null);
    } catch (error) {
      console.error("❌ Error guardando cámara:", error);
      alert("Error al guardar la cámara");
    }
  };

  const handleEditCamera = (camera) => {
    console.log("✏️ Editando cámara:", camera);
    setEditingCamera(camera);
    setShowForm(true);
    setViewingCamera(null);
  };

  const handleDeleteCamera = async (cameraId) => {
    console.log("🗑️ Eliminando cámara:", cameraId);
    try {
      await onDeleteCamera(cameraId);
      alert("Cámara eliminada correctamente");
    } catch (error) {
      console.error("❌ Error eliminando cámara:", error);
      alert("Error al eliminar la cámara");
    }
  };

  const handleViewCamera = (camera) => {
    console.log("👀 Viendo cámara:", camera);
    setViewingCamera(camera);
  };

  const handleCloseCard = () => {
    setViewingCamera(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCamera(null);
  };

  return (
    <div className="space-y-6">
      {/* Header con título y botón */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Inventario de Cámaras Solares Hikvision</h2>
          <p className="text-gray-400 text-sm">
            {filteredCameras.length} de {camerasData.length} cámaras mostradas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Cámara</span>
        </button>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Buscador */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Buscar cámara
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por ID, modelo, serie o ubicación..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
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
              <option value="todos" className="text-white bg-gray-700">Todos los estatus</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status} className="text-white bg-gray-700 capitalize">
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Tipo
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="todos" className="text-white bg-gray-700">Todos los tipos</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type} className="text-white bg-gray-700">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Ubicación
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="todos" className="text-white bg-gray-700">Todas las ubicaciones</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location} className="text-white bg-gray-700">
                  {location}
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
              {statusFilter !== 'todos' && (
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs capitalize">
                  Estatus: {statusFilter}
                </span>
              )}
              {typeFilter !== 'todos' && (
                <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                  Tipo: {typeFilter}
                </span>
              )}
              {locationFilter !== 'todos' && (
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">
                  Ubicación: {locationFilter}
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

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {camerasData.filter(c => c.status === 'en uso').length}
          </div>
          <div className="text-gray-400 text-sm">En uso</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {camerasData.filter(c => c.status === 'disponible').length}
          </div>
          <div className="text-gray-400 text-sm">Disponibles</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {camerasData.filter(c => c.status === 'mantenimiento').length}
          </div>
          <div className="text-gray-400 text-sm">Mantenimiento</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {camerasData.length}
          </div>
          <div className="text-gray-400 text-sm">Total</div>
        </div>
      </div>

      {/* Tabla de cámaras */}
      <CamerasTable 
        cameras={filteredCameras}
        onEditCamera={handleEditCamera}
        onDeleteCamera={handleDeleteCamera}
        onViewCamera={handleViewCamera}
      />

      {/* Estado cuando no hay resultados */}
      {filteredCameras.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">
            {hasActiveFilters ? 'No se encontraron cámaras con los filtros aplicados' : 'No hay cámaras registradas'}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Limpiar filtros para ver todas las cámaras
            </button>
          )}
        </div>
      )}
      
      {/* Formulario para crear/editar */}
      {(showForm || editingCamera) && (
        <CameraForm
          onSave={handleSaveCamera}
          onCancel={handleCancelForm}
          camera={editingCamera}
          workers={workersData}
          isOpen={true}
        />
      )}
      
      {/* Tarjeta de cámara - SOLO ESTE MODAL */}
      {viewingCamera && (
        <CameraCard
          camera={viewingCamera}
          onClose={handleCloseCard}
          onEdit={handleEditCamera}
        />
      )}
    </div>
  );
};

export default Cameras;