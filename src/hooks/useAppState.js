import { useState, useEffect } from "react";
import { apiService } from "../services/api";

// Datos iniciales de respaldo
const initialTournaments = [
  {
    id: "1",
    name: "Torneo Empresarial CDMX",
    location: "Club de Golf Chapultepec, Ciudad de México",
    state: "CDMX",
    date: "2025-07-15",
    endDate: "2025-07-15",
    status: "activo",
    worker: "Juan Pérez",
    workerId: "1",
    cameras: ["CS1", "CS2"],
    holes: [7, 12, 16],
    days: 1,
    field: "Club de Golf Chapultepec",
  },
];

const initialWorkers = [
  {
    id: "1",
    name: "Juan Pérez",
    state: "CDMX",
    status: "activo",
    phone: "55-1234-5678",
    email: "juan@pxgolf.com",
    specialty: "Instalación cámaras solares",
    camerasAssigned: [],
  },
];

const initialCameras = [
  {
    id: "CS1",
    model: "Hikvision DS-2XS6A25G0-I/CH20S40",
    type: "Solar",
    status: "en uso",
    location: "CDMX",
    batteryLevel: 85,
    lastMaintenance: "2024-01-10",
  },
];

const initialShipments = [
  {
    id: "ENV-001",
    cameras: ["CS7", "CS8"],
    destination: "Cancún, Quintana Roo",
    recipient: "Luis Hernández",
    sender: "Almacén Central",
    date: "2025-07-09",
    status: "enviado",
    trackingNumber: "TRK789123456",
  },
];

