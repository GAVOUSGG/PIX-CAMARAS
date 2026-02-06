import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Save,
  User,
  MapPin,
  Phone,
  Mail,
  Camera,
  CheckCircle,
} from "lucide-react";

const WorkerForm = ({
  onSave,
  onCancel,
  worker = null,
  isOpen = false,
  camerasData = [],
}) => {
  const isEditing = !!worker;
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

  const [formData, setFormData] = useState({
    name: worker?.name || "",
    state: worker?.state || "",
    phone: worker?.phone || "",
    email: worker?.email || "",
    status: worker?.status || "disponible",
    specialty: worker?.specialty || "Instalación cámaras solares",
    camerasAssigned: worker?.camerasAssigned || [], // Nuevo campo para cámaras asignadas
  });

  // Obtener cámaras disponibles (que no estén asignadas a otros trabajadores y estén en Almacén)
  const availableCameras = useMemo(() => {
    // Primero, obtener todas las cámaras que están en Almacén y disponibles
    const allAvailable = camerasData.filter(
      (camera) =>
        camera.status === "disponible" && camera.location === "Almacén"
    );

    // Si estamos editando, incluir también las cámaras que ya están asignadas a este trabajador
    if (isEditing && worker) {
      const currentlyAssigned = camerasData.filter((camera) =>
        worker.camerasAssigned?.includes(camera.id)
      );
      return [...new Set([...allAvailable, ...currentlyAssigned])];
    }

    return allAvailable;
  }, [camerasData, isEditing, worker]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Función para manejar la selección de cámaras
  const handleCameraSelection = (cameraId) => {
    setFormData((prev) => {
      const isSelected = prev.camerasAssigned.includes(cameraId);
      const camerasAssigned = isSelected
        ? prev.camerasAssigned.filter((id) => id !== cameraId)
        : [...prev.camerasAssigned, cameraId];

      return { ...prev, camerasAssigned };
    });
  };

  // Función para seleccionar/deseleccionar todas las cámaras
  const handleSelectAllCameras = () => {
    if (formData.camerasAssigned.length === availableCameras.length) {
      // Deseleccionar todas
      setFormData((prev) => ({ ...prev, camerasAssigned: [] }));
    } else {
      // Seleccionar todas las disponibles
      setFormData((prev) => ({
        ...prev,
        camerasAssigned: availableCameras.map((camera) => camera.id),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Para edición, usar el ID existente; para creación, generar nuevo
    const workerId = isEditing ? worker.id : Date.now().toString();

    const workerData = {
      ...(isEditing && { id: workerId }),
      name: formData.name,
      state: formData.state,
      phone: formData.phone,
      email: formData.email,
      status: formData.status,
      specialty: formData.specialty,
      camerasAssigned: formData.camerasAssigned, // Incluir cámaras asignadas
      photo: worker?.photo || "",
      ...(isEditing && { updatedAt: new Date().toISOString() }),
      ...(!isEditing && { createdAt: new Date().toISOString() }),
    };

    try {
      const result = await onSave(workerData);

      setShowForm(false);
      // Solo resetear el form si no estamos editando
      if (!isEditing) {
        setFormData({
          name: "",
          state: "",
          phone: "",
          email: "",
          status: "disponible",
          specialty: "Instalación cámaras solares",
          camerasAssigned: [],
        });
      }
    } catch (error) {
      alert(
        `Error al ${
          isEditing ? "actualizar" : "guardar"
        } el trabajador. Por favor intenta nuevamente.`
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
        <User className="w-5 h-5" />
        <span>Agregar Trabajador</span>
      </button>
    );
  }

  // Si estamos en modo edición pero el formulario no está abierto, no mostrar nada
  if (isEditing && !showForm) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 z-50">
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-none md:rounded-2xl border-x-0 border-t-0 md:border border-white/10 p-4 md:p-6 max-w-4xl w-full h-full md:h-auto md:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {isEditing ? "Editar Trabajador" : "Nuevo Trabajador"}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Estado *
              </label>
              <select
                required
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

          {/* Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Número de Teléfono *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: 55-1234-5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                optional
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej: juan@pxgolf.com"
              />
            </div>
          </div>

          {/* Estado y Especialidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Estado Laboral
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="disponible" className="text-white bg-gray-700">
                  Disponible
                </option>
                <option value="activo" className="text-white bg-gray-700">
                  Activo
                </option>
                <option value="ocupado" className="text-white bg-gray-700">
                  Ocupado
                </option>
                <option value="vacaciones" className="text-white bg-gray-700">
                  Vacaciones
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Especialidad
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => handleInputChange("specialty", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option
                  value="Instalación cámaras solares"
                  className="text-white bg-gray-700"
                >
                  Instalación cámaras solares
                </option>
                <option
                  value="Coordinación torneos"
                  className="text-white bg-gray-700"
                >
                  Coordinación torneos
                </option>
                <option
                  value="Mantenimiento equipos"
                  className="text-white bg-gray-700"
                >
                  Mantenimiento equipos
                </option>
                <option
                  value="Logística envíos"
                  className="text-white bg-gray-700"
                >
                  Logística envíos
                </option>
                <option
                  value="Soporte técnico"
                  className="text-white bg-gray-700"
                >
                  Soporte técnico
                </option>
              </select>
            </div>
          </div>

          {/* Asignación de Cámaras - NUEVA SECCIÓN */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Asignación de Cámaras</span>
              </h4>
              {availableCameras.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAllCameras}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {formData.camerasAssigned.length === availableCameras.length
                      ? "Deseleccionar todas"
                      : "Seleccionar todas"}
                  </span>
                </button>
              )}
            </div>

            {availableCameras.length > 0 ? (
              <>
                <div className="mb-3">
                  <p className="text-sm text-gray-400">
                    Selecciona las cámaras que tendrá asignadas este trabajador.
                    Solo se muestran cámaras disponibles en el almacén.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto bg-white/5 rounded-lg p-4">
                  {availableCameras.map((camera) => (
                    <label
                      key={camera.id}
                      className={`flex items-center space-x-3 p-3 rounded border transition-colors cursor-pointer ${
                        formData.camerasAssigned.includes(camera.id)
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                          : "bg-white/5 border-white/10 text-gray-300 hover:border-emerald-500/30"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.camerasAssigned.includes(camera.id)}
                        onChange={() => handleCameraSelection(camera.id)}
                        className="rounded border-white/20 bg-white/5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {camera.id}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {camera.model}
                        </div>
                        <div className="text-xs text-gray-500">
                          {camera.serialNumber &&
                            `Serie: ${camera.serialNumber}`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Resumen de asignación */}
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">
                        Cámaras disponibles:
                      </span>
                      <span className="text-white ml-2">
                        {availableCameras.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Cámaras asignadas:</span>
                      <span
                        className={`ml-2 ${
                          formData.camerasAssigned.length > 0
                            ? "text-emerald-400"
                            : "text-gray-400"
                        }`}
                      >
                        {formData.camerasAssigned.length}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  No hay cámaras disponibles en el almacén para asignar.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Las cámaras deben estar en estado "disponible" y ubicación
                  "Almacén".
                </p>
              </div>
            )}
          </div>

          {/* Resumen */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">
              Resumen del Trabajador
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Nombre:</span>
                <span className="text-white ml-2">
                  {formData.name || "No especificado"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Estado:</span>
                <span className="text-white ml-2">
                  {formData.state || "No especificado"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Teléfono:</span>
                <span className="text-white ml-2">
                  {formData.phone || "No especificado"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <span className="text-white ml-2">
                  {formData.email || "No especificado"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Estado Laboral:</span>
                <span className="text-white ml-2 capitalize">
                  {formData.status}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Especialidad:</span>
                <span className="text-white ml-2">{formData.specialty}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-400">Cámaras asignadas:</span>
                <span className="text-white ml-2">
                  {formData.camerasAssigned.length > 0
                    ? formData.camerasAssigned.join(", ")
                    : "Ninguna"}
                </span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={
                !formData.name ||
                !formData.state ||
                !formData.phone ||
                !formData.email
              }
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>
                {isEditing ? "Actualizar Trabajador" : "Crear Trabajador"}
              </span>
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
  );
};

export default WorkerForm;
