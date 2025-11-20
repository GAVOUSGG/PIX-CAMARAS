import React, { useState } from "react";
import { X, Save, User, MapPin, Phone, Mail } from "lucide-react";

const WorkerForm = ({ onSave, onCancel, worker = null, isOpen = false }) => {
  const isEditing = !!worker;
  const [showForm, setShowForm] = useState(isOpen);

  const estadosMexico = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua",
    "CDMX", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo",
    "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro",
    "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala",
    "Veracruz", "Yucatán", "Zacatecas"
  ];

  const [formData, setFormData] = useState({
    name: worker?.name || "",
    state: worker?.state || "",
    phone: worker?.phone || "",
    email: worker?.email || "",
    status: worker?.status || "disponible",
    specialty: worker?.specialty || "Instalación cámaras solares"
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🎯 Iniciando ", isEditing ? "edición" : "creación", " de trabajador...");

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
      camerasAssigned: worker?.camerasAssigned || [],
      photo: worker?.photo || "",
      ...(isEditing && { updatedAt: new Date().toISOString() }),
      ...(!isEditing && { createdAt: new Date().toISOString() })
    };

    console.log("📦 Datos del trabajador a ", isEditing ? "actualizar" : "guardar", ":", workerData);

    try {
      console.log("🚀 Llamando a onSave...");
      const result = await onSave(workerData);
      console.log("✅ Trabajador ", isEditing ? "actualizado" : "guardado", " exitosamente. Resultado:", result);

      setShowForm(false);
      // Solo resetear el form si no estamos editando
      if (!isEditing) {
        setFormData({
          name: "",
          state: "",
          phone: "",
          email: "",
          status: "disponible",
          specialty: "Instalación cámaras solares"
        });
      }
    } catch (error) {
      console.error("❌ Error ", isEditing ? "actualizando" : "guardando", " trabajador:", error);
      alert(`Error al ${isEditing ? 'actualizar' : 'guardar'} el trabajador. Por favor intenta nuevamente.`);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {isEditing ? 'Editar Trabajador' : 'Nuevo Trabajador'}
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
                required
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
                <option value="disponible" className="text-white bg-gray-700">Disponible</option>
                <option value="activo" className="text-white bg-gray-700">Activo</option>
                <option value="ocupado" className="text-white bg-gray-700">Ocupado</option>
                <option value="vacaciones" className="text-white bg-gray-700">Vacaciones</option>
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
                <option value="Instalación cámaras solares" className="text-white bg-gray-700">Instalación cámaras solares</option>
                <option value="Coordinación torneos" className="text-white bg-gray-700">Coordinación torneos</option>
                <option value="Mantenimiento equipos" className="text-white bg-gray-700">Mantenimiento equipos</option>
                <option value="Logística envíos" className="text-white bg-gray-700">Logística envíos</option>
                <option value="Soporte técnico" className="text-white bg-gray-700">Soporte técnico</option>
              </select>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">
              Resumen del Trabajador
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Nombre:</span>
                <span className="text-white ml-2">{formData.name || "No especificado"}</span>
              </div>
              <div>
                <span className="text-gray-400">Estado:</span>
                <span className="text-white ml-2">{formData.state || "No especificado"}</span>
              </div>
              <div>
                <span className="text-gray-400">Teléfono:</span>
                <span className="text-white ml-2">{formData.phone || "No especificado"}</span>
              </div>
              <div>
                <span className="text-gray-400">Email:</span>
                <span className="text-white ml-2">{formData.email || "No especificado"}</span>
              </div>
              <div>
                <span className="text-gray-400">Estado Laboral:</span>
                <span className="text-white ml-2 capitalize">{formData.status}</span>
              </div>
              <div>
                <span className="text-gray-400">Especialidad:</span>
                <span className="text-white ml-2">{formData.specialty}</span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={!formData.name || !formData.state || !formData.phone || !formData.email}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{isEditing ? 'Actualizar Trabajador' : 'Crear Trabajador'}</span>
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