export const useAppState = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Estados de datos
  const [tournamentsData, setTournamentsData] = useState([]);
  const [workersData, setWorkersData] = useState([]);
  const [camerasData, setCamerasData] = useState([]);
  const [shipmentsData, setShipmentsData] = useState([]);

  // Estados de carga y conexión
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);

  // Cargar datos iniciales
  // En useAppState.js - mejorar el useEffect
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log("🔄 [useAppState] Iniciando carga de datos...");

        // Intentar cargar desde API
        try {
          console.log("🌐 [useAppState] Intentando conectar con API...");
          const workers = await apiService.getWorkers();
          console.log(
            "✅ [useAppState] Datos cargados desde API:",
            workers.length,
            "trabajadores"
          );

          setWorkersData(workers);
          setApiAvailable(true);

          // Cargar también los otros datos
          const [tournaments, cameras, shipments] = await Promise.all([
            apiService.getTournaments(),
            apiService.getCameras(),
            apiService.getShipments(),
          ]);

          setTournamentsData(tournaments);
          setCamerasData(cameras);
          setShipmentsData(shipments);
        } catch (apiError) {
          console.warn(
            "⚠️ [useAppState] Error cargando desde API, usando datos locales:",
            apiError
          );
          setApiAvailable(false);
          setWorkersData(initialWorkers);
          setTournamentsData(initialTournaments);
          setCamerasData(initialCameras);
          setShipmentsData(initialShipments);
        }
      } catch (error) {
        console.error("❌ [useAppState] Error crítico:", error);
        setApiAvailable(false);
        setWorkersData(initialWorkers);
        setTournamentsData(initialTournaments);
        setCamerasData(initialCameras);
        setShipmentsData(initialShipments);
      } finally {
        setLoading(false);
        console.log("🏁 [useAppState] Carga de datos completada");
      }
    };

    loadData();
  }, []);
  // ========== FUNCIONES PARA TRABAJADORES ==========
  const createWorker = async (workerData) => {
    try {
      console.log("🎯 Creando trabajador:", workerData);

      if (apiAvailable) {
        // Calcular el próximo ID consecutivo
        const nextId = await getNextWorkerId();
        const workerWithId = { ...workerData, id: nextId.toString() };

        console.log("📡 Enviando a API con ID:", nextId);
        const newWorker = await apiService.createWorker(workerWithId);
        console.log("✅ Trabajador creado en API:", newWorker);

        // Actualizar estado local
        setWorkersData((prev) => [...prev, newWorker]);
        return newWorker;
      } else {
        // Modo offline - calcular ID local
        const nextId = getNextWorkerIdLocal();
        const newWorker = {
          ...workerData,
          id: nextId.toString(),
          createdAt: new Date().toISOString(),
        };

        setWorkersData((prev) => [...prev, newWorker]);
        return newWorker;
      }
    } catch (error) {
      console.error("❌ Error creating worker:", error);
      throw error;
    }
  };

  // Función para obtener el próximo ID consecutivo desde la API
  const getNextWorkerId = async () => {
    try {
      const workers = await apiService.getWorkers();
      if (workers.length === 0) return 1;

      // Encontrar el máximo ID numérico
      const maxId = Math.max(
        ...workers.map((worker) => {
          const id = parseInt(worker.id);
          return isNaN(id) ? 0 : id;
        })
      );

      return maxId + 1;
    } catch (error) {
      console.error("Error getting next ID:", error);
      // Fallback: usar timestamp
      return Date.now();
    }
  };

  // Función para obtener el próximo ID consecutivo localmente
  const getNextWorkerIdLocal = () => {
    if (workersData.length === 0) return 1;

    const maxId = Math.max(
      ...workersData.map((worker) => {
        const id = parseInt(worker.id);
        return isNaN(id) ? 0 : id;
      })
    );

    return maxId + 1;
  };

  const updateWorker = async (id, workerData) => {
    try {
      if (apiAvailable) {
        const updatedWorker = await apiService.updateWorker(id, workerData);
        setWorkersData((prev) =>
          prev.map((worker) => (worker.id === id ? updatedWorker : worker))
        );
        return updatedWorker;
      } else {
        // Modo offline
        setWorkersData((prev) =>
          prev.map((worker) =>
            worker.id === id
              ? {
                  ...worker,
                  ...workerData,
                  updatedAt: new Date().toISOString(),
                }
              : worker
          )
        );
        return workerData;
      }
    } catch (error) {
      console.error("Error updating worker:", error);
      throw error;
    }
  };

  const deleteWorker = async (id) => {
    try {
      if (apiAvailable) {
        await apiService.deleteWorker(id);
      }
      setWorkersData((prev) => prev.filter((worker) => worker.id !== id));
    } catch (error) {
      console.error("Error deleting worker:", error);
      throw error;
    }
  };

  // ========== FUNCIONES PARA TORNEOS ==========
  const createTournament = async (tournamentData) => {
    try {
      if (apiAvailable) {
        const newTournament = await apiService.createTournament(tournamentData);
        setTournamentsData((prev) => [...prev, newTournament]);
        return newTournament;
      } else {
        // Modo offline
        const newTournament = {
          ...tournamentData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        setTournamentsData((prev) => [...prev, newTournament]);
        return newTournament;
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
      throw error;
    }
  };

  // En useAppState.js - corregir la función updateTournament
  const updateTournament = async (id, tournamentData) => {
    try {
      console.log("🔄 Actualizando torneo:", id, tournamentData);

      // Encontrar el torneo actual para preservar los datos existentes
      const currentTournament = tournamentsData.find((t) => t.id === id);
      if (!currentTournament) {
        throw new Error(`Torneo con ID ${id} no encontrado`);
      }

      // Combinar los datos existentes con los nuevos datos
      const updatedData = {
        ...currentTournament,
        ...tournamentData,
        updatedAt: new Date().toISOString(),
      };

      console.log("📦 Datos combinados para actualizar:", updatedData);

      if (apiAvailable) {
        const updatedTournament = await apiService.updateTournament(
          id,
          updatedData
        );
        setTournamentsData((prev) =>
          prev.map((tournament) =>
            tournament.id === id ? updatedTournament : tournament
          )
        );
        return updatedTournament;
      } else {
        // Modo offline
        setTournamentsData((prev) =>
          prev.map((tournament) =>
            tournament.id === id ? updatedData : tournament
          )
        );
        return updatedData;
      }
    } catch (error) {
      console.error("❌ Error updating tournament:", error);
      throw error;
    }
  };

  const deleteTournament = async (id) => {
    try {
      if (apiAvailable) {
        await apiService.deleteTournament(id);
      }
      setTournamentsData((prev) =>
        prev.filter((tournament) => tournament.id !== id)
      );
    } catch (error) {
      console.error("Error deleting tournament:", error);
      throw error;
    }
  };

  // ========== FUNCIONES PARA CÁMARAS ==========
  // En useAppState.js - agregar estas funciones

  // En useAppState.js - agregar estas funciones después de las funciones de trabajadores

  // ========== FUNCIONES PARA CÁMARAS ==========
  const createCamera = async (cameraData) => {
    try {
      console.log("🎯 Creando cámara:", cameraData);

      if (apiAvailable) {
        const newCamera = await apiService.createCamera(cameraData);
        setCamerasData((prev) => [...prev, newCamera]);
        return newCamera;
      } else {
        // Modo offline
        const newCamera = {
          ...cameraData,
          createdAt: new Date().toISOString(),
        };
        setCamerasData((prev) => [...prev, newCamera]);
        return newCamera;
      }
    } catch (error) {
      console.error("❌ Error creating camera:", error);
      throw error;
    }
  };

  const updateCamera = async (id, cameraData) => {
    try {
      console.log("🔄 Actualizando cámara:", id, cameraData);

      const currentCamera = camerasData.find((c) => c.id === id);
      if (!currentCamera) {
        throw new Error(`Cámara con ID ${id} no encontrada`);
      }

      const updatedData = {
        ...currentCamera,
        ...cameraData,
        updatedAt: new Date().toISOString(),
      };

      if (apiAvailable) {
        const updatedCamera = await apiService.updateCamera(id, updatedData);
        setCamerasData((prev) =>
          prev.map((camera) => (camera.id === id ? updatedCamera : camera))
        );
        return updatedCamera;
      } else {
        setCamerasData((prev) =>
          prev.map((camera) => (camera.id === id ? updatedData : camera))
        );
        return updatedData;
      }
    } catch (error) {
      console.error("❌ Error updating camera:", error);
      throw error;
    }
  };

  const deleteCamera = async (id) => {
    try {
      if (apiAvailable) {
        await apiService.deleteCamera(id);
      }
      setCamerasData((prev) => prev.filter((camera) => camera.id !== id));
    } catch (error) {
      console.error("❌ Error deleting camera:", error);
      throw error;
    }
  };

  // En useAppState.js - agregar estas funciones después de las funciones de cámaras

  // ========== FUNCIONES PARA ENVÍOS ==========
  // En useAppState.js - actualizar las funciones de envíos

  // ========== FUNCIONES PARA ENVÍOS ==========
  const createShipment = async (shipmentData) => {
    try {
      console.log("🎯 Creando envío:", shipmentData);

      if (apiAvailable) {
        const newShipment = await apiService.createShipment(shipmentData);
        setShipmentsData((prev) => [...prev, newShipment]);

        // Actualizar el estado de las cámaras a "EN ENVIO" si el estado es "enviado"
        if (
          shipmentData.cameras &&
          shipmentData.cameras.length > 0 &&
          shipmentData.status === "enviado"
        ) {
          shipmentData.cameras.forEach((cameraId) => {
            updateCamera(cameraId, { status: "en envio" });
          });
        }

        return newShipment;
      } else {
        // Modo offline
        const newShipment = {
          ...shipmentData,
          createdAt: new Date().toISOString(),
        };
        setShipmentsData((prev) => [...prev, newShipment]);

        // Actualizar cámaras en modo offline
        if (
          shipmentData.cameras &&
          shipmentData.cameras.length > 0 &&
          shipmentData.status === "enviado"
        ) {
          setCamerasData((prev) =>
            prev.map((camera) =>
              shipmentData.cameras.includes(camera.id)
                ? { ...camera, status: "en envio" }
                : camera
            )
          );
        }

        return newShipment;
      }
    } catch (error) {
      console.error("❌ Error creating shipment:", error);
      throw error;
    }
  };

  const updateShipment = async (id, shipmentData) => {
    try {
      console.log("🔄 Actualizando envío:", id, shipmentData);

      const currentShipment = shipmentsData.find((s) => s.id === id);
      if (!currentShipment) {
        throw new Error(`Envío con ID ${id} no encontrado`);
      }

      const updatedData = {
        ...currentShipment,
        ...shipmentData,
        updatedAt: new Date().toISOString(),
      };

      // Lógica para manejar cambios de estado
      await handleShipmentStatusChange(currentShipment, updatedData);

      if (apiAvailable) {
        const updatedShipment = await apiService.updateShipment(
          id,
          updatedData
        );
        setShipmentsData((prev) =>
          prev.map((shipment) =>
            shipment.id === id ? updatedShipment : shipment
          )
        );
        return updatedShipment;
      } else {
        setShipmentsData((prev) =>
          prev.map((shipment) => (shipment.id === id ? updatedData : shipment))
        );
        return updatedData;
      }
    } catch (error) {
      console.error("❌ Error updating shipment:", error);
      throw error;
    }
  };

  // Nueva función para manejar cambios de estado de envíos
  const handleShipmentStatusChange = async (
    currentShipment,
    updatedShipment
  ) => {
    const { cameras, recipient, status: newStatus } = updatedShipment;
    const { status: oldStatus } = currentShipment;

    console.log("🔄 Manejando cambio de estado de envío:", {
      oldStatus,
      newStatus,
      cameras,
      recipient,
    });

    // Si no hay cámaras en el envío, no hacer nada
    if (!cameras || cameras.length === 0) return;

    // Caso 1: Cambio a "enviado" - Cámaras cambian a "EN ENVIO"
    if (newStatus === "enviado" && oldStatus !== "enviado") {
      console.log('📦 Cambiando cámaras a estado "EN ENVIO":', cameras);
      cameras.forEach((cameraId) => {
        updateCamera(cameraId, { status: "en envio" });
      });
    }

    // Caso 2: Cambio a "entregado" - Cámaras cambian a "disponible" y se asignan al destinatario
    if (newStatus === "entregado" && oldStatus !== "entregado") {
      console.log(
        '✅ Cambiando cámaras a estado "disponible" y asignando a:',
        recipient
      );
      cameras.forEach((cameraId) => {
        updateCamera(cameraId, {
          status: "disponible",
          assignedTo: recipient,
          location: updatedShipment.destination,
        });
      });
    }

    // Caso 3: Cambio de "enviado" a otro estado (cancelado, pendiente, etc.) - Revertir a "disponible"
    if (
      oldStatus === "enviado" &&
      newStatus !== "enviado" &&
      newStatus !== "entregado"
    ) {
      console.log('↩️ Revertiendo cámaras a estado "disponible":', cameras);
      cameras.forEach((cameraId) => {
        updateCamera(cameraId, { status: "disponible" });
      });
    }

    // Caso 4: Cambio de "entregado" a otro estado - Revertir asignación
    if (oldStatus === "entregado" && newStatus !== "entregado") {
      console.log("↩️ Revertiendo asignación de cámaras:", cameras);
      cameras.forEach((cameraId) => {
        updateCamera(cameraId, {
          status: "disponible",
          assignedTo: "",
          location: "Almacén",
        });
      });
    }
  };

  const deleteShipment = async (id) => {
    try {
      console.log("🗑️ Eliminando envío:", id);

      // Encontrar el envío para liberar las cámaras
      const shipmentToDelete = shipmentsData.find((s) => s.id === id);

      if (apiAvailable) {
        await apiService.deleteShipment(id);
      }

      setShipmentsData((prev) => prev.filter((shipment) => shipment.id !== id));

      // Liberar cámaras (cambiar estado a "disponible" y quitar asignación)
      if (shipmentToDelete && shipmentToDelete.cameras) {
        console.log(
          "🔄 Liberando cámaras del envío eliminado:",
          shipmentToDelete.cameras
        );
        shipmentToDelete.cameras.forEach((cameraId) => {
          updateCamera(cameraId, {
            status: "disponible",
            assignedTo: "",
            location: "Almacén",
          });
        });
      }
    } catch (error) {
      console.error("❌ Error deleting shipment:", error);
      throw error;
    }
  };
  // ========== FUNCIONES PARA TAREAS ==========
  const completeTask = async (taskId) => {
    console.log(`Completando tarea: ${taskId}`);
    // Lógica para completar tareas
  };

  const createShipmentFromTask = async (task, selectedCameras) => {
    try {
      const shipmentData = {
        cameras: selectedCameras,
        destination: task.tournamentLocation || task.state,
        recipient: task.assignedTo,
        sender: "Almacén Central",
        date: new Date().toISOString().split("T")[0],
        status: "preparando",
        trackingNumber: `TRK${Date.now()}`,
      };

      return await createShipment(shipmentData);
    } catch (error) {
      console.error("Error creating shipment from task:", error);
      throw error;
    }
  };

  // ========== DATOS DE TAREAS (placeholder) ==========
  const tasksData = [
    {
      id: "1",
      title: "Envío de cámaras para Torneo Guadalajara",
      description:
        "Preparar y enviar cámaras solares para el torneo en Jalisco",
      type: "camera_shipment",
      priority: "alta",
      status: "pendiente",
      assignedTo: "María González",
      state: "Jalisco",
      camerasNeeded: 4,
      dueDate: "2025-07-18",
      tournamentLocation: "Guadalajara, Jalisco",
      availableCameras: [
        { id: "CS3", model: "Hikvision DS-2XS6825G0-I/CH20S40" },
        { id: "CS4", model: "Hikvision DS-2XS6825G0-I/CH20S40" },
        { id: "CS8", model: "Hikvision DS-2XS6825G0-I/CH20S40" },
        { id: "CS9", model: "Hikvision DS-2XS6A25G0-I/CH20S40" },
        { id: "CS10", model: "Hikvision DS-2XS6825G0-I/CH20S40" },
      ],
    },
  ];

  // ========== RETURN COMPLETO ==========
  return {
    // Estados
    activeTab,
    setActiveTab,
    selectedTournament,
    setSelectedTournament,
    tournamentsData,
    workersData,
    camerasData,
    shipmentsData,
    tasksData,
    loading,
    apiAvailable,

    // Funciones para torneos
    createTournament,
    updateTournament,
    deleteTournament,
    setTournamentsData,

    // Funciones para trabajadores
    createWorker,
    updateWorker,
    deleteWorker,
    setWorkersData,

    // Funciones para cámaras
    createCamera,
    updateCamera,
    deleteCamera,
    setCamerasData,

    // Funciones para envíos
    createShipment,
    updateShipment,
    deleteShipment,
    setShipmentsData,


    // Funciones para tareas
    completeTask,
    createShipmentFromTask,
  };
};
