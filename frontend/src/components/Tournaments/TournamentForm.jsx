import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Save,
  Calendar,
  MapPin,
  Users,
  Camera,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";

const TournamentForm = ({
  onSave,
  onCancel,
  workers,
  cameras,
  tournament = null,
  isOpen = false,
}) => {
  const isEditing = !!tournament;
  const [showForm, setShowForm] = useState(isOpen);

  const estadosMexico = [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "CDMX",
    "Coahuila",
    "Colima",
    "Durango",
    "Estado de México",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas",
  ];

  // Helper functions para extraer campo y ciudad de la ubicación
  function extractFieldFromLocation(location) {
    if (!location) return "";
    return location.split(", ")[0] || "";
  }

  function extractCityFromLocation(location) {
    if (!location) return "";
    const parts = location.split(", ");
    return parts.length > 1 ? parts[1] : "";
  }

  // Inicializar formData
  const [formData, setFormData] = useState({
    name: tournament?.name || "",
    state: tournament?.state || "",
    location: extractCityFromLocation(tournament?.location) || "",
    field:
      tournament?.field || extractFieldFromLocation(tournament?.location) || "",
    holes: tournament?.holes || 0,
    days: tournament?.days || 1,
    startDate: tournament?.date || "",
    endDate: tournament?.endDate || "",
    status: tournament?.status || "pendiente",
    workerId: tournament?.workerId?.toString() || "",
    selectedHoles: [], // Ya no se usa para selección, solo compatibilidad visual si fuera necesario
    assignedCameras: tournament?.cameras || [], // Nuevo: cámaras asignadas
  });

  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [cameraAssignmentStatus, setCameraAssignmentStatus] =
    useState("pending"); // pending, complete, insufficient, none

  // Calcular cámaras necesarias
  const requiredCameras = (formData.holes || 0) * 2;

  // Filtrar trabajadores por estado seleccionado
  useEffect(() => {
    if (formData.state) {
      const workersInState = workers.filter(
        (worker) =>
          worker.state === formData.state && worker.status === "disponible"
      );
      setAvailableWorkers(workersInState);

      // Si el trabajador actual no está en el nuevo estado, limpiar selección
      if (
        formData.workerId &&
        !workersInState.find((w) => w.id.toString() === formData.workerId)
      ) {
        setFormData((prev) => ({ ...prev, workerId: "", assignedCameras: [] }));
      }
    } else {
      setAvailableWorkers([]);
    }
  }, [formData.state, workers, formData.workerId]);

  // Encontrar cámaras disponibles del trabajador seleccionado
  useEffect(() => {
    if (formData.workerId) {
      const selectedWorker = workers.find(
        (w) => w.id.toString() === formData.workerId
      );

      if (selectedWorker) {
        // Obtener información completa de las cámaras asignadas al trabajador
        // Buscamos tanto por ID en la lista del trabajador como por nombre en la cámara
        const workerCameras = cameras.filter(
          (camera) =>
            ((selectedWorker.camerasAssigned || []).includes(camera.id) ||
              camera.assignedTo === selectedWorker.name) &&
            camera.status === "disponible"
        );
        setAvailableCameras(workerCameras);

        // Auto-asignar cámaras si el trabajador tiene suficientes
        if (workerCameras.length >= requiredCameras) {
          const camerasToAssign = workerCameras
            .slice(0, requiredCameras)
            .map((c) => c.id);
          setFormData((prev) => ({
            ...prev,
            assignedCameras: camerasToAssign,
          }));
          setCameraAssignmentStatus("complete");
        } else if (workerCameras.length > 0) {
          // Asignar las que tenga disponibles
          setFormData((prev) => ({
            ...prev,
            assignedCameras: workerCameras.map((c) => c.id),
          }));
          setCameraAssignmentStatus("insufficient");
        } else {
          setFormData((prev) => ({ ...prev, assignedCameras: [] }));
          setCameraAssignmentStatus("none");
        }
      } else {
        // El trabajador no tiene cámaras asignadas
        setAvailableCameras([]);
        setFormData((prev) => ({ ...prev, assignedCameras: [] }));
        setCameraAssignmentStatus("none");
      }
    } else {
      setAvailableCameras([]);
      setFormData((prev) => ({ ...prev, assignedCameras: [] }));
      setCameraAssignmentStatus("pending");
    }
  }, [formData.workerId, workers, cameras, requiredCameras]);

  // Calcular la fecha de fin automáticamente
  useEffect(() => {
    if (formData.startDate && formData.days) {
      const start = new Date(formData.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + parseInt(formData.days) - 1);
      setFormData((prev) => ({
        ...prev,
        endDate: end.toISOString().split("T")[0],
      }));
    }
  }, [formData.startDate, formData.days]);

  // Actualizar estado automáticamente basado en fecha y disponibilidad de cámaras
  useEffect(() => {
    let newStatus = "pendiente";

    if (formData.startDate && formData.endDate) {
      const today = new Date();
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (today >= startDate && today <= endDate) {
        newStatus = "activo";
      } else if (today > endDate) {
        newStatus = "terminado";
      }
    }

    // Si no hay cámaras suficientes, marcar como "pendiente de cámaras"
    if (
      cameraAssignmentStatus === "none" ||
      cameraAssignmentStatus === "insufficient"
    ) {
      newStatus = "pendiente";
    }

    setFormData((prev) => ({ ...prev, status: newStatus }));
  }, [formData.startDate, formData.endDate, cameraAssignmentStatus]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHoleCountChange = (count) => {
    const holeCount = parseInt(count);
    setFormData((prev) => ({ ...prev, holes: holeCount }));
  };

  // Función para asignar cámaras manualmente
  const handleCameraSelection = (cameraId) => {
    setFormData((prev) => {
      const isSelected = prev.assignedCameras.includes(cameraId);
      const assignedCameras = isSelected
        ? prev.assignedCameras.filter((id) => id !== cameraId)
        : [...prev.assignedCameras, cameraId];

      return { ...prev, assignedCameras };
    });
  };

  // Obtener cámaras disponibles en el almacén para asignación manual
  const availableWarehouseCameras = useMemo(() => {
    return cameras.filter(
      (camera) =>
        camera.status === "disponible" &&
        camera.location === "Almacén" &&
        !formData.assignedCameras.includes(camera.id)
    );
  }, [cameras, formData.assignedCameras]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Buscar el trabajador seleccionado
    const selectedWorker = formData.workerId
      ? workers.find((w) => w.id.toString() === formData.workerId.toString())
      : null;

    // Para edición, usar el ID existente; para creación, generar nuevo
    const tournamentId = isEditing ? tournament.id : Date.now().toString();

    // Determinar el estado final considerando las cámaras
    let finalStatus = formData.status;
    if (
      cameraAssignmentStatus === "none" ||
      cameraAssignmentStatus === "insufficient"
    ) {
      finalStatus = "pendiente";
    }

    const tournamentData = {
      id: tournamentId,
      name: formData.name,
      location: `${formData.field}, ${formData.location}`,
      state: formData.state,
      date: formData.startDate,
      endDate: formData.endDate,
      status: finalStatus,
      worker: selectedWorker ? selectedWorker.name : "Por asignar",
      workerId: formData.workerId || "",
      workerId: formData.workerId || "",
      cameras: formData.assignedCameras,
      holes: parseInt(formData.holes) || 0,
      days: parseInt(formData.days) || 1,
      field: formData.field,
      cameraStatus: cameraAssignmentStatus, // Nuevo campo para trackear estado de cámaras
      ...(isEditing && { updatedAt: new Date().toISOString() }),
      ...(!isEditing && { createdAt: new Date().toISOString() }),
    };

    try {
      const result = await onSave(tournamentData);

      setShowForm(false);
      if (!isEditing) {
        setFormData({
          name: "",
          state: "",
          location: "",
          field: "",
          holes: [],
          days: 1,
          startDate: "",
          endDate: "",
          status: "pendiente",
          workerId: "",
          selectedHoles: [],
          assignedCameras: [],
        });
        setCameraAssignmentStatus("pending");
      }
    } catch (error) {
      alert(
        `Error al ${
          isEditing ? "actualizar" : "guardar"
        } el torneo. Por favor intenta nuevamente.`
      );
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    onCancel?.();
  };

  // Si el formulario no está abierto y estamos en modo creación, mostrar botón
  if (!showForm && !isEditing) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
      >
        <Save className="w-5 h-5" />
        <span>Nuevo Torneo</span>
      </button>
    );
  }

  // Si estamos en modo edición pero el formulario no está abierto, no mostrar nada
  if (isEditing && !showForm) {
    return null;
  }

  // Función para obtener el mensaje de estado de cámaras
  const getCameraStatusMessage = () => {
    switch (cameraAssignmentStatus) {
      case "complete":
        return {
          message: "Cámaras asignadas correctamente",
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/20",
          borderColor: "border-emerald-500/30",
        };
      case "insufficient":
        return {
          message: `El trabajador tiene ${availableCameras.length} cámaras, pero se necesitan ${requiredCameras}`,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/30",
        };
      case "none":
        return {
          message: "El trabajador no tiene cámaras asignadas",
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
        };
      default:
        return {
          message: "Selecciona un trabajador para asignar cámaras",
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/30",
        };
    }
  };

  const cameraStatus = getCameraStatusMessage();

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-0 md:p-6 z-[100] animate-fade-in">
      <div className="glass-card rounded-none md:rounded-[2.5rem] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-4xl h-full md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col relative">
        {/* Sutil background glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-50"></div>
        
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              {isEditing ? "Editar" : "Nuevo"} <span className="text-emerald-400">Torneo</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Configuración técnica y operativa</p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2.5 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-2xl transition-all duration-300 border border-white/5 hover:border-red-500/20"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-10">

          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nombre del Torneo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: Torneo Empresarial CDMX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Estado *
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option className="text-white bg-gray-700" value="">
                  Seleccionar estado
                </option>
                {estadosMexico.map((estado) => (
                  <option
                    className="text-white bg-gray-700"
                    key={estado}
                    value={estado}
                  >
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Campo de Golf *
              </label>
              <input
                type="text"
                value={formData.field}
                onChange={(e) => handleInputChange("field", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: Club de Golf Chapultepec"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Ciudad/Localidad *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: Ciudad de México"
              />
            </div>
          </div>

          {/* Fechas y Duración */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Fecha de Inicio *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Días de Duración *
              </label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={formData.days || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const daysValue = value === "" ? 1 : parseInt(value);
                  handleInputChange("days", daysValue);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Fecha de Fin (Automática)
              </label>
              <input
                type="date"
                readOnly
                value={formData.endDate || ""}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Calculada automáticamente
              </p>
            </div>
          </div>

          {/* Selección de Cantidad de Hoyos */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Cantidad de Hoyos * (2 cámaras por hoyo)
            </label>
            <select
              value={formData.holes}
              onChange={(e) => handleHoleCountChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="0" className="text-white bg-gray-700">Seleccionar cantidad</option>
              {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num} className="text-white bg-gray-700">
                  {num} {num === 1 ? 'Hoyo' : 'Hoyos'}
                </option>
              ))}
            </select>
            <div className="mt-2 text-sm text-gray-400">
              Seleccionados: {formData.holes > 0 ? `${formData.holes}` : "Ninguno"} |
              Cámaras requeridas: {requiredCameras}
            </div>
          </div>

          {/* Trabajador Asignado */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Visor/Trabajador{" "}
              {formData.state && `(Disponibles en ${formData.state})`}
            </label>
            <select
              value={formData.workerId}
              onChange={(e) => {
                handleInputChange("workerId", e.target.value);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option className="text-white bg-gray-700" value="">
                Seleccionar trabajador (opcional)
              </option>
              {availableWorkers.map((worker) => (
                <option
                  className="text-white bg-gray-700"
                  key={worker.id}
                  value={worker.id}
                >
                  {worker.name} - {worker.phone}
                  {worker.camerasAssigned &&
                    worker.camerasAssigned.length > 0 &&
                    ` (${worker.camerasAssigned.length} cámaras)`}
                </option>
              ))}
            </select>
            {formData.state && availableWorkers.length === 0 && (
              <p className="text-yellow-400 text-sm mt-1">
                No hay trabajadores disponibles en {formData.state}
              </p>
            )}
          </div>

          {/* Asignación de Cámaras */}
          {formData.workerId && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Asignación de Cámaras</span>
              </h4>

              {/* Estado de asignación */}
              <div
                className={`p-3 rounded-lg border ${cameraStatus.bgColor} ${cameraStatus.borderColor} ${cameraStatus.color} mb-4`}
              >
                <div className="flex items-center space-x-2">
                  {cameraAssignmentStatus === "complete" && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {cameraAssignmentStatus === "insufficient" && (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {cameraAssignmentStatus === "none" && (
                    <Package className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {cameraStatus.message}
                  </span>
                </div>
              </div>

              {/* Cámaras asignadas del trabajador */}
              {availableCameras.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Cámaras del trabajador ({availableCameras.length}{" "}
                    disponibles)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {availableCameras.map((camera) => (
                      <label
                        key={camera.id}
                        className={`flex items-center space-x-3 p-3 rounded border transition-colors cursor-pointer ${
                          formData.assignedCameras.includes(camera.id)
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                            : "bg-white/5 border-white/10 text-gray-300 hover:border-emerald-500/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.assignedCameras.includes(camera.id)}
                          onChange={() => handleCameraSelection(camera.id)}
                          className="rounded border-white/20 bg-white/5"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{camera.id}</div>
                          <div className="text-xs text-gray-400">
                            {camera.model}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Cámaras adicionales del almacén */}
              {availableWarehouseCameras.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Cámaras adicionales del almacén (
                    {availableWarehouseCameras.length} disponibles)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {availableWarehouseCameras.map((camera) => (
                      <label
                        key={camera.id}
                        className={`flex items-center space-x-3 p-3 rounded border transition-colors cursor-pointer ${
                          formData.assignedCameras.includes(camera.id)
                            ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                            : "bg-white/5 border-white/10 text-gray-300 hover:border-blue-500/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.assignedCameras.includes(camera.id)}
                          onChange={() => handleCameraSelection(camera.id)}
                          className="rounded border-white/20 bg-white/5"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{camera.id}</div>
                          <div className="text-xs text-gray-400">
                            {camera.model}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumen de asignación */}
              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Cámaras requeridas:</span>
                    <span className="text-white ml-2">{requiredCameras}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Cámaras asignadas:</span>
                    <span
                      className={`ml-2 ${
                        formData.assignedCameras.length >= requiredCameras
                          ? "text-emerald-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {formData.assignedCameras.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resumen y Botones */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">
              Resumen del Torneo
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Cámaras necesarias:</span>
                <span className="text-white ml-2">{requiredCameras}</span>
              </div>
              <div>
                <span className="text-gray-400">Cámaras asignadas:</span>
                <span
                  className={`ml-2 ${
                    formData.assignedCameras.length >= requiredCameras
                      ? "text-emerald-400"
                      : formData.assignedCameras.length > 0
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {formData.assignedCameras.length}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Estado:</span>
                <span
                  className={`ml-2 ${
                    formData.status === "activo"
                      ? "text-emerald-400"
                      : formData.status === "pendiente"
                      ? "text-yellow-400"
                      : "text-blue-400"
                  }`}
                >
                  {formData.status}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Hoyos:</span>
                <span className="text-white ml-2">
                  {formData.holes}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Duración:</span>
                <span className="text-white ml-2">{formData.days} día(s)</span>
              </div>
              <div>
                <span className="text-gray-400">Trabajador:</span>
                <span className="text-white ml-2">
                  {formData.workerId
                    ? workers.find((w) => w.id.toString() === formData.workerId)
                        ?.name || "No encontrado"
                    : "No asignado"}
                </span>
              </div>
              {formData.startDate && formData.endDate && (
                <>
                  <div>
                    <span className="text-gray-400">Inicio:</span>
                    <span className="text-white ml-2">
                      {formData.startDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Fin:</span>
                    <span className="text-white ml-2">{formData.endDate}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={
                !formData.name ||
                !formData.holes
              }
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{isEditing ? "Actualizar Torneo" : "Crear Torneo"}</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};


export default TournamentForm;
