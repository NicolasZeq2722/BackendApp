/**
 * Archivo de índice para importar todas las utilidades
 * 
 * Uso:
 * import { validaciones, formatos, ROLES, useFormulario } from '@/utils';
 */

// Validaciones y formatos
export { validaciones, mensajesError, formatos } from './validaciones';

// Constantes
export {
  API_BASE_URL,
  NAVIGATION,
  ROLES,
  ESTADOS_OFERTA,
  MODALIDADES,
  TIPOS_CONTRATO,
  NIVELES_EXPERIENCIA,
  DEPARTAMENTOS,
  COLORES,
  TIEMPOS,
  TAMAÑOS_FUENTE,
  ESPACIADOS,
  RADIOS,
  DEFAULTS,
  REGEX,
  ESTADOS_CARGA,
  MENSAJES,
} from './constantes';

// Hooks
export {
  useCarga,
  useAlmacenamiento,
  useFormulario,
  useCambiosSinGuardar,
  useDebounce,
  usePaginacion,
  useRefresh,
  useModal,
  useAlerta,
  useTimeout,
  useIntervalo,
  useIsMounted,
} from './hooks';

// API Utils
export {
  mapearErrorAPI,
  reintentar,
  conTimeout,
  procesarRespuesta,
  validarEstructura,
  formatearParams,
  crearHeaders,
  esErrorAutenticacion,
  esErrorConexion,
  esSeguroReintentar,
  construirURL,
  logearAPICall,
  logearAPIRespuesta,
  logearAPIError,
  parsearErroresValidacion,
  transformarRespuesta,
  validarURL,
  normalizarRuta,
} from './apiUtils';

// Axios Config
export {
  crearInstanciaAxios,
  axiosInstance,
  guardarTokens,
  obtenerToken,
  limpiarTokens,
  tieneTokenValido,
  decodificarJWT,
  estaTokenExpirado,
  obtenerUsuarioDelToken,
  establecerAuthorizacionManual,
  requestConReintentos,
} from './axiosConfig';
