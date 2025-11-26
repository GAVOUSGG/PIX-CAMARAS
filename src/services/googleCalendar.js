/**
 * Servicio para integrar con Google Calendar
 * Genera enlaces para agregar eventos a Google Calendar
 */

/**
 * Formatea una fecha para Google Calendar (formato ISO 8601: YYYYMMDDTHHMMSS)
 * @param {string|Date} date - Fecha en formato string o Date
 * @param {boolean} isEndDate - Si es true, establece la hora a las 23:59:59
 * @returns {string} Fecha formateada para Google Calendar
 */
const formatDateForGoogleCalendar = (date, isEndDate = false) => {
  let dateObj;

  if (typeof date === "string") {
    // Si es string, crear Date object
    // IMPORTANTE: Si es YYYY-MM-DD, agregar T00:00:00 para que sea local y no UTC
    // Esto evita que se reste un día en zonas horarias occidentales (como México)
    if (date.includes("-") && !date.includes("T")) {
      dateObj = new Date(`${date}T00:00:00`);
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }

  // Si es fecha de fin y no tiene hora específica, establecer a fin del día
  if (isEndDate) {
    dateObj.setHours(23, 59, 59);
  } else {
    // Para fecha de inicio, establecer a inicio del día (9:00 AM por defecto)
    dateObj.setHours(9, 0, 0);
  }

  // Formatear como YYYYMMDDTHHMMSS
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

/**
 * Genera un enlace de Google Calendar para agregar un evento
 * @param {Object} tournament - Objeto del torneo
 * @returns {string} URL de Google Calendar
 */
export const generateGoogleCalendarLink = (tournament) => {
  const baseUrl = "https://calendar.google.com/calendar/render";

  // Título del evento
  const text = encodeURIComponent(tournament.field || "Torneo de Golf");

  // Fechas
  const startDate = formatDateForGoogleCalendar(tournament.date, false);
  const endDate = formatDateForGoogleCalendar(
    tournament.endDate || tournament.date,
    true
  );
  const dates = `${startDate}/${endDate}`;

  // Descripción del evento
  let details = `Torneo: ${tournament.name}\n`;
  if (tournament.field) {
    details += `Campo: ${tournament.field}\n`;
  }
  if (tournament.location) {
    details += `Ubicación: ${tournament.location}\n`;
  }
  if (tournament.state) {
    details += `Estado: ${tournament.state}\n`;
  }
  if (tournament.worker && tournament.worker !== "Por asignar") {
    details += `Trabajador asignado: ${tournament.worker}\n`;
  }
  if (tournament.cameras && tournament.cameras.length > 0) {
    details += `Cámaras asignadas: ${tournament.cameras.join(", ")}\n`;
  }
  if (tournament.holes && tournament.holes.length > 0) {
    details += `Hoyos: ${tournament.holes.join(", ")}\n`;
  }
  if (tournament.status) {
    details += `Estado: ${tournament.status}`;
  }

  const encodedDetails = encodeURIComponent(details);

  // Ubicación
  const location = encodeURIComponent(
    tournament.location || tournament.field || ""
  );

  // Construir URL
  const url = `${baseUrl}?action=TEMPLATE&text=${text}&dates=${dates}&details=${encodedDetails}&location=${location}`;

  return url;
};

/**
 * Abre Google Calendar en una nueva ventana para agregar el evento
 * @param {Object} tournament - Objeto del torneo
 */
export const addToGoogleCalendar = (tournament) => {
  try {
    const url = generateGoogleCalendarLink(tournament);
    // Abrir en nueva ventana
    window.open(url, "_blank", "width=800,height=600");
    console.log("📅 [Google Calendar] Abriendo enlace de Google Calendar");
  } catch (error) {
    console.error("❌ [Google Calendar] Error al generar enlace:", error);
    throw error;
  }
};

import {
  getValidAccessToken,
  isAuthenticated,
  initiateOAuth,
  handleOAuthCallback,
  clearTokens,
} from "./googleCalendarOAuth";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";

/**
 * Formatea una fecha para Google Calendar API (formato ISO 8601: YYYY-MM-DDTHH:MM:SS)
 */
const formatDateForAPI = (date, isEndDate = false) => {
  let dateObj;

  if (typeof date === "string") {
    // IMPORTANTE: Si es YYYY-MM-DD, agregar T00:00:00 para que sea local y no UTC
    if (date.includes("-") && !date.includes("T")) {
      dateObj = new Date(`${date}T00:00:00`);
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }

  // Si es fecha de fin y no tiene hora específica, establecer a fin del día
  if (isEndDate) {
    dateObj.setHours(23, 59, 59);
  } else {
    // Para fecha de inicio, establecer a inicio del día (9:00 AM por defecto)
    dateObj.setHours(9, 0, 0);
  }

  // Formatear como ISO 8601 con zona horaria
  return dateObj.toISOString();
};

/**
 * Convierte un torneo a formato de evento de Google Calendar
 */
const tournamentToCalendarEvent = (tournament) => {
  const startDate = formatDateForAPI(tournament.date, false);
  const endDate = formatDateForAPI(tournament.endDate || tournament.date, true);

  // Descripción del evento
  let description = `Torneo: ${tournament.name}\n\n`; //name
  if (tournament.field) {
    description += `Campo: ${tournament.field}\n`;
  }
  if (tournament.location) {
    description += `Ubicación: ${tournament.location}\n`;
  }
  if (tournament.state) {
    description += `Estado: ${tournament.state}\n`;
  }
  if (tournament.worker && tournament.worker !== "Por asignar") {
    description += `Trabajador asignado: ${tournament.worker}\n`;
  }
  if (tournament.cameras && tournament.cameras.length > 0) {
    description += `Cámaras asignadas: ${tournament.cameras.join(", ")}\n`;
  }
  if (tournament.holes && tournament.holes.length > 0) {
    description += `Hoyos: ${tournament.holes.join(", ")}\n`;
  }
  if (tournament.status) {
    description += `\nEstado: ${tournament.status}`;
  }

  return {
    summary: tournament.name || "Torneo de Golf",
    description: description,
    location: tournament.location || tournament.field || "",
    start: {
      dateTime: startDate,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endDate,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 }, // 1 día antes por email
        { method: "popup", minutes: 60 }, // 1 hora antes por popup
      ],
    },
  };
};

/**
 * Crea un evento en Google Calendar usando la API
 */
export const createCalendarEvent = async (tournament) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("No estás autenticado. Por favor autentícate primero.");
    }

    const accessToken = await getValidAccessToken();
    const event = tournamentToCalendarEvent(tournament);

    const response = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/primary/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || "Error al crear evento en Google Calendar"
      );
    }

    const createdEvent = await response.json();
    console.log(
      "✅ [Google Calendar API] Evento creado exitosamente:",
      createdEvent.id
    );
    return createdEvent;
  } catch (error) {
    console.error("❌ [Google Calendar API] Error al crear evento:", error);
    throw error;
  }
};

