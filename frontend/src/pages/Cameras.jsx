import React, { useState, useMemo, Suspense } from 'react';
import CamerasTable from '../components/Cameras/CamerasTable';
import CameraForm from '../components/Cameras/CameraForm';
import CameraCard from '../components/Cameras/CameraCard';
import { Search, Filter, Plus, Package } from 'lucide-react';

const Cameras = ({ camerasData, workersData, onCreateCamera, onUpdateCamera, onDeleteCamera, onInspectCamera, darkMode = true }) => {
  const [editingCamera, setEditingCamera] = useState(null);
  const [viewingCamera, setViewingCamera] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAssigningToWarehouse, setIsAssigningToWarehouse] = useState(false);
  
  // Estados para el buscador y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [locationFilter, setLocationFilter] = useState('todos');

  // Obtener datos Òºnicos para los filtros
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

  // Filtrar cÒ¡maras
  const filteredCameras = useMemo(() => {
    return camerasData.filter(camera => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        (camera.id && camera.id.toString().toLowerCase().includes(searchLower)) ||
        (camera.model && camera.model.toString().toLowerCase().includes(searchLower)) ||
        (camera.location && camera.location.toString().toLowerCase().includes(searchLower)) ||
        (camera.serialNumber && camera.serialNumber.toString().toLowerCase().includes(searchLower));
      
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
    try {
      if (editingCamera) {
        await onUpdateCamera(editingCamera.id, cameraData);
        alert("CÒ¡mara actualizada correctamente");
      } else {
        await onCreateCamera(cameraData);
        alert("CÒ¡mara creada correctamente");
      }
      setShowForm(false);
      setEditingCamera(null);
    } catch (error) {
      alert("Error al guardar la cÒ¡mara");
    }
  };

  const handleEditCamera = (camera) => {
    setEditingCamera(camera);
    setShowForm(true);
    setViewingCamera(null);
  };

  const handleDeleteCamera = async (cameraId) => {
    try {
      await onDeleteCamera(cameraId);
      alert("CÒ¡mara eliminada correctamente");
    } catch (error) {
      alert("Error al eliminar la cÒ¡mara");
    }
  };

  const handleViewCamera = (camera) => {
    setViewingCamera(camera);
  };

  const handleCloseCard = () => {
    setViewingCamera(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCamera(null);
  };

  // FunciÒ³n para asignar todas las cÒ¡maras a almacÒ©n
  const handleAssignAllToWarehouse = async () => {
    // Confirmar acciÒ³n
    const confirmMessage = hasActiveFilters
      ? `�¿EstÒ¡s seguro de que quieres asignar todas las ${filteredCameras.length} cÒ¡maras filtradas a AlmacÒ©n?\n\nEsto cambiarÒ¡ su ubicaciÒ³n a "AlmacÒ©n", estado a "disponible" y las desasignarÒ¡ de cualquier trabajador.`
      : `�¿EstÒ¡s seguro de que quieres asignar todas las ${camerasData.length} cÒ¡maras a AlmacÒ©n?\n\nEsto cambiarÒ¡ su ubicaciÒ³n a "AlmacÒ©n", estado a "disponible" y las desasignarÒ¡ de cualquier trabajador.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsAssigningToWarehouse(true);
    const camerasToUpdate = hasActiveFilters ? filteredCameras : camerasData;
    let successCount = 0;
    let errorCount = 0;

    try {
      // Actualizar cada cÒ¡mara
      for (const camera of camerasToUpdate) {
        try {
          // Solo actualizar si no estÒ¡ ya en almacÒ©n y disponible
          if (camera.location !== 'AlmacÒ©n' || camera.status !== 'disponible' || camera.assignedTo) {
            await onUpdateCamera(camera.id, {
              location: 'AlmacÒ©n',
              status: 'disponible',
              assignedTo: '', // Limpiar asignaciÒ³n
            });
            successCount++;
          }
        } catch (error) {
          console.error(`Error actualizando cÒ¡mara ${camera.id}:`, error);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        alert(`â�⬦ ${successCount} ${successCount === 1 ? 'cÒ¡mara actualizada' : 'cÒ¡maras actualizadas'} correctamente a AlmacÒ©n.`);
      } else {
        alert(`âš ï¸ ${successCount} cÒ¡maras actualizadas, ${errorCount} errores.`);
      }
    } catch (error) {
      console.error('Error en asignaciÒ³n masiva:', error);
      alert('Error al asignar cÒ¡maras a almacÒ©n. Por favor intenta nuevamente.');
    } finally {
      setIsAssigningToWarehouse(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header con tÒ­tulo y botones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Inventario de Camaras</h2>
          <p className="text-zinc-500 text-sm mt-1">
            <span className="text-emerald-400 font-bold">{filteredCameras.length}</span> de {camerasData.length} camaras registradas
          </p>
        </div>
        <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={handleAssignAllToWarehouse}
            disabled={isAssigningToWarehouse || (hasActiveFilters ? filteredCameras.length === 0 : camerasData.length === 0)}
            className={`border px-4 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 font-bold text-sm tracking-wide ${
              darkMode 
                ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20 disabled:bg-zinc-800 disabled:text-zinc-600' 
                : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 disabled:bg-zinc-100 disabled:text-zinc-400'
            }`}
          >
            <Package className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>
              {isAssigningToWarehouse 
                ? 'Asignando...' 
                : hasActiveFilters 
                  ? `Resetear (${filteredCameras.length})`
                  : 'Resetear Todo'}
            </span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="group bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Agregar CÒ¡mara</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'En uso', count: camerasData.filter(c => c.status === 'en uso').length, color: 'red', val: 'en uso' },
          { label: 'Disponibles', count: camerasData.filter(c => c.status === 'disponible').length, color: 'emerald', val: 'disponible' },
          { label: 'Mantenimiento', count: camerasData.filter(c => c.status === 'mantenimiento').length, color: 'orange', val: 'mantenimiento' },
          { label: 'Total', count: camerasData.length, color: 'blue', val: 'todos' }
        ].map((stat, i) => (
          <button 
            key={i}
            onClick={() => setStatusFilter(stat.val)}
            className={`p-4 rounded-2xl border transition-all duration-500 text-left group hover:scale-[1.02] ${
              darkMode ? 'bg-zinc-900 border-white/5 hover:border-white/20' : 'bg-white border-black/5 shadow-sm hover:border-black/10'
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black transition-colors duration-500 ${
              darkMode ? 'text-white' : 'text-zinc-900'
            }`}>{stat.count}</p>
            <div className={`h-1 w-8 mt-2 rounded-full transition-all duration-500 bg-${stat.color}-500/50 group-hover:w-full`}></div>
          </button>
        ))}
      </div>

      {/* Buscador y Filtros */}
      <div className={`rounded-2xl border p-6 transition-all duration-500 ${
        darkMode ? 'bg-zinc-900/50 border-white/5 shadow-2xl backdrop-blur-lg' : 'bg-white border-black/5 shadow-sm'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5 ml-1 leading-none">
              <Search className="w-3.5 h-3.5 inline mr-1" />
              Buscador inteligente
            </label>
            <div className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID, modelo, serie o ubicacion..."
                className={`w-full border rounded-xl px-4 py-2.5 pl-10 transition-all duration-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 text-white placeholder-zinc-500 group-hover:bg-white/10' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 group-hover:bg-zinc-100'
                }`}
              />
              <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -tranzinc-y-1/2 transition-colors ${
                darkMode ? 'text-zinc-500 group-focus-within:text-emerald-400' : 'text-zinc-400 group-focus-within:text-emerald-500'
              }`} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5 ml-1 leading-none">Estatus</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm appearance-none outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <option value="todos" className={darkMode ? "bg-zinc-900" : "bg-white"}>Cualquier estado</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status} className={`${darkMode ? "bg-zinc-900" : "bg-white"} capitalize`}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5 ml-1 leading-none">Modelo / Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm appearance-none outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <option value="todos" className={darkMode ? "bg-zinc-900" : "bg-white"}>Todos los tipos</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type} className={darkMode ? "bg-zinc-900" : "bg-white"}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5 ml-1 leading-none">UbicaciÒ³n</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm appearance-none outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <option value="todos" className={darkMode ? "bg-zinc-900" : "bg-white"}>Todas las sedes</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location} className={darkMode ? "bg-zinc-900" : "bg-white"}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters Active Display */}
        {hasActiveFilters && (
          <div className={`mt-4 flex flex-wrap items-center justify-between pt-4 border-t gap-3 transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-zinc-100'}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mr-2">Filtros:</span>
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
               {searchTerm && <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${darkMode ? 'bg-white/5 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>"{searchTerm}"</span>}
               {statusFilter !== 'todos' && <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 uppercase'}`}>{statusFilter}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Tabla de cÒ¡maras */}
      <div className={`rounded-3xl border overflow-hidden transition-all duration-500 ${
        darkMode ? 'bg-zinc-950 border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-zinc-200'
      }`}>
        <CamerasTable 
          cameras={filteredCameras}
          onEditCamera={handleEditCamera}
          onDeleteCamera={handleDeleteCamera}
          onViewCamera={handleViewCamera}
          onInspectCamera={onInspectCamera}
          darkMode={darkMode}
        />
      </div>

      {/* Empty States */}
      {filteredCameras.length === 0 && (
        <div className={`text-center py-20 rounded-3xl border border-dashed transition-all duration-500 ${
          darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-zinc-50 border-zinc-200'
        }`}>
          <div className={`text-lg mb-4 font-medium transition-colors duration-500 ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {hasActiveFilters ? 'No se encontraron cÒ¡maras con los filtros aplicados' : 'No hay cÒ¡maras registradas'}
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
        {(showForm || editingCamera) && (
          <CameraForm
            onSave={handleSaveCamera}
            onCancel={handleCancelForm}
            camera={editingCamera}
            workers={workersData}
            isOpen={true}
            darkMode={darkMode}
          />
        )}
        
        {viewingCamera && (
          <CameraCard
            camera={viewingCamera}
            onClose={handleCloseCard}
            onEdit={handleEditCamera}
            darkMode={darkMode}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Cameras;