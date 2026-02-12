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
        // No bloqueamos todo el inicio si ya tenemos algo o queremos mostrar el UI base pronto
        // Intentar cargar desde API
        setLoading(true);
        
        try {
          // Primero lo más ligero/crítico
          const workers = await apiService.getWorkers();
          setWorkersData(workers);
          setApiAvailable(true);
          
          // Una vez tenemos trabajadores, ya podemos mostrar el layout base
          setLoading(false);

          // Cargar el resto en "background"
          Promise.all([
            apiService.getTournaments(),
            apiService.getCameras(),
            apiService.getShipments(),
          ]).then(([tournaments, cameras, shipments]) => {
            setTournamentsData(tournaments);
            setCamerasData(cameras);
            setShipmentsData(shipments);
          });

        } catch (apiError) {
          console.warn("API Error, Fallback to local", apiError);
          setApiAvailable(false);
          setWorkersData(initialWorkers);
          setTournamentsData(initialTournaments);
          setCamerasData(initialCameras);
          setShipmentsData(initialShipments);
          setLoading(false);
        }
      } catch (error) {
        console.error("Critical Error:", error);
        setLoading(false);
      }
    };


    loadData();
  }, []);
  // ========== FUNCIONES PARA TRABAJADORES ==========
  const createWorker = async (workerData) => {
    try {
      let newWorker;
      let workerId;

      if (apiAvailable) {
        // Calcular el próximo ID consecutivo
        const nextId = await getNextWorkerId();
        workerId = nextId.toString();
        const workerWithId = { ...workerData, id: workerId };

        newWorker = await apiService.createWorker(workerWithId);
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
        await Promise.all(
          camerasAssigned.map(async (cameraId) => {
            try {
              // Actualizar la cámara con el nombre del trabajador y su estado como ubicación
              await updateCamera(cameraId, {
                assignedTo: workerName,
                location: workerState, // Actualizar location con el state del trabajador
              });
            } catch (error) {
              console.error(
                `Error actualizando cámara ${cameraId}:`,
                error
              );
            }
          })
        );
      }

      return newWorker;
    } catch (error) {
      console.error("Error creating worker:", error);
      throw error;
    }
  }

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
      // Obtener el trabajador actual para comparar las cámaras asignadas
      const currentWorker = workersData.find((w) => w.id === id);
      const previousCameras = currentWorker?.camerasAssigned || [];
      const newCameras = workerData.camerasAssigned || [];

      // Identificar cámaras agregadas y removidas
      const camerasAdded = newCameras.filter(
        (cameraId) => !previousCameras.includes(cameraId)
      );
      const camerasRemoved = previousCameras.filter(
        (cameraId) => !newCameras.includes(cameraId)
      );

      // Solo actualizar cámaras si no se está saltando (para evitar bucles infinitos)
      if (!skipCameraUpdate) {
        // Actualizar assignedTo en TODAS las cámaras nuevas (incluyendo las que ya estaban)
        // Esto asegura que todas las cámaras asignadas tengan el assignedTo correcto
        // Usar el nombre del trabajador en lugar del ID
        const workerName = workerData.name || currentWorker?.name;
        const workerState = workerData.state || currentWorker?.state;
        if (newCameras.length > 0 && workerName) {
          await Promise.all(
            newCameras.map(async (cameraId) => {
              try {
                // Actualizar la cámara con el nombre del trabajador y su estado como ubicación
                await updateCamera(cameraId, {
                  assignedTo: workerName,
                  location: workerState, // Actualizar location con el state del trabajador
                });
              } catch (error) {
                console.error(
                  `Error actualizando cámara ${cameraId}:`,
                  error
                );
              }
            })
          );
        }
      }

      // Cámaras removidas: limpiar assignedTo
      // También protegemos este bloque con skipCameraUpdate para evitar bucles
      if (!skipCameraUpdate && camerasRemoved.length > 0) {
        await Promise.all(
          camerasRemoved.map(async (cameraId) => {
            try {
              await updateCamera(cameraId, {
                assignedTo: "",
              });
            } catch (error) {
              console.error(
                `Error limpiando cámara ${cameraId}:`,
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
  }

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
  }

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
            }
          } catch (apiError) {
            console.warn(
              "Error con API de Google Calendar, usando método manual:",
              apiError
            );
            // Fallback al método manual si falla la API
            addToGoogleCalendar(newTournament);
          }
        } else {
          // Si no está autenticado, intentar autenticar primero
          try {
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
              }
            }
          } catch (oauthError) {
            console.warn(
              "Error en OAuth, usando método manual:",
              oauthError
            );
            // Si falla OAuth, usar método manual
            addToGoogleCalendar(newTournament);
          }
        }
      } catch (calendarError) {
        // No fallar si hay error con Google Calendar, solo loguear
        console.warn(
          "Error al agregar a Google Calendar:",
          calendarError
        );
      }

      return newTournament;
    } catch (error) {
      console.error("Error creating tournament:", error);
      throw error;
    }
  }

  // En useAppState.js - corregir la función updateTournament
  const updateTournament = async (id, tournamentData) => {
    try {
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
        if (isAuthenticated() && updatedTournament.googleCalendarEventId) {
          // Si está autenticado y tiene eventId, actualizar evento existente
          try {
            await updateCalendarEvent(
              updatedTournament,
              updatedTournament.googleCalendarEventId
            );
          } catch (apiError) {
            console.warn(
              "Error al actualizar evento, intentando crear uno nuevo:",
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
          "Error al actualizar en Google Calendar:",
          calendarError
        );
      }

      return updatedTournament;
    } catch (error) {
      console.error("Error updating tournament:", error);
      throw error;
    }
  }

  const deleteTournament = async (id) => {
    try {
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
            await Promise.all(
              tournamentHistory.map((entry) =>
                apiService.deleteCameraHistory(entry.id)
              )
            );
          }
        } catch (historyError) {
          console.warn(
            "Error al eliminar historial:",
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
          if (isAuthenticated() && tournamentToDelete.googleCalendarEventId) {
            try {
              await deleteCalendarEvent(
                tournamentToDelete.googleCalendarEventId
              );
            } catch (deleteError) {
              console.warn(
                "Error al eliminar evento de Google Calendar:",
                deleteError
              );
              // Si falla, buscar el evento por nombre
              try {
                const existingEvent = await findCalendarEvent(
                  tournamentToDelete.name
                );
                if (existingEvent) {
                  await deleteCalendarEvent(existingEvent.id);
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
            "Error al eliminar de Google Calendar:",
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
  }

  // ========== FUNCIONES PARA CÁMARAS ==========
  // En useAppState.js - agregar estas funciones

  // En useAppState.js - agregar estas funciones después de las funciones de trabajadores

  // ========== FUNCIONES PARA CÁMARAS ==========
  const createCamera = async (cameraData) => {
    try {
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
      console.error("Error creating camera:", error);
      throw error;
    }
  };

  const updateCamera = async (id, cameraData, skipWorkerUpdate = false) => {
    try {
      const currentCamera = camerasData.find((c) => c.id === id);
      if (!currentCamera) {
        throw new Error(`Cámara con ID ${id} no encontrada`);
      }

      const previousAssignedTo = currentCamera.assignedTo || "";
      const newAssignedTo = cameraData.assignedTo || "";

      // Detectar cambios en assignedTo (solo si no se salta la actualización del trabajador)
      if (previousAssignedTo !== newAssignedTo && !skipWorkerUpdate) {
        // Si había un trabajador anterior, remover la cámara de su lista
        if (previousAssignedTo) {
          const previousWorker = workersData.find(
            (w) => w.name === previousAssignedTo
          );
          if (previousWorker) {
            const updatedCamerasAssigned = (
              previousWorker.camerasAssigned || []
            ).filter((cameraId) => cameraId !== id);
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
            // Actualizar la ubicación de la cámara con el estado del trabajador
            cameraData.location = newWorker.state;
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
              `Trabajador "${newAssignedTo}" no encontrado`
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
      console.error("Error updating camera:", error);
      throw error;
    }
  };

  const deleteCamera = async (id) => {
    try {
      // Buscar la cámara antes de eliminarla para obtener información del trabajador asignado
      const cameraToDelete = camerasData.find((c) => c.id === id);

      if (cameraToDelete && cameraToDelete.assignedTo) {
        // Buscar el trabajador que tiene esta cámara asignada
        const assignedWorker = workersData.find(
          (w) => w.name === cameraToDelete.assignedTo
        );

        if (assignedWorker) {
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
        } else {
          console.warn(
            `Trabajador "${cameraToDelete.assignedTo}" no encontrado`
          );
        }
      }

      // Eliminar historial de la cámara
      if (apiAvailable) {
        try {
          const history = await apiService.getCameraHistoryById(id);
          if (history && history.length > 0) {
            await Promise.all(history.map(entry => apiService.deleteCameraHistory(entry.id)));
          }
        } catch (historyError) {
          console.warn("Error al eliminar historial:", historyError);
        }

        await apiService.deleteCamera(id);
      }
      setCamerasData((prev) => prev.filter((camera) => camera.id !== id));
    } catch (error) {
      console.error("Error deleting camera:", error);
      throw error;
    }
  };

  // En useAppState.js - agregar estas funciones después de las funciones de cámaras

  // ========== FUNCIONES PARA ENVÍOS ==========
  // En useAppState.js - actualizar las funciones de envíos

  // ========== FUNCIÓN HELPER PARA HISTORIAL ==========
  const createCameraHistoryEntry = async (cameraId, type, title, details = {}) => {
    try {
      const entry = {
        cameraId,
        type, // 'shipment', 'tournament', 'return', 'maintenance', 'status_change', 'assignment'
        title,
        details,
        date: new Date().toISOString(),
      };

      if (apiAvailable) {
        const createdEntry = await apiService.createCameraHistory(entry);
        return createdEntry;
      } else {
        // En modo offline, sí necesitamos un ID temporal para la UI
        return {
          ...entry,
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error(`Error createCameraHistoryEntry:`, error);
      // No fallar la operación principal si falla el historial
      return null;
    }
  };

  const deleteCameraHistoryEntry = async (id) => {
    try {
      if (apiAvailable) {
        await apiService.deleteCameraHistory(id);
      }
    } catch (error) {
      console.error(`Error deleteCameraHistoryEntry:`, error);
      throw error;
    }
  };

  // ========== FUNCIONES PARA ENVÍOS ==========
  const createShipment = async (shipmentData) => {
    try {
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
      console.error("Error creating shipment:", error);
      throw error;
    }
  };

  const updateShipment = async (id, shipmentData) => {
    try {
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
      console.error("Error updating shipment:", error);
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

    // Si no hay cámaras en el envío, no hacer nada
    if (!cameras || cameras.length === 0) return;

    // Caso 1: Cambio a "enviado" - Cámaras cambian a "EN ENVIO"
    if (newStatus === "enviado" && oldStatus !== "enviado") {
      // Actualización por lotes de trabajadores
      const recipientName = recipient;
      
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
            await Promise.all(
              shipmentHistory.map((entry) =>
                apiService.deleteCameraHistory(entry.id)
              )
            );
          }
        } catch (historyError) {
          console.warn(
            "Error al eliminar historial:",
            historyError
          );
        }

        await apiService.deleteShipment(id);
      }

      setShipmentsData((prev) => prev.filter((shipment) => shipment.id !== id));

      // Liberar cámaras (cambiar estado a "disponible" y quitar asignación)
      if (shipmentToDelete && shipmentToDelete.cameras) {
        shipmentToDelete.cameras.forEach((cameraId) => {
          updateCamera(cameraId, {
            status: "disponible",
            assignedTo: "",
            location: "Almacén",
          });
        });
      }
    } catch (error) {
      console.error("Error deleting shipment:", error);
      throw error;
    }
  };
  // ========== FUNCIONES PARA TAREAS ==========
  const completeTask = async (taskId) => {
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
