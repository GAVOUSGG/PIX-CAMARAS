const rawApiBase = import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";
const API_BASE = rawApiBase.startsWith('http') ? rawApiBase : `https://${rawApiBase}`;

// Función helper mejorada para manejar errores
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorText}`
    );
  }

  // Para respuestas DELETE que no tienen contenido
  if (response.status === 204) {
    return null;
  }

  return await response.json();
};

export const apiService = {
  // ========== TORNEOS ==========
  async getTournaments() {
    const response = await fetch(`${API_BASE}/tournaments`);
    return await handleResponse(response);
  },

  async getTournament(id) {
    const response = await fetch(`${API_BASE}/tournaments/${id}`);
    return await handleResponse(response);
  },

  async createTournament(tournament) {
    const response = await fetch(`${API_BASE}/tournaments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tournament),
    });
    return await handleResponse(response);
  },

  async updateTournament(id, tournament) {
    const response = await fetch(`${API_BASE}/tournaments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tournament),
    });
    return await handleResponse(response);
  },

  async deleteTournament(id) {
    const response = await fetch(`${API_BASE}/tournaments/${id}`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  },

  // ========== TRABAJADORES ==========
  async getWorkers() {
    const response = await fetch(`${API_BASE}/workers`);
    return await handleResponse(response);
  },

  async getWorker(id) {
    const response = await fetch(`${API_BASE}/workers/${id}`);
    return await handleResponse(response);
  },

  async createWorker(worker) {
    const response = await fetch(`${API_BASE}/workers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(worker),
    });
    return await handleResponse(response);
  },

  async updateWorker(id, worker) {
    const response = await fetch(`${API_BASE}/workers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(worker),
    });
    return await handleResponse(response);
  },

  async deleteWorker(id) {
    const response = await fetch(`${API_BASE}/workers/${id}`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  },

  // ========== CÁMARAS ==========
  async getCameras() {
    const response = await fetch(`${API_BASE}/cameras`);
    return await handleResponse(response);
  },

  async getCamera(id) {
    const response = await fetch(`${API_BASE}/cameras/${id}`);
    return await handleResponse(response);
  },

  async createCamera(camera) {
    const response = await fetch(`${API_BASE}/cameras`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(camera),
    });
    return await handleResponse(response);
  },

  async updateCamera(id, camera) {
    const response = await fetch(`${API_BASE}/cameras/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(camera),
    });
    return await handleResponse(response);
  },

  async deleteCamera(id) {
    const response = await fetch(`${API_BASE}/cameras/${id}`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  },

  // ========== ENVÍOS ==========
  async getShipments() {
    const response = await fetch(`${API_BASE}/shipments`);
    return await handleResponse(response);
  },

  async createShipment(shipment) {
    const response = await fetch(`${API_BASE}/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipment),
    });
    return await handleResponse(response);
  },

  async updateShipment(id, shipment) {
    const response = await fetch(`${API_BASE}/shipments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipment),
    });
    return await handleResponse(response);
  },

  async deleteShipment(id) {
    const response = await fetch(`${API_BASE}/shipments/${id}`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  },

  // ========== HISTORIAL DE CÁMARAS ==========
  async getCameraHistory() {
    const response = await fetch(`${API_BASE}/camera-history`);
    return await handleResponse(response);
  },

  async getCameraHistoryById(cameraId) {
    const response = await fetch(`${API_BASE}/camera-history?cameraId=${cameraId}`);
    return await handleResponse(response);
  },

  async createCameraHistory(entry) {
    const response = await fetch(`${API_BASE}/camera-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    });
    return await handleResponse(response);
  },

  async deleteCameraHistory(id) {
    const response = await fetch(`${API_BASE}/camera-history/${id}`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  },

  async clearCameraHistory() {
    const response = await fetch(`${API_BASE}/camera-history`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  },

  // ========== FUNCIONES ADICIONALES ==========
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE}/tournaments`);
      return response.ok;
    } catch (error) {
      return false;
    }
  },
};
