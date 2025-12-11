import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.11:8080/api"; // IP local actual

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT a cada request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================== AUTH SERVICE ========================
export const authService = {
  /**
   * Verificar conexión al backend y estado del admin
   */
  debugAdmin: async () => {
    try {
      console.log("🔍 Verificando admin en backend...");
      const response = await api.get("/auth/debug/admin");
      console.log("✅ Debug Admin Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error en debug admin:", error.response?.status, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Inicializar BD con datos de ejemplo (SOLO DESARROLLO)
   */
  initializeData: async () => {
    try {
      console.log("🔄 Inicializando BD con datos de ejemplo...");
      const response = await api.post("/init/data");
      console.log("✅ BD inicializada:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error inicializando BD:", error.message);
      throw error;
    }
  },

  /**
   * Verificar estado de inicialización
   */
  initStatus: async () => {
    try {
      const response = await api.get("/init/status");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Resetear BD (SOLO DESARROLLO)
   */
  resetDatabase: async () => {
    try {
      console.log("⚠️ Reseteando base de datos...");
      const response = await api.post("/init/reset");
      console.log("✅ BD reseteada:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error reseteando BD:", error.message);
      throw error;
    }
  },

  login: async (username: string, password: string) => {
    // El backend espera 'correo' y 'password', no 'username' y 'password'
    const loginPayload = { correo: username, password };
    console.log("📤 Enviando login con payload:", loginPayload);
    try {
      const response = await api.post("/auth/login", loginPayload);
      console.log("✅ Login exitoso, respuesta:", response.data);
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: any) {
      console.error("❌ Error en login:", error.response?.status, error.response?.data || error.message);
      throw error;
    }
  },

  register: async (data: any) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  },

  getCurrentUser: async () => {
    const userStr = await AsyncStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

// ======================== OFERTA SERVICE ========================
export const ofertaService = {
  /**
   * Obtener todas las ofertas
   */
  getAll: async () => {
    const response = await api.get("/oferta");
    return response.data;
  },

  /**
   * Obtener una oferta por ID
   */
  getById: async (id: number) => {
    const response = await api.get(`/oferta/${id}`);
    return response.data;
  },

  /**
   * Obtener ofertas de un reclutador específico
   */
  getByReclutador: async (reclutadorId: number) => {
    const response = await api.get(`/oferta/reclutador/${reclutadorId}`);
    return response.data;
  },

  /**
   * Buscar ofertas por título
   */
  search: async (titulo: string) => {
    const response = await api.get(`/oferta/buscar`, {
      params: { titulo }
    });
    return response.data;
  },

  /**
   * Buscar ofertas por estado
   */
  getByEstado: async (estado: 'ABIERTA' | 'CERRADA' | 'PAUSADA') => {
    const response = await api.get(`/oferta/estado/${estado}`);
    return response.data;
  },

  /**
   * Crear una nueva oferta
   */
  create: async (data: any) => {
    const response = await api.post(`/oferta`, data);
    return response.data;
  },

  /**
   * Actualizar una oferta existente
   */
  update: async (id: number, data: any) => {
    const response = await api.put(`/oferta/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar una oferta
   */
  delete: async (id: number) => {
    const response = await api.delete(`/oferta/${id}`);
    return response.data;
  },

  /**
   * Filtrar ofertas por modalidad
   */
  getByModalidad: async (modalidad: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO') => {
    const response = await api.get(`/oferta/modalidad/${modalidad}`);
    return response.data;
  },
};

// ======================== POSTULACION SERVICE ========================
export const postulacionService = {
  getAll: () => api.get("/postulacion"),
  getById: (id: number) => api.get(`/postulacion/${id}`),
  getByOferta: (ofertaId: number) => api.get(`/postulacion/oferta/${ofertaId}`),
  getByAspirante: (aspiranteId: number) => api.get(`/postulacion/aspirante/${aspiranteId}`),
  getByReclutador: (reclutadorId: number) => api.get(`/postulacion/reclutador/${reclutadorId}`),
  postularse: (ofertaId: number, aspiranteId: number) => 
    api.post(`/postulacion?ofertaId=${ofertaId}&aspiranteId=${aspiranteId}`),
  cambiarEstado: (id: number, estado: string, reclutadorId: number) =>
    api.put(`/postulacion/${id}/estado?estado=${estado}&reclutadorId=${reclutadorId}`),
  eliminar: (id: number, aspiranteId: number) =>
    api.delete(`/postulacion/${id}?aspiranteId=${aspiranteId}`),
};

// ======================== CITACION SERVICE ========================
export const citacionService = {
  getAll: () => api.get("/citacion"),
  getById: (id: number, usuarioId: number) => api.get(`/citacion/${id}?usuarioId=${usuarioId}`),
  getByReclutador: (reclutadorId: number) => api.get(`/citacion/reclutador/${reclutadorId}`),
  getByAspirante: (aspiranteId: number) => api.get(`/citacion/aspirante/${aspiranteId}`),
  create: (data: any, reclutadorId: number) => 
    api.post(`/citacion?reclutadorId=${reclutadorId}`, data),
  update: (id: number, data: any, reclutadorId: number) =>
    api.put(`/citacion/${id}?reclutadorId=${reclutadorId}`, data),
  cambiarEstado: (id: number, estado: string, reclutadorId: number) =>
    api.put(`/citacion/${id}/estado?estado=${estado}&reclutadorId=${reclutadorId}`),
  delete: (id: number, reclutadorId: number) =>
    api.delete(`/citacion/${id}?reclutadorId=${reclutadorId}`),
  eliminar: (id: number, reclutadorId: number) =>
    api.delete(`/citacion/${id}?reclutadorId=${reclutadorId}`),
};

// ======================== NOTIFICACION SERVICE ========================
export const notificacionService = {
  getByUsuario: (usuarioId: number) => api.get(`/notificacion/usuario/${usuarioId}`),
  getNoLeidas: (usuarioId: number) => api.get(`/notificacion/usuario/${usuarioId}/no-leidas`),
  contarNoLeidas: (usuarioId: number) => api.get(`/notificacion/usuario/${usuarioId}/contar`),
  marcarComoLeida: (id: number) => api.put(`/notificacion/${id}/leida`),
  marcarTodasComoLeida: (usuarioId: number) => api.put(`/notificacion/usuario/${usuarioId}/todas-leidas`),
  eliminar: (id: number) => api.delete(`/notificacion/${id}`),
};

// ======================== USUARIO SERVICE ========================
export const usuarioService = {
  getAll: () => api.get("/users"),
  getById: (id: number) => api.get(`/users/${id}`),
  getByRole: (role: string) => api.get(`/users/role/${role}`),  // ✅ NUEVO
  create: (data: any) => api.post("/users", data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// ======================== ASPIRANTE SERVICE ========================
export const aspiranteService = {
  getAll: async () => {
    const response = await api.get("/aspirante");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/aspirante/${id}`);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/aspirante/me");
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post("/aspirante/public", data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/aspirante/${id}`, data);
    return response.data;
  },
  activate: async (id: number) => {
    const response = await api.put(`/aspirante/${id}/activar`);
    return response.data;
  },
  deactivate: async (id: number) => {
    const response = await api.put(`/aspirante/${id}/desactivar`);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/aspirante/${id}`);
    return response.data;
  },
};

// ======================== RECLUTADOR SERVICE (Base) ========================
export const reclutadorService = {
  getAll: async () => {
    const response = await api.get("/reclutador");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/reclutador/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post("/reclutador", data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/reclutador/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/reclutador/${id}`);
    return response.data;
  },
};

export default api;