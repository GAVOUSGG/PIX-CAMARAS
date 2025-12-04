import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import {
  addToGoogleCalendar,
  addToGoogleCalendarAuto,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  findCalendarEvent,
  isAuthenticated,
} from "../services/googleCalendar";
import {
  initiateOAuth,
  exchangeCodeForTokens,
} from "../services/googleCalendarOAuth";

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

      let newWorker;
      let workerId;

      if (apiAvailable) {
        // Calcular el próximo ID consecutivo
        const nextId = await getNextWorkerId();
        workerId = nextId.toString();
        const workerWithId = { ...workerData, id: workerId };

        console.log("📡 Enviando a API con ID:", nextId);
        newWorker = await apiService.createWorker(workerWithId);
        console.log("✅ Trabajador creado en API:", newWorker);
        workerId = newWorker.id;

        // Actualizar estado local
        setWorkersData((prev) => [...prev, newWorker]);
      } else {
        // Modo offline - calcular ID local
        const nextId = getNextWorkerIdLocal();
        workerId = nextId.toString();
        newWorker = {
          ...workerData,
          id: workerId,
          createdAt: new Date().toISOString(),
        };

        setWorkersData((prev) => [...prev, newWorker]);
      }

      // Actualizar assignedTo en las cámaras asignadas al nuevo trabajador
      // Usar el nombre del trabajador en lugar del ID
      const camerasAssigned = workerData.camerasAssigned || [];
      const workerName = newWorker.name;
      const workerState = newWorker.state;
      if (camerasAssigned.length > 0 && workerName) {
        console.log(
          `👤 [createWorker] Asignando cámaras a trabajador: ${workerName}`
        );
        await Promise.all(
          camerasAssigned.map(async (cameraId) => {
            try {
              console.log(
                `📷 [createWorker] Actualizando cámara ${cameraId} con assignedTo: ${workerName}`
              );
              // Actualizar la cámara con el nombre del trabajador y su estado como ubicación
              await updateCamera(cameraId, {
                assignedTo: workerName,
                location: workerState, // Actualizar location con el state del trabajador
              });
              console.log(
                `✅ [createWorker] Cámara ${cameraId} actualizada exitosamente`
              );
            } catch (error) {
              console.error(
                `❌ [createWorker] Error actualizando cámara ${cameraId}:`,
                error
              );
            }
          })
        );
      }

      return newWorker;
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

  const updateWorker = async (id, workerData, skipCameraUpdate = false) => {
    try {
      console.log(
        "🔄 [updateWorker] Iniciando actualización de trabajador:",
        id
      );
      console.log("📦 [updateWorker] Datos del trabajador:", workerData);
      console.log(`🔄 [updateWorker] skipCameraUpdate: ${skipCameraUpdate}`);

      // Obtener el trabajador actual para comparar las cámaras asignadas
      const currentWorker = workersData.find((w) => w.id === id);
      const previousCameras = currentWorker?.camerasAssigned || [];
      const newCameras = workerData.camerasAssigned || [];

      console.log("📷 [updateWorker] Cámaras anteriores:", previousCameras);
      console.log("📷 [updateWorker] Cámaras nuevas:", newCameras);

      // Identificar cámaras agregadas y removidas
      const camerasAdded = newCameras.filter(
        (cameraId) => !previousCameras.includes(cameraId)
      );
      const camerasRemoved = previousCameras.filter(
        (cameraId) => !newCameras.includes(cameraId)
      );

      console.log("➕ [updateWorker] Cámaras agregadas:", camerasAdded);
      console.log("➖ [updateWorker] Cámaras removidas:", camerasRemoved);

      // Solo actualizar cámaras si no se está saltando (para evitar bucles infinitos)
      if (!skipCameraUpdate) {
        // Actualizar assignedTo en TODAS las cámaras nuevas (incluyendo las que ya estaban)
        // Esto asegura que todas las cámaras asignadas tengan el assignedTo correcto
        // Usar el nombre del trabajador en lugar del ID
        const workerName = workerData.name || currentWorker?.name;
        const workerState = workerData.state || currentWorker?.state;
        if (newCameras.length > 0 && workerName) {
          console.log(
            "🔄 [updateWorker] Actualizando assignedTo en cámaras:",
            newCameras
          );
          console.log(
            `👤 [updateWorker] Asignando cámaras a trabajador: ${workerName}`
          );
          await Promise.all(
            newCameras.map(async (cameraId) => {
              try {
                console.log(
                  `📷 [updateWorker] Actualizando cámara ${cameraId} con assignedTo: ${workerName}`
                );
                // Actualizar la cámara con el nombre del trabajador y su estado como ubicación
                await updateCamera(cameraId, {
                  assignedTo: workerName,
                  location: workerState, // Actualizar location con el state del trabajador
                });
                console.log(
                  `✅ [updateWorker] Cámara ${cameraId} actualizada exitosamente`
                );
              } catch (error) {
                console.error(
                  `❌ [updateWorker] Error actualizando cámara ${cameraId}:`,
                  error
                );
              }
            })
          );
        }
      } else {
        console.log(
          "⏭️ [updateWorker] Saltando actualización de cámaras para evitar bucle"
        );
      }

      // Cámaras removidas: limpiar assignedTo
      // También protegemos este bloque con skipCameraUpdate para evitar bucles
      if (!skipCameraUpdate && camerasRemoved.length > 0) {
        console.log(
          "🔄 [updateWorker] Limpiando assignedTo en cámaras removidas:",
          camerasRemoved
        );
        await Promise.all(
          camerasRemoved.map(async (cameraId) => {
            try {
              console.log(
                `📷 [updateWorker] Limpiando assignedTo de cámara ${cameraId}`
              );
              await updateCamera(cameraId, {
                assignedTo: "",
              });
              console.log(
                `✅ [updateWorker] Cámara ${cameraId} limpiada exitosamente`
              );
            } catch (error) {
              console.error(
                `❌ [updateWorker] Error limpiando cámara ${cameraId}:`,
                error
              );
            }
          })
        );
      }

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
      // Obtener el trabajador antes de eliminarlo para limpiar las cámaras
      const workerToDelete = workersData.find((w) => w.id === id);
      const camerasAssigned = workerToDelete?.camerasAssigned || [];

      // Limpiar assignedTo de todas las cámaras asignadas a este trabajador
      await Promise.all(
        camerasAssigned.map((cameraId) =>
          updateCamera(cameraId, {
            assignedTo: "",
          })
        )
      );

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
      let newTournament;

      if (apiAvailable) {
        newTournament = await apiService.createTournament(tournamentData);
        setTournamentsData((prev) => [...prev, newTournament]);

        // Crear entradas de historial para cada cámara asignada al torneo
        if (tournamentData.cameras && tournamentData.cameras.length > 0) {
          for (const cameraId of tournamentData.cameras) {
            await createCameraHistoryEntry(
              cameraId,
              "tournament",
              `Asignado a torneo: ${tournamentData.name}`,
              {
                tournamentId: newTournament.id,
                tournamentName: tournamentData.name,
                location: tournamentData.location,
                date: tournamentData.date,
              }
            );
          }
        }
      } else {
        // Modo offline
        newTournament = {
          ...tournamentData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        setTournamentsData((prev) => [...prev, newTournament]);
      }

      // Agregar a Google Calendar después de crear el torneo
      try {
        console.log("📅 [createTournament] Agregando torneo a Google Calendar");

        if (isAuthenticated()) {
          // Si está autenticado, crear evento automáticamente
          try {
            const calendarEvent = await createCalendarEvent(newTournament);
            if (calendarEvent && calendarEvent.id) {
              // Guardar el eventId en el torneo
              newTournament.googleCalendarEventId = calendarEvent.id;

              // Actualizar el torneo con el eventId si es necesario
              if (apiAvailable && newTournament.id) {
                await apiService.updateTournament(newTournament.id, {
                  ...newTournament,
                  googleCalendarEventId: calendarEvent.id,
                });
              }

              console.log(
                "✅ [createTournament] Evento creado en Google Calendar:",
                calendarEvent.id
              );
            }
          } catch (apiError) {
            console.warn(
              "⚠️ [createTournament] Error con API de Google Calendar, usando método manual:",
              apiError
            );
            // Fallback al método manual si falla la API
            addToGoogleCalendar(newTournament);
          }
        } else {
          // Si no está autenticado, intentar autenticar primero
          try {
            console.log(
              "🔐 [createTournament] Iniciando autenticación OAuth..."
            );
            const code = await initiateOAuth();
            if (code) {
              await exchangeCodeForTokens(code);
              // Después de autenticar, crear el evento
              const calendarEvent = await createCalendarEvent(newTournament);
              if (calendarEvent && calendarEvent.id) {
                newTournament.googleCalendarEventId = calendarEvent.id;
                if (apiAvailable && newTournament.id) {
                  await apiService.updateTournament(newTournament.id, {
                    ...newTournament,
                    googleCalendarEventId: calendarEvent.id,
                  });
                }
                console.log(
                  "✅ [createTournament] Autenticado y evento creado en Google Calendar"
                );
              }
            }
          } catch (oauthError) {
            console.warn(
              "⚠️ [createTournament] Error en OAuth, usando método manual:",
              oauthError
            );
            // Si falla OAuth, usar método manual
            addToGoogleCalendar(newTournament);
          }
        }
      } catch (calendarError) {
        // No fallar si hay error con Google Calendar, solo loguear
        console.warn(
          "⚠️ [createTournament] Error al agregar a Google Calendar:",
          calendarError
        );
      }

      return newTournament;
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

      // Detectar cambios en cámaras
      const currentCameras = currentTournament.cameras || [];
      const updatedCameras = updatedData.cameras || [];
      const newCameras = updatedCameras.filter((c) => !currentCameras.includes(c));
      const removedCameras = currentCameras.filter((c) => !updatedCameras.includes(c));

      // Crear entradas de historial para cámaras nuevas
      if (newCameras.length > 0) {
        for (const cameraId of newCameras) {
          await createCameraHistoryEntry(
            cameraId,
            "tournament",
            `Asignado a torneo: ${updatedData.name}`,
            {
              tournamentId: id,
              tournamentName: updatedData.name,
              location: updatedData.location,
              date: updatedData.date,
            }
          );
        }
      }

      // Crear entradas de historial para cámaras removidas
      if (removedCameras.length > 0) {
        for (const cameraId of removedCameras) {
          await createCameraHistoryEntry(
            cameraId,
            "tournament",
            `Removido de torneo: ${currentTournament.name}`,
            {
              tournamentId: id,
              tournamentName: currentTournament.name,
            }
          );
        }
      }

      let updatedTournament;
      if (apiAvailable) {
        updatedTournament = await apiService.updateTournament(id, updatedData);
        setTournamentsData((prev) =>
          prev.map((tournament) =>
            tournament.id === id ? updatedTournament : tournament
          )
        );
      } else {
        // Modo offline
        updatedTournament = updatedData;
        setTournamentsData((prev) =>
          prev.map((tournament) =>
            tournament.id === id ? updatedData : tournament
          )
        );
      }

      // Actualizar en Google Calendar después de actualizar el torneo
      try {
        console.log(
          "📅 [updateTournament] Actualizando evento en Google Calendar"
        );

        if (isAuthenticated() && updatedTournament.googleCalendarEventId) {
          // Si está autenticado y tiene eventId, actualizar evento existente
          try {
            await updateCalendarEvent(
              updatedTournament,
              updatedTournament.googleCalendarEventId
            );
            console.log(
              "✅ [updateTournament] Evento actualizado en Google Calendar"
            );
          } catch (apiError) {
            console.warn(
              "⚠️ [updateTournament] Error al actualizar evento, intentando crear uno nuevo:",
              apiError
            );
            // Si falla la actualización, intentar crear uno nuevo
            try {
              const calendarEvent = await createCalendarEvent(
                updatedTournament
              );
              if (calendarEvent && calendarEvent.id) {
                updatedTournament.googleCalendarEventId = calendarEvent.id;
                // Actualizar el torneo con el nuevo eventId
                if (apiAvailable) {
                  await apiService.updateTournament(id, {
                    ...updatedTournament,
                    googleCalendarEventId: calendarEvent.id,
                  });
                }
              }
            } catch (createError) {
              // Si todo falla, usar método manual
              addToGoogleCalendar(updatedTournament);
            }
          }
        } else {
          // Si no tiene eventId, buscar si existe o crear uno nuevo
          if (isAuthenticated()) {
            try {
              const existingEvent = await findCalendarEvent(
                updatedTournament.name
              );
              if (existingEvent) {
                // Actualizar evento existente
                await updateCalendarEvent(updatedTournament, existingEvent.id);
                updatedTournament.googleCalendarEventId = existingEvent.id;
              } else {
                // Crear nuevo evento
                const calendarEvent = await createCalendarEvent(
                  updatedTournament
                );
                if (calendarEvent && calendarEvent.id) {
                  updatedTournament.googleCalendarEventId = calendarEvent.id;
                }
              }
            } catch (error) {
              // Fallback al método manual
              addToGoogleCalendar(updatedTournament);
            }
          } else {
            // Método manual si no está autenticado
            addToGoogleCalendar(updatedTournament);
          }
        }
      } catch (calendarError) {
        // No fallar si hay error con Google Calendar, solo loguear
        console.warn(
          "⚠️ [updateTournament] Error al actualizar en Google Calendar:",
          calendarError
        );
      }

      return updatedTournament;
    } catch (error) {
      console.error("❌ Error updating tournament:", error);
      throw error;
    }
  };

  const deleteTournament = async (id) => {
    try {
      console.log("🗑️ [useAppState] deleteTournament solicitado para ID:", id, typeof id);
      // Obtener el torneo antes de eliminarlo para mostrar información
      const tournamentToDelete = tournamentsData.find((t) => t.id === id);

      if (apiAvailable) {
        // Eliminar historial asociado al torneo
        try {
          const allHistory = await apiService.getCameraHistory();
          const tournamentHistory = allHistory.filter(
            (entry) =>
              entry.type === "tournament" &&
              entry.details &&
              entry.details.tournamentId === id
          );

          if (tournamentHistory.length > 0) {
            console.log(
              `🗑️ [deleteTournament] Eliminando ${tournamentHistory.length} entradas de historial`
            );
            await Promise.all(
              tournamentHistory.map((entry) =>
                apiService.deleteCameraHistory(entry.id)
              )
            );
          }
        } catch (historyError) {
          console.warn(
            "⚠️ [deleteTournament] Error al eliminar historial:",
            historyError
          );
        }

        await apiService.deleteTournament(id);
      }
      setTournamentsData((prev) =>
        prev.filter((tournament) => tournament.id !== id)
      );

      // Eliminar de Google Calendar si está autenticado y tiene eventId
      if (tournamentToDelete) {
        try {
          console.log(
            "🗑️ [deleteTournament] Eliminando evento de Google Calendar"
          );

          if (isAuthenticated() && tournamentToDelete.googleCalendarEventId) {
            try {
              await deleteCalendarEvent(
                tournamentToDelete.googleCalendarEventId
              );
              console.log(
                "✅ [deleteTournament] Evento eliminado de Google Calendar"
              );
            } catch (deleteError) {
              console.warn(
                "⚠️ [deleteTournament] Error al eliminar evento de Google Calendar:",
                deleteError
              );
              // Si falla, buscar el evento por nombre
              try {
                const existingEvent = await findCalendarEvent(
                  tournamentToDelete.name
                );
                if (existingEvent) {
                  await deleteCalendarEvent(existingEvent.id);
                  console.log(
                    "✅ [deleteTournament] Evento encontrado y eliminado"
                  );
                } else {
                  alert(
                    `Torneo "${tournamentToDelete.name}" eliminado del sistema.\n\n` +
                      `No se pudo encontrar el evento en Google Calendar para eliminarlo automáticamente. ` +
                      `Por favor verifica manualmente.`
                  );
                }
              } catch (searchError) {
                alert(
                  `Torneo "${tournamentToDelete.name}" eliminado del sistema.\n\n` +
                    `No se pudo eliminar automáticamente de Google Calendar. ` +
                    `Por favor elimínalo manualmente si lo habías agregado.`
                );
              }
            }
          } else {
            // Si no está autenticado o no tiene eventId, mostrar mensaje informativo
            alert(
              `Torneo "${tournamentToDelete.name}" eliminado del sistema.\n\n` +
                `Si agregaste este evento a tu Google Calendar, ` +
                `por favor elimínalo manualmente desde allí.`
            );
          }
        } catch (calendarError) {
          // No fallar si hay error con Google Calendar, solo loguear
          console.warn(
            "⚠️ [deleteTournament] Error al eliminar de Google Calendar:",
            calendarError
          );
          alert(
            `Torneo "${tournamentToDelete.name}" eliminado.\n\n` +
              `Recuerda eliminar este evento de tu Google Calendar si ya lo habías agregado.`
          );
        }
      }
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

  const updateCamera = async (id, cameraData, skipWorkerUpdate = false) => {
    try {
      console.log("🔄 [updateCamera] Actualizando cámara:", id, cameraData);

      const currentCamera = camerasData.find((c) => c.id === id);
      if (!currentCamera) {
        throw new Error(`Cámara con ID ${id} no encontrada`);
      }

      const previousAssignedTo = currentCamera.assignedTo || "";
      const newAssignedTo = cameraData.assignedTo || "";

      // Detectar cambios en assignedTo (solo si no se salta la actualización del trabajador)
      if (previousAssignedTo !== newAssignedTo && !skipWorkerUpdate) {
        console.log(
          `🔄 [updateCamera] Cambio en assignedTo: "${previousAssignedTo}" -> "${newAssignedTo}"`
        );

        // Si había un trabajador anterior, remover la cámara de su lista
        if (previousAssignedTo) {
          const previousWorker = workersData.find(
            (w) => w.name === previousAssignedTo
          );
          if (previousWorker) {
            const updatedCamerasAssigned = (
              previousWorker.camerasAssigned || []
            ).filter((cameraId) => cameraId !== id);
            console.log(
              `➖ [updateCamera] Removiendo cámara ${id} del trabajador ${previousWorker.name}`
            );
            await updateWorker(
              previousWorker.id,
              {
                ...previousWorker,
                camerasAssigned: updatedCamerasAssigned,
              },
              true
            ); // skipCameraUpdate = true para evitar bucle
          }
        }

        // Si se asigna a un nuevo trabajador, agregar la cámara a su lista
        if (newAssignedTo) {
          const newWorker = workersData.find((w) => w.name === newAssignedTo);
          if (newWorker) {
            const updatedCamerasAssigned = [
              ...(newWorker.camerasAssigned || []),
              id,
            ].filter(
              (cameraId, index, self) => self.indexOf(cameraId) === index
            ); // Remover duplicados
            console.log(
              `➕ [updateCamera] Agregando cámara ${id} al trabajador ${newWorker.name}`
            );
            // Actualizar la ubicación de la cámara con el estado del trabajador
            cameraData.location = newWorker.state;
            console.log(
              `📍 [updateCamera] Actualizando location de cámara a: ${newWorker.state}`
            );
            await updateWorker(
              newWorker.id,
              {
                ...newWorker,
                camerasAssigned: updatedCamerasAssigned,
              },
              true
            ); // skipCameraUpdate = true para evitar bucle
          } else {
            console.warn(
              `⚠️ [updateCamera] Trabajador "${newAssignedTo}" no encontrado`
            );
          }
        }
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
      console.log("🗑️ [deleteCamera] Eliminando cámara:", id);

      // Buscar la cámara antes de eliminarla para obtener información del trabajador asignado
      const cameraToDelete = camerasData.find((c) => c.id === id);

      if (cameraToDelete && cameraToDelete.assignedTo) {
        // Buscar el trabajador que tiene esta cámara asignada
        const assignedWorker = workersData.find(
          (w) => w.name === cameraToDelete.assignedTo
        );

        if (assignedWorker) {
          console.log(
            `🔄 [deleteCamera] Removiendo cámara ${id} del trabajador ${assignedWorker.name}`
          );

          // Remover la cámara de la lista del trabajador
          const updatedCamerasAssigned = (
            assignedWorker.camerasAssigned || []
          ).filter((cameraId) => cameraId !== id);

          // Actualizar el trabajador sin actualizar las cámaras (para evitar bucle)
          await updateWorker(
            assignedWorker.id,
            {
              ...assignedWorker,
              camerasAssigned: updatedCamerasAssigned,
            },
            true // skipCameraUpdate = true porque la cámara se está eliminando
          );

          console.log(
            `✅ [deleteCamera] Cámara ${id} removida del trabajador ${assignedWorker.name}`
          );
        } else {
          console.warn(
            `⚠️ [deleteCamera] Trabajador "${cameraToDelete.assignedTo}" no encontrado`
          );
        }
      }

      // Eliminar historial de la cámara
      if (apiAvailable) {
        try {
          const history = await apiService.getCameraHistoryById(id);
          if (history && history.length > 0) {
            console.log(`🗑️ [deleteCamera] Eliminando ${history.length} entradas de historial`);
            await Promise.all(history.map(entry => apiService.deleteCameraHistory(entry.id)));
          }
        } catch (historyError) {
          console.warn("⚠️ [deleteCamera] Error al eliminar historial:", historyError);
        }

        await apiService.deleteCamera(id);
      }
      setCamerasData((prev) => prev.filter((camera) => camera.id !== id));

      console.log(`✅ [deleteCamera] Cámara ${id} eliminada exitosamente`);
    } catch (error) {
      console.error("❌ Error deleting camera:", error);
      throw error;
    }
  };

  // En useAppState.js - agregar estas funciones después de las funciones de cámaras

  // ========== FUNCIONES PARA ENVÍOS ==========
  // En useAppState.js - actualizar las funciones de envíos

  // ========== FUNCIÓN HELPER PARA HISTORIAL ==========
  const createCameraHistoryEntry = async (cameraId, type, title, details = {}) => {
    try {
      console.log(`📝 [createCameraHistoryEntry] Creando entrada de historial para cámara ${cameraId}`);
      
      const entry = {
        id: `${cameraId}-${Date.now()}`,
        cameraId,
        type, // 'shipment', 'tournament', 'return', 'maintenance', 'status_change', 'assignment'
        title,
        details,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      if (apiAvailable) {
        const createdEntry = await apiService.createCameraHistory(entry);
        console.log(`✅ [createCameraHistoryEntry] Entrada creada:`, createdEntry);
        return createdEntry;
      } else {
        console.log(`✅ [createCameraHistoryEntry] Modo offline, entrada lista:`, entry);
        return entry;
      }
    } catch (error) {
      console.error(`❌ [createCameraHistoryEntry] Error:`, error);
      // No fallar la operación principal si falla el historial
      return null;
    }
  };

  const deleteCameraHistoryEntry = async (id) => {
    try {
      console.log(`🗑️ [deleteCameraHistoryEntry] Eliminando entrada de historial: ${id}`);
      if (apiAvailable) {
        await apiService.deleteCameraHistory(id);
      }
    } catch (error) {
      console.error(`❌ [deleteCameraHistoryEntry] Error:`, error);
      throw error;
    }
  };

  // ========== FUNCIONES PARA ENVÍOS ==========
  const createShipment = async (shipmentData) => {
    try {
      console.log("🎯 Creando envío:", shipmentData);

      if (apiAvailable) {
        const newShipment = await apiService.createShipment(shipmentData);
        setShipmentsData((prev) => [...prev, newShipment]);

        // Crear entradas de historial para cada cámara en el envío
        if (shipmentData.cameras && shipmentData.cameras.length > 0) {
          for (const cameraId of shipmentData.cameras) {
            await createCameraHistoryEntry(
              cameraId,
              "shipment",
              `Enviado a ${shipmentData.destination}`,
              {
                shipmentId: newShipment.id,
                origin: shipmentData.origin,
                destination: shipmentData.destination,
                recipient: shipmentData.recipient,
                trackingNumber: shipmentData.trackingNumber,
              }
            );
          }
        }

        // Actualizar el estado de las cámaras según el estado del envío
        if (shipmentData.cameras && shipmentData.cameras.length > 0) {
          if (shipmentData.status === "enviado") {
            // Actualización por lotes de trabajadores para evitar condiciones de carrera
            const recipientName = shipmentData.recipient;
            const shipperName = shipmentData.shipper;
            const camerasToTransfer = shipmentData.cameras;

            // 1. Actualizar al destinatario (agregar todas las cámaras)
            if (recipientName) {
              const recipientWorker = workersData.find(w => w.name === recipientName);
              if (recipientWorker) {
                const currentCameras = recipientWorker.camerasAssigned || [];
                // Agregar nuevas cámaras evitando duplicados
                const newCameras = [...currentCameras, ...camerasToTransfer].filter(
                  (id, index, self) => self.indexOf(id) === index
                );
                
                await updateWorker(recipientWorker.id, {
                  ...recipientWorker,
                  camerasAssigned: newCameras
                }, true); // skipCameraUpdate=true
              }
            }

            // 2. Actualizar al remitente (quitar todas las cámaras)
            if (shipperName) {
              const shipperWorker = workersData.find(w => w.name === shipperName);
              if (shipperWorker) {
                const currentCameras = shipperWorker.camerasAssigned || [];
                const newCameras = currentCameras.filter(id => !camerasToTransfer.includes(id));
                
                await updateWorker(shipperWorker.id, {
                  ...shipperWorker,
                  camerasAssigned: newCameras
                }, true); // skipCameraUpdate=true
              }
            }

            // 3. Actualizar cámaras individualmente (saltando actualización de trabajador)
            for (const cameraId of shipmentData.cameras) {
              await updateCamera(cameraId, { 
                status: "en envio",
                assignedTo: shipmentData.recipient
              }, true); // skipWorkerUpdate=true
            }
          } else if (shipmentData.status === "entregado") {
            shipmentData.cameras.forEach((cameraId) => {
              updateCamera(cameraId, {
                status: "disponible",
                assignedTo: shipmentData.recipient,
                location: shipmentData.destination,
              });
            });
          }
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
        if (shipmentData.cameras && shipmentData.cameras.length > 0) {
          if (shipmentData.status === "enviado") {
            setCamerasData((prev) =>
              prev.map((camera) =>
                shipmentData.cameras.includes(camera.id)
                  ? { 
                      ...camera, 
                      status: "en envio",
                      assignedTo: shipmentData.recipient
                    }
                  : camera
              )
            );
          } else if (shipmentData.status === "entregado") {
            setCamerasData((prev) =>
              prev.map((camera) =>
                shipmentData.cameras.includes(camera.id)
                  ? {
                      ...camera,
                      status: "disponible",
                      assignedTo: shipmentData.recipient,
                      location: shipmentData.destination,
                    }
                  : camera
              )
            );
          }
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

      // Detectar cambios en cámaras
      const currentCameras = currentShipment.cameras || [];
      const updatedCameras = updatedData.cameras || [];
      
      // Cámaras removidas: siempre liberarlas
      const camerasRemoved = currentCameras.filter(c => !updatedCameras.includes(c));
      if (camerasRemoved.length > 0) {
        console.log("➖ [updateShipment] Cámaras removidas del envío:", camerasRemoved);
        for (const cameraId of camerasRemoved) {
           // Revertir a estado disponible y limpiar asignación
           await updateCamera(cameraId, { 
             status: "disponible",
             assignedTo: "", // Limpiar asignación si la hubiera
             location: "Almacén" // Opcional: regresar a almacén
           });
           
           // Crear historial
           await createCameraHistoryEntry(
             cameraId,
             "shipment",
             `Removido del envío ${id}`,
             {
               shipmentId: id,
               previousStatus: currentShipment.status
             }
           );
        }
      }

      // Cámaras agregadas: manejar si el estado NO cambia (si cambia, lo maneja handleShipmentStatusChange)
      const camerasAdded = updatedCameras.filter(c => !currentCameras.includes(c));
      if (camerasAdded.length > 0 && currentShipment.status === updatedData.status) {
         console.log("➕ [updateShipment] Cámaras agregadas al envío:", camerasAdded);
         const status = updatedData.status;
         
         if (status === "enviado") {
            for (const cameraId of camerasAdded) {
               await updateCamera(cameraId, { 
                 status: "en envio",
                 assignedTo: updatedData.recipient
               });
               await createCameraHistoryEntry(
                 cameraId,
                 "shipment",
                 `Agregado a envío ${id} (Enviado)`,
                 { shipmentId: id, destination: updatedData.destination }
               );
            }
         } else if (status === "entregado") {
            for (const cameraId of camerasAdded) {
               await updateCamera(cameraId, { 
                 status: "disponible",
                 assignedTo: updatedData.recipient,
                 location: updatedData.destination
               });
               await createCameraHistoryEntry(
                 cameraId,
                 "shipment",
                 `Agregado a envío ${id} (Entregado)`,
                 { shipmentId: id, recipient: updatedData.recipient }
               );
            }
         }
      }

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
    const { cameras, recipient, status: newStatus, destination, id: shipmentId } = updatedShipment;
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
      
      // Actualización por lotes de trabajadores
      const recipientName = recipient;
      // Intentar deducir el remitente de las cámaras (asumiendo que todas vienen del mismo)
      // O usar el remitente del envío si está disponible en updatedShipment (necesitaríamos pasarlo)
      // Por ahora, nos enfocamos en asegurar que el destinatario las reciba
      
      if (recipientName) {
        const recipientWorker = workersData.find(w => w.name === recipientName);
        if (recipientWorker) {
          const currentCameras = recipientWorker.camerasAssigned || [];
          const newCameras = [...currentCameras, ...cameras].filter(
            (id, index, self) => self.indexOf(id) === index
          );
          
          await updateWorker(recipientWorker.id, {
            ...recipientWorker,
            camerasAssigned: newCameras
          }, true);
        }
      }

      // Intentar limpiar del remitente original (buscando en la primera cámara)
      if (cameras.length > 0) {
        const firstCamera = camerasData.find(c => c.id === cameras[0]);
        const previousOwner = firstCamera?.assignedTo;
        
        if (previousOwner && previousOwner !== recipientName) {
           const ownerWorker = workersData.find(w => w.name === previousOwner);
           if (ownerWorker) {
             const currentCameras = ownerWorker.camerasAssigned || [];
             const newCameras = currentCameras.filter(id => !cameras.includes(id));
             
             await updateWorker(ownerWorker.id, {
               ...ownerWorker,
               camerasAssigned: newCameras
             }, true);
           }
        }
      }

      for (const cameraId of cameras) {
        updateCamera(cameraId, { 
          status: "en envio",
          assignedTo: recipient
        }, true); // skipWorkerUpdate=true
        // Crear entrada de historial
        await createCameraHistoryEntry(
          cameraId,
          "shipment",
          `Enviado a ${destination}`,
          {
            shipmentId,
            destination,
            recipient,
            status: "enviado"
          }
        );
      }
    }

    // Caso 2: Cambio a "entregado" - Cámaras cambian a "disponible" y se asignan al destinatario
    if (newStatus === "entregado" && oldStatus !== "entregado") {
      console.log(
        '✅ Cambiando cámaras a estado "disponible" y asignando a:',
        recipient
      );
      for (const cameraId of cameras) {
        updateCamera(cameraId, {
          status: "disponible",
          assignedTo: recipient,
          location: updatedShipment.destination,
        });
        // Crear entrada de historial
        await createCameraHistoryEntry(
          cameraId,
          "return",
          `Entregado a ${recipient} en ${destination}`,
          {
            shipmentId,
            destination,
            recipient,
            status: "entregado"
          }
        );
      }
    }

    // Caso 3: Cambio de "enviado" a otro estado (cancelado, pendiente, etc.) - Revertir a "disponible"
    if (
      oldStatus === "enviado" &&
      newStatus !== "enviado" &&
      newStatus !== "entregado"
    ) {
      console.log('↩️ Revertiendo cámaras a estado "disponible":', cameras);
      for (const cameraId of cameras) {
        updateCamera(cameraId, { status: "disponible" });
        // Crear entrada de historial
        await createCameraHistoryEntry(
          cameraId,
          "shipment",
          `Envío cancelado (${newStatus})`,
          {
            shipmentId,
            reason: newStatus,
            previousStatus: oldStatus
          }
        );
      }
    }

    // Caso 4: Cambio de "entregado" a otro estado - Revertir asignación
    if (oldStatus === "entregado" && newStatus !== "entregado") {
      console.log("↩️ Revertiendo asignación de cámaras:", cameras);
      for (const cameraId of cameras) {
        updateCamera(cameraId, {
          status: "disponible",
          assignedTo: "",
          location: "Almacén",
        });
        // Crear entrada de historial
        await createCameraHistoryEntry(
          cameraId,
          "shipment",
          `Devolución cancelada (${newStatus})`,
          {
            shipmentId,
            reason: newStatus,
            previousRecipient: recipient
          }
        );
      }
    }
  };

  const deleteShipment = async (id) => {
    try {
      console.log("🗑️ Eliminando envío:", id);

      // Encontrar el envío para liberar las cámaras
      const shipmentToDelete = shipmentsData.find((s) => s.id === id);

      if (apiAvailable) {
        // Eliminar historial asociado al envío
        try {
          const allHistory = await apiService.getCameraHistory();
          const shipmentHistory = allHistory.filter(
            (entry) =>
              (entry.type === "shipment" || entry.type === "return") &&
              entry.details &&
              entry.details.shipmentId === id
          );

          if (shipmentHistory.length > 0) {
            console.log(
              `🗑️ [deleteShipment] Eliminando ${shipmentHistory.length} entradas de historial`
            );
            await Promise.all(
              shipmentHistory.map((entry) =>
                apiService.deleteCameraHistory(entry.id)
              )
            );
          }
        } catch (historyError) {
          console.warn(
            "⚠️ [deleteShipment] Error al eliminar historial:",
            historyError
          );
        }

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
