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
  login: async (username: string, password: string) => {
    const response = await api.post("/auth/login", { username, password });
    if (response.data.token) {
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
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
  getAll: () => api.get("/oferta"),
  getById: (id: number) => api.get(`/oferta/${id}`),
  getByReclutador: (reclutadorId: number) => api.get(`/oferta/reclutador/${reclutadorId}`),
  search: (titulo: string) => api.get(`/oferta/buscar/titulo?titulo=${titulo}`),
  searchByUbicacion: (ubicacion: string) => api.get(`/oferta/buscar/ubicacion?ubicacion=${ubicacion}`),
  create: (data: any, reclutadorId: number) => 
    api.post(`/oferta?reclutadorId=${reclutadorId}`, data),
  update: (id: number, data: any, reclutadorId: number) => 
    api.put(`/oferta/${id}?reclutadorId=${reclutadorId}`, data),
  delete: (id: number, reclutadorId: number) => 
    api.delete(`/oferta/${id}?reclutadorId=${reclutadorId}`),
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

export default api;