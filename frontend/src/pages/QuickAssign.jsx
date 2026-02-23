import React, { useState, useMemo, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  useDroppable,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Search, User, Camera as CameraIcon, CheckCircle2, Zap, ZapOff } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- COMPONENTES INTERNOS PARA DND ---

const SortableCameraCard = ({ camera, darkMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: camera.id, data: { type: 'Camera', camera } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`rounded-2xl border-2 border-dashed ${darkMode ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-emerald-400 bg-emerald-50'} h-24 opacity-50`}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 rounded-2xl border transition-all duration-300 cursor-grab active:cursor-grabbing hover:-translate-y-1 shadow-sm hover:shadow-md ${
        darkMode 
          ? 'bg-slate-800/80 border-white/5 hover:border-emerald-500/30' 
          : 'bg-white border-black/5 hover:border-emerald-400'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CameraIcon className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
          <span className="text-xs font-black font-mono">{camera.id}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${camera.status === 'en uso' ? 'bg-red-500' : 'bg-emerald-500'}`} />
      </div>
      <p className={`text-[10px] font-bold truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{camera.model}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded ${
          darkMode ? 'bg-black/30 text-slate-400' : 'bg-slate-100 text-slate-500'
        }`}>
          {camera.type}
        </span>
      </div>
    </div>
  );
};

const WorkerColumn = ({ worker, cameras, darkMode }) => {
  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: worker ? worker.id : 'pool',
    data: {
      type: 'Column',
      worker
    }
  });

  return (
    <div 
      ref={setDroppableNodeRef}
      className={`flex flex-col h-full rounded-3xl border transition-colors duration-500 ${
        darkMode 
          ? 'bg-[#0B1120] border-white/5' 
          : 'bg-slate-50/50 border-black/5 shadow-sm'
      } ${isOver ? (darkMode ? 'ring-2 ring-emerald-500/50' : 'ring-2 ring-emerald-400') : ''}`}
    >
      {/* Header de la columna */}
      <div className={`p-5 rounded-t-3xl border-b transition-colors duration-500 ${
        darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5'
      }`}>
        <div className="flex items-center justify-between mb-2">
          {worker ? (
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                darkMode ? 'bg-slate-800 border-white/10 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
              }`}>
                <User className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h3 className={`font-black truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{worker.name}</h3>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">{worker.state}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                  darkMode ? 'bg-slate-800 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-black truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>Pool de Cámaras</h3>
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">Listas para usar</p>
                </div>
            </div>
          )}
          
          <div className={`px-3 py-1 rounded-xl text-sm font-black transition-colors ${
            cameras.length > 0 
              ? darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
              : darkMode ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'
          }`}>
            {cameras.length}
          </div>
        </div>
      </div>

      {/* Área droppable */}
      <div 
        className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3 min-h-[150px]"
      >
        <SortableContext items={cameras.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cameras.map(camera => (
            <SortableCameraCard key={camera.id} camera={camera} darkMode={darkMode} />
          ))}
        </SortableContext>
        
        {cameras.length === 0 && (
          <div className={`m-auto text-center border-2 border-dashed rounded-2xl p-6 ${
            darkMode ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'
          }`}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2">Columna vacía</p>
            <p className="text-[10px]">Arrastra cámaras aquí</p>
          </div>
        )}
      </div>
    </div>
  );
};


// --- PÁGINA PRINCIPAL ---

const QuickAssign = ({ camerasData, workersData, onUpdateCamera, darkMode }) => {
  const [activeId, setActiveId] = useState(null);
  const [localCameras, setLocalCameras] = useState([]);
  
  // Filtros
  const [workerSearch, setWorkerSearch] = useState('');
  const [cameraSearch, setCameraSearch] = useState('');

  // Sincronizar estado local con props cuando cambian
  useEffect(() => {
    setLocalCameras(camerasData);
  }, [camerasData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px de tolerancia antes de iniciar drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Derivar datos
  const filteredCameras = useMemo(() => {
    if (!cameraSearch) return localCameras;
    const term = cameraSearch.toLowerCase();
    return localCameras.filter(c => 
      c.id.toString().toLowerCase().includes(term) || 
      (c.model && c.model.toLowerCase().includes(term)) ||
      (c.type && c.type.toLowerCase().includes(term))
    );
  }, [localCameras, cameraSearch]);

  const poolCameras = useMemo(() => {
    return filteredCameras.filter(c => !c.assignedTo || c.assignedTo === '');
  }, [filteredCameras]);

  const activeWorkers = useMemo(() => {
    let filtered = workersData.filter(w => w.status !== 'inactivo');
    
    if (workerSearch) {
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(workerSearch.toLowerCase()) || 
        w.state.toLowerCase().includes(workerSearch.toLowerCase())
      );
    }
    return filtered;
  }, [workersData, workerSearch]);

  const getWorkerCameras = (workerName) => {
    return filteredCameras.filter(c => c.assignedTo === workerName);
  };

  // --- Handlers DND ---

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {};

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const cameraId = active.id;
    const targetId = over.id; // Puede ser ID de otro sortable(camera) o ID de colum(worker / 'pool')

    // Encontrar cámara arrastrada
    const camera = localCameras.find(c => String(c.id) === String(cameraId));
    if (!camera) return;

    // Determinar destino
    let targetWorkerName = '';
    
    // Si se soltó sobre una columna explícita
    if (String(targetId) === 'pool') {
      targetWorkerName = '';
    } else if (workersData.find(w => String(w.id) === String(targetId))) {
      const worker = workersData.find(w => String(w.id) === String(targetId));
      targetWorkerName = worker.name;
    } else {
      // Si se soltó sobre OTRA cámara, buscar a quién pertenece esa cámara
      const targetCamera = localCameras.find(c => String(c.id) === String(targetId));
      if (targetCamera) {
        targetWorkerName = targetCamera.assignedTo || '';
      }
    }

    // Si no hay cambio real, ignorar
    if (camera.assignedTo === targetWorkerName) return;

    // --- ACTUALIZACIÓN OPTIMISTA (UI INMEDIATA) ---
    setLocalCameras(prev => prev.map(c => {
      if (String(c.id) === String(cameraId)) {
        return {
          ...c,
          assignedTo: targetWorkerName
          // Mantenemos el status original según requerimiento
        };
      }
      return c;
    }));

    // --- ACTUALIZACIÓN BACKEND ---
    try {
      const updates = {
        assignedTo: targetWorkerName
      };
      // Si se envía al pool, regresamos ubicación al almacén
      if (!targetWorkerName) {
        updates.location = 'Almacén';
      }
      // Aquí llamamos a onUpdateCamera del hook (MainApp lo pasa)
      await onUpdateCamera(cameraId, updates);

      // El registro en el historial (CameraHistory) idealmente se hace en useAppState.js 
      // Si logramos integrarlo allí, no necesitamos llamar fetch aquí extra.
    } catch (error) {
      console.error("Error al asignar cámara:", error);
      // Revertir optimista si falla
      setLocalCameras(camerasData);
      alert("Hubo un error al mover la cámara. Intenta de nuevo.");
    }
  };


  // --- Renderizado del drag overlay (tarjeta fantasma) ---
  const activeCamera = useMemo(() => {
    return activeId ? localCameras.find(c => c.id === activeId) : null;
  }, [activeId, localCameras]);


  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <Zap className={`w-8 h-8 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
            Asignación Rápida
          </h2>
          <p className="text-slate-500 text-sm mt-1">Arrastra las cámaras desde el pool hacia los trabajadores para asignarlas al instante.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative group w-full sm:w-64">
            <input
              type="text"
              value={cameraSearch}
              onChange={(e) => setCameraSearch(e.target.value)}
              placeholder="Buscar cámara (ID, modelo)..."
              className={`w-full border rounded-xl px-4 py-2.5 pl-10 transition-all duration-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 group-hover:bg-white/10' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 group-hover:bg-slate-100'
              }`}
            />
            <CameraIcon className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors ${
              darkMode ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-500'
            }`} />
          </div>

          <div className="relative group w-full sm:w-64">
            <input
              type="text"
              value={workerSearch}
              onChange={(e) => setWorkerSearch(e.target.value)}
              placeholder="Buscar trabajador..."
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
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
          
          {/* COLUMNA: POOL DE CÁMARAS DISPONIBLES */}
          <div className="w-full lg:w-80 shrink-0 h-[400px] lg:h-full">
            <WorkerColumn 
              worker={null} 
              cameras={poolCameras} 
              darkMode={darkMode} 
            />
          </div>

          {/* COLUMNAS: TRABAJADORES */}
          <div className={`flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar h-[500px] lg:h-full p-1 rounded-3xl ${
            darkMode ? 'bg-white/[0.02]' : 'bg-slate-50'
          }`}>
            {activeWorkers.map(worker => (
              <div key={worker.id} className="w-80 shrink-0 h-full">
                <WorkerColumn 
                  worker={worker} 
                  cameras={getWorkerCameras(worker.name)} 
                  darkMode={darkMode} 
                />
              </div>
            ))}
            
            {activeWorkers.length === 0 && (
              <div className="m-auto text-center p-8">
                <p className={`font-black uppercase tracking-widest text-sm ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>No se encontraron trabajadores</p>
              </div>
            )}
          </div>
        </div>

        {/* CUSTOM DRAG OVERLAY */}
        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
          {activeCamera ? (
            <div className={`p-4 rounded-2xl border-2 shadow-2xl rotate-3 scale-105 cursor-grabbing ${
              darkMode 
                ? 'bg-slate-800 border-emerald-500 shadow-emerald-500/20' 
                : 'bg-white border-emerald-400 shadow-emerald-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <CameraIcon className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                <span className={`text-xs font-black font-mono ${darkMode ? 'text-white' : 'text-slate-900'}`}>{activeCamera.id}</span>
              </div>
              <p className={`text-[10px] font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{activeCamera.model}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default QuickAssign;
