/**
 * Constantes globales de la aplicación
 */

// URLs API
export const API_BASE_URL = 'http://192.168.1.11:8080/api';

// Rutas de navegación
export const NAVIGATION = {
  LOGIN: 'Login',
  HOME: 'Home',
  ADMIN: 'Admin',
  RECLUTADOR: 'Reclutador',
  GESTION_OFERTAS: 'GestionOfertas',
  CREAR_OFERTA: 'CrearOferta',
  DETALLE_OFERTA: 'DetalleOferta',
  POSTULACIONES: 'Postulaciones',
  CITACIONES: 'Citaciones',
  NOTIFICACIONES: 'Notificaciones',
  USUARIOS: 'Usuarios',
  CREAR_USUARIO: 'CrearUsuario',
};

// Roles de usuario
export const ROLES = {
  ADMIN: 'ADMIN',
  EMPRESA: 'EMPRESA',
  RECLUTADOR: 'RECLUTADOR',
  ASPIRANTE: 'ASPIRANTE',
};

// Estados de ofertas
export const ESTADOS_OFERTA = {
  ABIERTA: 'ABIERTA',
  CERRADA: 'CERRADA',
  PAUSADA: 'PAUSADA',
};

// Modalidades de trabajo
export const MODALIDADES = {
  PRESENCIAL: 'PRESENCIAL',
  REMOTO: 'REMOTO',
  HIBRIDO: 'HIBRIDO',
};

// Tipos de contrato
export const TIPOS_CONTRATO = {
  TIEMPO_COMPLETO: 'TIEMPO_COMPLETO',
  MEDIO_TIEMPO: 'MEDIO_TIEMPO',
  TEMPORAL: 'TEMPORAL',
  PRESTACION_SERVICIOS: 'PRESTACION_SERVICIOS',
  PRACTICAS: 'PRACTICAS',
};

// Niveles de experiencia
export const NIVELES_EXPERIENCIA = {
  SIN_EXPERIENCIA: 'SIN_EXPERIENCIA',
  BASICO: 'BASICO',
  INTERMEDIO: 'INTERMEDIO',
  AVANZADO: 'AVANZADO',
  EXPERTO: 'EXPERTO',
};

// Deptos/Municipios Colombia (muestra)
export const DEPARTAMENTOS = [
  { id: 1, nombre: 'Antioquia' },
  { id: 2, nombre: 'Bogotá' },
  { id: 3, nombre: 'Bolívar' },
  { id: 4, nombre: 'Boyacá' },
  { id: 5, nombre: 'Cauca' },
  { id: 6, nombre: 'Cesar' },
  { id: 7, nombre: 'Córdoba' },
  { id: 8, nombre: 'Cundinamarca' },
  { id: 9, nombre: 'Guajira' },
  { id: 10, nombre: 'Huila' },
  { id: 11, nombre: 'Magdalena' },
  { id: 12, nombre: 'Meta' },
  { id: 13, nombre: 'Nariño' },
  { id: 14, nombre: 'Norte Santander' },
  { id: 15, nombre: 'Putumayo' },
  { id: 16, nombre: 'Quindío' },
  { id: 17, nombre: 'Risaralda' },
  { id: 18, nombre: 'Santander' },
  { id: 19, nombre: 'Sucre' },
  { id: 20, nombre: 'Tolima' },
  { id: 21, nombre: 'Valle del Cauca' },
  { id: 22, nombre: 'Vaupés' },
  { id: 23, nombre: 'Vichada' },
];

// Colores de la aplicación
export const COLORES = {
  PRIMARY: '#6366f1',
  SECONDARY: '#ec4899',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  LIGHT_GRAY: '#f3f4f6',
  DARK_GRAY: '#1f2937',
  BORDER: '#e5e7eb',
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#6b7280',
  BACKGROUND: '#ffffff',
};

// Tiempos de animaciones
export const TIEMPOS = {
  RAPIDO: 200,
  NORMAL: 300,
  LENTO: 500,
};

// Tamaños de fuente
export const TAMAÑOS_FUENTE = {
  XS: 12,
  SM: 14,
  BASE: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 32,
};

// Espaciados
export const ESPACIADOS = {
  XS: 4,
  SM: 8,
  BASE: 12,
  MD: 16,
  LG: 20,
  XL: 24,
  XXL: 32,
};

// Radios de esquinas
export const RADIOS = {
  SM: 4,
  BASE: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  FULL: 9999,
};

// Valores por defecto
export const DEFAULTS = {
  PAGINA_SIZE: 10,
  TIMEOUT_API: 10000, // 10 segundos
  TIMEOUT_SESION: 1800000, // 30 minutos
  REINTENTOS_API: 3,
};

// Regex validaciones
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONO: /^57[0-9]{10}$|^[0-9]{10}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  SOLO_NUMEROS: /^[0-9]+$/,
  SOLO_LETRAS: /^[a-zA-Z\s]+$/,
};

// Estados de cargar datos
export const ESTADOS_CARGA = {
  IDLE: 'idle',
  CARGANDO: 'cargando',
  EXITOSO: 'exitoso',
  ERROR: 'error',
};

// Mensajes genéricos
export const MENSAJES = {
  CARGANDO: 'Cargando datos...',
  ERROR_RED: 'Error de conexión. Verifica tu internet.',
  ERROR_GENERICO: 'Algo salió mal. Intenta de nuevo.',
  EXITO: 'Operación completada exitosamente',
  CONFIRMAR_ELIMINAR: '¿Estás seguro de que deseas eliminar esto?',
  CANCELADO: 'Operación cancelada',
  NO_DATOS: 'No hay datos disponibles',
  SESSION_EXPIRADA: 'Tu sesión ha expirado. Por favor inicia sesión de nuevo.',
};
