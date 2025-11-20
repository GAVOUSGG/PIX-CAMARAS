const API_BASE = "http://127.0.0.1:3001";

// Función helper mejorada para manejar errores
const handleResponse = async (response) => {
  console.log(
    "🌐 [API] Response status:",
    response.status,
    response.statusText
  );

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
    console.log("🔄 [API] GET /tournaments");
    const response = await fetch(`${API_BASE}/tournaments`);
    return await handleResponse(response);
  },

  async getTournament(id) {
    console.log(`🔄 [API] GET /tournaments/${id}`);
    const response = await fetch(`${API_BASE}/tournaments/${id}`);
    return await handleResponse(response);
  },

  async createTournament(tournament) {
    console.log("🌐 [API] POST /tournaments - Enviando:", tournament);

    try {
      const response = await fetch(`${API_BASE}/tournaments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tournament),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [API] Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("🎉 [API] Torneo creado exitosamente:", result);
      return result;
    } catch (error) {
      console.error("💥 [API] Error en createTournament:", error);
      throw error;
    }
  },

  async updateTournament(id, tournament) {
    console.log(`✏️ [API] PUT /tournaments/${id}`, tournament);
    const response = await fetch(`${API_BASE}/tournaments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tournament),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Error en updateTournament:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const result = await response.json();
    console.log("✅ [API] Torneo actualizado exitosamente:", result);
    return result;
  },

  async deleteTournament(id) {
    console.log(`🗑️ [API] DELETE /tournaments/${id}`);
    const response = await fetch(`${API_BASE}/tournaments/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Error en deleteTournament:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return await handleResponse(response);
  },

  // ========== TRABAJADORES ==========
  async getWorkers() {
    console.log("🔄 [API] GET /workers");
    const response = await fetch(`${API_BASE}/workers`);
    return await handleResponse(response);
  },

  async getWorker(id) {
    console.log(`🔄 [API] GET /workers/${id}`);
    const response = await fetch(`${API_BASE}/workers/${id}`);
    return await handleResponse(response);
  },

  async createWorker(worker) {
    console.log("🌐 [API] POST /workers - Enviando:", worker);
    const response = await fetch(`${API_BASE}/workers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(worker),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Error en createWorker:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const result = await response.json();
    console.log("✅ [API] Trabajador creado exitosamente:", result);
    return result;
  },

  async updateWorker(id, worker) {
    console.log(`✏️ [API] PUT /workers/${id}`, worker);
    const response = await fetch(`${API_BASE}/workers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(worker),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Error en updateWorker:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const result = await response.json();
    console.log("✅ [API] Trabajador actualizado exitosamente:", result);
    return result;
  },

  async deleteWorker(id) {
    console.log(`🗑️ [API] DELETE /workers/${id}`);
    const response = await fetch(`${API_BASE}/workers/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Error en deleteWorker:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return await handleResponse(response);
  },

  // ========== CÁMARAS ==========
  async getCameras() {
    console.log("🔄 [API] GET /cameras");
    const response = await fetch(`${API_BASE}/cameras`);
    return await handleResponse(response);
  },

  async getCamera(id) {
    console.log(`🔄 [API] GET /cameras/${id}`);
    const response = await fetch(`${API_BASE}/cameras/${id}`);
    return await handleResponse(response);
  },

  async createCamera(camera) {
    console.log("🌐 [API] POST /cameras - Enviando:", camera);
    const response = await fetch(`${API_BASE}/cameras`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(camera),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Error en createCamera:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const result = await response.json();
    console.log("✅ [API] Cámara creada exitosamente:", result);
    return result;
  },

  async updateCamera(id, camera) {
    console.log(`✏️ [API] PUT /cameras/${id}`, camera);
    const response = await fetch(`${API_BASE}/cameras/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(camera),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Error en updateCamera:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const result = await response.json();
    console.log("✅ [API] Cámara actualizada exitosamente:", result);
    return result;
  },

  async deleteCamera(id) {
    console.log(`🗑️ [API] DELETE /cameras/${id}`);
    const response = await fetch(`${API_BASE}/cameras/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Error en deleteCamera:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    // Para DELETE, puede que no haya contenido en la respuesta
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  },

  // ========== ENVÍOS ==========
  async getShipments() {
    console.log("🔄 [API] GET /shipments");
    const response = await fetch(`${API_BASE}/shipments`);
    return await handleResponse(response);
  },

  async createShipment(shipment) {
    console.log("🌐 [API] POST /shipments - Enviando:", shipment);
    const response = await fetch(`${API_BASE}/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipment),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Error en createShipment:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const result = await response.json();
    console.log("✅ [API] Envío creado exitosamente:", result);
    return result;
  },

  async updateShipment(id, shipment) {
    console.log(`✏️ [API] PUT /shipments/${id}`, shipment);
    const response = await fetch(`${API_BASE}/shipments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipment),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Error en updateShipment:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const result = await response.json();
    console.log("✅ [API] Envío actualizado exitosamente:", result);
    return result;
  },
  // En api.js - agregar esta función
  async deleteShipment(id) {
    console.log(`🗑️ [API] DELETE /shipments/${id}`);
    const response = await fetch(`${API_BASE}/shipments/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [API] Error en deleteShipment:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    // Para DELETE, puede que no haya contenido en la respuesta
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  },

  // ========== FUNCIONES ADICIONALES ==========
  async healthCheck() {
    try {
      console.log("🏥 [API] Health check");
      const response = await fetch(`${API_BASE}/tournaments`);
      return response.ok;
    } catch (error) {
      console.error("❌ [API] Health check failed:", error);
      return false;
    }
  },
};