/**
 * Actualiza un evento en Google Calendar usando la API
 */
export const updateCalendarEvent = async (tournament, eventId) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("No estás autenticado. Por favor autentícate primero.");
    }

    if (!eventId) {
      throw new Error("Se requiere el ID del evento para actualizar");
    }

    const accessToken = await getValidAccessToken();
    const event = tournamentToCalendarEvent(tournament);

    const response = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || "Error al actualizar evento en Google Calendar"
      );
    }

    const updatedEvent = await response.json();
    console.log(
      "✅ [Google Calendar API] Evento actualizado exitosamente:",
      updatedEvent.id
    );
    return updatedEvent;
  } catch (error) {
    console.error(
      "❌ [Google Calendar API] Error al actualizar evento:",
      error
    );
    throw error;
  }
};

/**
 * Elimina un evento de Google Calendar usando la API
 */
export const deleteCalendarEvent = async (eventId) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("No estás autenticado. Por favor autentícate primero.");
    }

    if (!eventId) {
      throw new Error("Se requiere el ID del evento para eliminar");
    }

    const accessToken = await getValidAccessToken();

    const response = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok && response.status !== 204) {
      const error = await response.json();
      throw new Error(
        error.error?.message || "Error al eliminar evento de Google Calendar"
      );
    }

    console.log(
      "✅ [Google Calendar API] Evento eliminado exitosamente:",
      eventId
    );
    return true;
  } catch (error) {
    console.error("❌ [Google Calendar API] Error al eliminar evento:", error);
    throw error;
  }
};

/**
 * Busca eventos en Google Calendar por nombre
 */
export const findCalendarEvent = async (tournamentName) => {
  try {
    if (!isAuthenticated()) {
      return null;
    }

    const accessToken = await getValidAccessToken();
    const query = encodeURIComponent(tournamentName);

    const response = await fetch(
      `${GOOGLE_CALENDAR_API}/calendars/primary/events?q=${query}&maxResults=10`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    // Buscar el evento exacto por nombre
    const event = data.items?.find((item) => item.summary === tournamentName);
    return event || null;
  } catch (error) {
    console.error("❌ [Google Calendar API] Error al buscar evento:", error);
    return null;
  }
};

/**
 * Intenta agregar automáticamente el evento a Google Calendar usando la API
 */
export const addToGoogleCalendarAuto = async (tournament) => {
  try {
    if (!isAuthenticated()) {
      // Si no está autenticado, abrir OAuth
      await initiateOAuth();
      // Esperar a que el usuario se autentique y luego crear el evento
      // Esto se manejará en el callback
      return null;
    }

    return await createCalendarEvent(tournament);
  } catch (error) {
    console.error(
      "❌ [Google Calendar] Error al agregar evento automáticamente:",
      error
    );
    // Si falla, usar el método manual como fallback
    addToGoogleCalendar(tournament);
    throw error;
  }
};

// Exportar funciones OAuth para uso externo
export { initiateOAuth, handleOAuthCallback, isAuthenticated, clearTokens };
