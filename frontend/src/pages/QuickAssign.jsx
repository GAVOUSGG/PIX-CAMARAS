import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, User, Camera as CameraIcon, Zap, Check, X, Command, Filter, ArrowRight, Activity, MapPin, Box } from 'lucide-react';

// --- COMPONENTE TOAST ---
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md ${
        type === 'success' 
          ? 'bg-emerald-500/90 border-emerald-400 text-white shadow-emerald-500/20' 
          : 'bg-red-500/90 border-red-400 text-white shadow-red-500/20'
      }`}>
        {type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
        <p className="font-bold text-sm tracking-wide">{message}</p>
        <button onClick={onClose} className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE COMMAND PALETTE ---
const CommandPalette = ({ isOpen, onClose, cameras, onSelect, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return cameras.filter(c => 
      String(c.id).toLowerCase().includes(term) || 
      (c.model && c.model.toLowerCase().includes(term)) ||
      (c.type && c.type.toLowerCase().includes(term)) ||
      (c.assignedTo && c.assignedTo.toLowerCase().includes(term))
    ).slice(0, 10);
  }, [cameras, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-32 px-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border ${
        darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-black/10'
      }`}>
        <div className={`flex items-center px-4 py-4 border-b ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
          <Search className={`w-5 h-5 mr-3 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cámara por ID, modelo, tipo o asignado a..."
            className={`flex-1 bg-transparent border-none outline-none text-lg font-medium ${
              darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          <div className={`px-2 py-1 flex items-center gap-1 rounded text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
            <span>ESC</span>
          </div>
        </div>

        {searchTerm && (
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
            {results.length > 0 ? (
              results.map(camera => {
                const isAssigned = !!camera.assignedTo;
                return (
                  <button
                    key={camera.id}
                    onClick={() => {
                      if (!isAssigned) {
                        onSelect(camera.id);
                        onClose();
                      }
                    }}
                    disabled={isAssigned}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left mb-1 ${
                      isAssigned 
                        ? (darkMode ? 'opacity-50 cursor-not-allowed' : 'opacity-50 bg-slate-50 cursor-not-allowed')
                        : (darkMode ? 'hover:bg-white/5 active:scale-[0.99]' : 'hover:bg-slate-50 active:scale-[0.99]')
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <CameraIcon className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{camera.id}</span>
                          {isAssigned && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-500 font-bold uppercase">
                              Asignado
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{camera.model} • {camera.location}</p>
                      </div>
                    </div>
                    {isAssigned && (
                      <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {camera.assignedTo}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500">
                <p className="text-sm">No se encontraron resultados para "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// --- PÁGINA PRINCIPAL ---
const QuickAssign = ({ camerasData, workersData, onUpdateCamera, onCreateCameraHistoryEntry, darkMode }) => {
  const [localCameras, setLocalCameras] = useState([]);
  
  // Selección
  const [selectedCameraIds, setSelectedCameraIds] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  // Filtros
  const [cameraSearch, setCameraSearch] = useState('');
  const [cameraTypeFilter, setCameraTypeFilter] = useState('');
  const [workerSearch, setWorkerSearch] = useState('');
  
  // UI States
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Sincronizar estado local con props cuando cambian
  useEffect(() => {
    setLocalCameras(camerasData);
  }, [camerasData]);

  // Atajo de teclado para Command Palette (Ctrl+K o Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
      if (e.key === 'Escape' && isCommandOpen) {
        setIsCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandOpen]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // --- DERIVACIÓN DE DATOS ---

  const activeWorkers = useMemo(() => {
    let filtered = workersData.filter(w => w.status !== 'inactivo');
    if (workerSearch) {
      const term = workerSearch.toLowerCase();
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(term) || 
        w.state.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [workersData, workerSearch]);

  const filteredCameras = useMemo(() => {
    let filtered = localCameras;
    
    if (cameraSearch) {
      const term = cameraSearch.toLowerCase();
      filtered = filtered.filter(c => 
        String(c.id).toLowerCase().includes(term) || 
        (c.model && c.model.toLowerCase().includes(term)) ||
        (c.type && c.type.toLowerCase().includes(term))
      );
    }

    if (cameraTypeFilter) {
      filtered = filtered.filter(c => c.type === cameraTypeFilter);
    }

    return filtered;
  }, [localCameras, cameraSearch, cameraTypeFilter]);

  const uniqueCameraTypes = useMemo(() => {
    const types = new Set(localCameras.map(c => c.type).filter(Boolean));
    return Array.from(types).sort();
  }, [localCameras]);

  // --- ESTADÍSTICAS ---
  const totalCameras = localCameras.length;
  const assignedCamerasCount = localCameras.filter(c => c.assignedTo).length;
  const progressPercent = totalCameras > 0 ? Math.round((assignedCamerasCount / totalCameras) * 100) : 0;

  // --- LÓGICA DE ASIGNACIÓN ---

  const handleAssign = async () => {
    if (selectedCameraIds.length === 0 || !selectedWorkerId) return;
    setIsProcessing(true);

    const worker = activeWorkers.find(w => w.id === selectedWorkerId);
    
    if (!worker) {
      setIsProcessing(false);
      return;
    }

    try {
      const updates = { assignedTo: worker.name };
      
      for (const camId of selectedCameraIds) {
        const camera = localCameras.find(c => c.id === camId);
        if (!camera) continue;

        await onUpdateCamera(camId, updates);
        
        // Registrar en el historial
        if (onCreateCameraHistoryEntry) {
          await onCreateCameraHistoryEntry(
            camId,
            'assignment',
            `Asignada a ${worker.name}`,
            { workerId: worker.id, workerName: worker.name, previousStatus: camera.status }
          );
        }
      }
      
      setLocalCameras(prev => prev.map(c => selectedCameraIds.includes(c.id) ? { ...c, assignedTo: worker.name } : c));

      showToast(`${selectedCameraIds.length} ${selectedCameraIds.length === 1 ? 'cámara asignada' : 'cámaras asignadas'} a ${worker.name}`);
      setSelectedCameraIds([]);
      setSelectedWorkerId(null);
    } catch (error) {
      console.error(error);
      showToast('Error al asignar cámaras', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnassign = async (cameraId) => {
    setIsProcessing(true);
    try {
      const updates = { assignedTo: '', location: 'Almacén' };
      await onUpdateCamera(cameraId, updates);
      
      setLocalCameras(prev => prev.map(c => c.id === cameraId ? { ...c, assignedTo: '', location: 'Almacén' } : c));
      
      // Registrar en el historial
      if (onCreateCameraHistoryEntry) {
        await onCreateCameraHistoryEntry(
          cameraId,
          'return',
          `Cámara devuelta al Almacén`,
          { location: 'Almacén' }
        );
      }

      showToast(`Cámara ${cameraId} liberada`);
      if (selectedCameraIds.includes(cameraId)) {
        setSelectedCameraIds(prev => prev.filter(id => id !== cameraId));
      }
    } catch (error) {
      console.error(error);
      showToast('Error al liberar la cámara', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearSelection = () => {
    setSelectedCameraIds([]);
    setSelectedWorkerId(null);
  };

  // Elementos seleccionados actualmente
  const selectedCamerasArray = localCameras.filter(c => selectedCameraIds.includes(c.id));
  const selectedWorkerObj = activeWorkers.find(w => w.id === selectedWorkerId);


  return (
    <div className={`h-full flex flex-col space-y-6 animate-fade-in pb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
      
      {/* Toast & Command Palette */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        cameras={localCameras} 
        darkMode={darkMode}
        onSelect={(id) => {
          setSelectedCameraIds(prev => prev.includes(id) ? prev.filter(camId => camId !== id) : [...prev, id]);
        }}
      />

      {/* HEADER & TOP BAR */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 shrink-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
            <Zap className={`w-8 h-8 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
            Asignación Rápida
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Asigna y libera cámaras rápidamente con esta vista especializada de 3 columnas.</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCommandOpen(true)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 group shadow-sm ${
              darkMode ? 'bg-slate-800 border-white/10 hover:border-emerald-500/50 hover:shadow-emerald-500/20' : 'bg-white border-black/10 hover:border-emerald-400 hover:shadow-emerald-500/20'
            }`}
          >
            <Command className={`w-5 h-5 ${darkMode ? 'text-slate-400 group-hover:text-emerald-400' : 'text-slate-500 group-hover:text-emerald-500'}`} />
            <span className="font-bold text-sm tracking-wide">Búsqueda Global</span>
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
              <span>⌘K</span>
            </div>
          </button>
        </div>
      </div>

      {/* PANEL PRINCIPAL 3 COLUMNAS */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 lg:overflow-hidden overflow-y-auto pb-4 custom-scrollbar">
        
        {/* COLUMNA 1: LISTA DE ACTIVOS */}
        <div className={`w-full lg:w-[300px] xl:w-[350px] shrink-0 flex flex-col rounded-3xl border shadow-sm h-[500px] lg:h-full ${darkMode ? 'bg-[#0B1120] border-white/5' : 'bg-slate-50 border-black/5'}`}>
          <div className="p-5 border-b border-inherit space-y-4">
            <h3 className="font-black text-lg flex items-center gap-2">
            Camaras
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Buscar por ID, modelo..."
                value={cameraSearch}
                onChange={e => setCameraSearch(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  darkMode ? 'bg-white/5 border-white/10 focus:border-emerald-500/50' : 'bg-white border-black/10 focus:border-emerald-400'
                }`}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Filter className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                <select 
                  value={cameraTypeFilter}
                  onChange={e => setCameraTypeFilter(e.target.value)}
                  className={`w-full pl-8 pr-4 py-2 rounded-lg border text-xs outline-none font-bold appearance-none cursor-pointer ${
                    darkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-black/10'
                  }`}
                >
                  <option value="">Todos los tipos</option>
                  {uniqueCameraTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {filteredCameras.map((camera) => {
              const isAssigned = !!camera.assignedTo;
              const isSelected = selectedCameraIds.includes(camera.id);
              
              return (
                <div 
                  key={camera.id}
                  onClick={() => {
                    if (!isAssigned) {
                      setSelectedCameraIds(prev => prev.includes(camera.id) ? prev.filter(id => id !== camera.id) : [...prev, camera.id]);
                    }
                  }}
                  className={`relative p-4 rounded-2xl border transition-all duration-300 ${
                    isAssigned ? (darkMode ? 'opacity-40 border-white/5' : 'opacity-50 border-black/5 bg-slate-100') :
                    isSelected ? (darkMode ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500' : 'border-emerald-500 bg-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500') :
                    (darkMode ? 'bg-slate-800/50 hover:bg-slate-800 border-white/5 hover:border-emerald-500/30 cursor-pointer' : 'bg-white hover:bg-slate-50 border-black/5 hover:border-emerald-400 cursor-pointer shadow-sm')
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <CameraIcon className={`w-4 h-4 ${isSelected ? 'text-emerald-500' : 'opacity-60'}`} />
                      <span className="font-mono font-bold text-sm tracking-tight">{camera.id}</span>
                    </div>
                    {isAssigned ? (
                      <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-slate-500/20 text-slate-500">
                        Asignado
                      </span>
                    ) : (
                      <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded ${
                        isSelected ? 'bg-emerald-500 text-white shadow-lg' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        Disponible
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs font-bold opacity-70 truncate mb-3">{camera.model}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-3 h-3 opacity-50" />
                    <span className="text-[10px] font-medium opacity-80">{camera.location || 'Almacén'}</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded ${
                      darkMode ? 'bg-black/30 text-slate-400' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {camera.type}
                    </span>
                    
                    {isAssigned && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUnassign(camera.id); }}
                        disabled={isProcessing}
                        className="text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Liberar
                      </button>
                    )}
                  </div>
                  
                  {isAssigned && (
                    <div className={`mt-3 pt-2 text-xs border-t font-semibold flex items-center gap-2 ${darkMode ? 'border-white/10 text-slate-300' : 'border-black/5 text-slate-700'}`}>
                      <User className="w-3 h-3 opacity-50" />
                      A: {camera.assignedTo}
                    </div>
                  )}
                </div>
              );
            })}
            
            {filteredCameras.length === 0 && (
              <div className="text-center py-10 opacity-50">
                <p className="text-sm font-medium">No se encontraron cámaras.</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA 2: PANEL DE ACCIÓN CENTRAL */}
        <div className="flex-1 flex flex-col justify-start items-center gap-8 py-8 px-4 rounded-3xl border border-dashed border-emerald-500/30 bg-emerald-500/[0.02] min-h-[400px] lg:min-h-0">
          
          {/* Progress Bar */}
          <div className="w-full max-w-sm shrink-0 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">Camaras Asignadas</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
              <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${progressPercent}%` }}>
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <p className="text-[10px] text-right mt-1 opacity-50">{assignedCamerasCount} de {totalCameras} cámaras</p>
          </div>

          <div className="flex flex-col items-center w-full max-w-sm gap-6">
            
            {/* Cámara Seleccionada Placeholder */}
            <div className={`w-full p-6 rounded-3xl border-2 transition-all duration-500 ${
              selectedCamerasArray.length > 0 ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10' : (darkMode ? 'border-white/5 bg-slate-800/30 border-dashed' : 'border-black/5 bg-white border-dashed')
            }`}>
              {selectedCamerasArray.length === 1 ? (
                <div className="text-center animate-fade-in">
                  <CameraIcon className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                  <h4 className="font-mono font-black text-lg mb-1">{selectedCamerasArray[0].id}</h4>
                  <p className="text-xs opacity-70 mb-2">{selectedCamerasArray[0].model}</p>
                  <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded bg-emerald-500 text-white">
                    Camara Seleccionada
                  </span>
                </div>
              ) : selectedCamerasArray.length > 1 ? (
                <div className="text-center animate-fade-in">
                  <h4 className="font-black text-2xl mb-1 text-emerald-500">{selectedCamerasArray.length}</h4>
                  <p className="text-xs opacity-70 mb-2 font-bold uppercase tracking-widest">Cámaras Seleccionadas</p>
                </div>
              ) : (
                <div className="text-center opacity-40">
                  <p className="text-xs font-semibold uppercase tracking-widest">Selecciona cámaras</p>
                </div>
              )}
            </div>

            <ArrowRight className={`w-6 h-6 rotate-90 lg:rotate-0 transition-colors duration-500 ${
              selectedCamerasArray.length > 0 && selectedWorkerObj ? 'text-emerald-500' : 'opacity-20'
            }`} />

            {/* Trabajador Seleccionado Placeholder */}
             <div className={`w-full p-6 rounded-3xl border-2 transition-all duration-500 ${
              selectedWorkerObj ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10' : (darkMode ? 'border-white/5 bg-slate-800/30 border-dashed' : 'border-black/5 bg-white border-dashed')
            }`}>
              {selectedWorkerObj ? (
                <div className="text-center animate-fade-in">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mb-3">
                    <span className="font-black text-lg">{selectedWorkerObj.name.charAt(0)}</span>
                  </div>
                  <h4 className="font-black text-lg truncate mb-1">{selectedWorkerObj.name}</h4>
                  <p className="text-xs opacity-70 mb-2">{selectedWorkerObj.state}</p>
                  <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded bg-emerald-500 text-white">
                    Trabajador Seleccionado
                  </span>
                </div>
              ) : (
                <div className="text-center opacity-40">
                  <p className="text-xs font-semibold uppercase tracking-widest">Selecciona un trabajador</p>
                </div>
              )}
            </div>
            
          </div>

          <div className="w-full max-w-sm space-y-3 mt-4">
            <button
              onClick={handleAssign}
              disabled={selectedCameraIds.length === 0 || !selectedWorkerId || isProcessing}
              className={`w-full relative py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 overflow-hidden group ${
                selectedCameraIds.length === 0 || !selectedWorkerId || isProcessing
                  ? (darkMode ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed')
                  : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 hover:bg-emerald-400'
              }`}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-emerald-200 border-t-white rounded-full animate-spin" />
                ) : (
                  <>{selectedCamerasArray.length > 1 ? 'Asignar Cámaras' : 'Asignar Cámara'} <ArrowRight className="w-4 h-4" /></>
                )}
              </span>
            </button>

            <button
              onClick={clearSelection}
              disabled={selectedCameraIds.length === 0 && !selectedWorkerId}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                selectedCameraIds.length === 0 && !selectedWorkerId
                  ? 'opacity-0 pointer-events-none'
                  : 'opacity-50 hover:opacity-100 hover:bg-slate-500/10'
              }`}
            >
              Limpiar Selección
            </button>
          </div>
        </div>

        {/* COLUMNA 3: LISTA DE PERSONAS */}
        <div className={`w-full lg:w-[300px] xl:w-[350px] shrink-0 flex flex-col rounded-3xl border shadow-sm h-[500px] lg:h-full ${darkMode ? 'bg-[#0B1120] border-white/5' : 'bg-slate-50 border-black/5'}`}>
          <div className="p-5 border-b border-inherit space-y-4">
             <h3 className="font-black text-lg flex items-center gap-2">
              <User className="w-5 h-5 opacity-70" /> Trabajadores
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Buscar trabajador..."
                value={workerSearch}
                onChange={e => setWorkerSearch(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  darkMode ? 'bg-white/5 border-white/10 focus:border-emerald-500/50' : 'bg-white border-black/10 focus:border-emerald-400'
                }`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {activeWorkers.map((worker) => {
              const assignedToWorkerCount = localCameras.filter(c => c.assignedTo === worker.name).length;
              const isSelected = selectedWorkerId === worker.id;

              return (
                <div 
                  key={worker.id}
                  onClick={() => setSelectedWorkerId(worker.id)}
                  className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden ${
                    isSelected ? (darkMode ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500' : 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500') :
                    (darkMode ? 'bg-slate-800/50 hover:bg-slate-800 border-white/5 hover:border-emerald-500/30' : 'bg-white hover:bg-slate-50 border-black/5 hover:border-emerald-400')
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${
                    isSelected ? 'bg-emerald-500 border-emerald-400 text-white' : (darkMode ? 'bg-slate-900 border-white/10' : 'bg-slate-100 border-black/5')
                  }`}>
                    <span className="font-black text-lg">{worker.name.charAt(0)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm truncate">{worker.name}</h4>
                    <p className="text-[10px] sm:text-xs font-bold opacity-60 uppercase tracking-widest truncate">{worker.state}</p>
                  </div>

                  <div className="text-right">
                    <div className={`text-xl font-black leading-none ${assignedToWorkerCount > 0 ? 'text-emerald-500' : 'opacity-20'}`}>
                      {assignedToWorkerCount}
                    </div>
                    <p className="text-[8px] uppercase tracking-widest font-bold opacity-50">Camaras</p>
                  </div>
                </div>
              );
            })}

            {activeWorkers.length === 0 && (
              <div className="text-center py-10 opacity-50">
                <p className="text-sm font-medium">No se encontraron trabajadores.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuickAssign;
