import axios from 'axios';

const API_URL = 'http://192.168.1.11:8080/api';

/**
 * Interfaz para estadísticas generales
 */
export interface EstadisticasGenerales {
  totalAspirantes: number;
  aspirantesActivos: number;
  totalReclutadores: number;
  reclutadoresActivos: number;
  totalOfertas: number;
  ofertasAbiertas: number;
  totalPostulaciones: number;
  postulacionesPendientes: number;
  totalEmpresas: number;
  empresasActivas: number;
  tasaAceptacion?: number;
  tasaRechazo?: number;
}

/**
 * Interfaz para estadísticas por período
 */
export interface EstadisticasPeriodo {
  periodo: string;
  aspirantesRegistrados: number;
  postulacionesRealizadas: number;
  ofertasCreadas: number;
  citacionesRealizadas: number;
}

/**
 * Servicio para estadísticas y reportes
 */
class StatsServiceWrapper {
  /**
   * Obtener estadísticas generales del sistema
   */
  async getGenerales(): Promise<EstadisticasGenerales> {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      return response.data;
    } catch (error: any) {
      console.warn('Error obteniendo stats del servidor, usando datos locales');
      // Retornar estructura vacía si falla
      return {
        totalAspirantes: 0,
        aspirantesActivos: 0,
        totalReclutadores: 0,
        reclutadoresActivos: 0,
        totalOfertas: 0,
        ofertasAbiertas: 0,
        totalPostulaciones: 0,
        postulacionesPendientes: 0,
        totalEmpresas: 0,
        empresasActivas: 0,
      };
    }
  }

  /**
   * Obtener estadísticas de aspirantes
   */
  async getAspirantes(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/stats/aspirantes`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener stats de aspirantes');
    }
  }

  /**
   * Obtener estadísticas de ofertas
   */
  async getOfertas(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/stats/ofertas`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener stats de ofertas');
    }
  }

  /**
   * Obtener estadísticas de postulaciones
   */
  async getPostulaciones(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/stats/postulaciones`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener stats de postulaciones');
    }
  }

  /**
   * Obtener estadísticas por período (últimos 30 días)
   */
  async getPeriodo(dias: number = 30): Promise<EstadisticasPeriodo[]> {
    try {
      const response = await axios.get(`${API_URL}/stats/periodo`, {
        params: { dias },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener stats por período');
    }
  }

  /**
   * Obtener top empresas por postulaciones
   */
  async getTopEmpresas(limite: number = 5): Promise<any[]> {
    try {
      const response = await axios.get(`${API_URL}/stats/top-empresas`, {
        params: { limite },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener top empresas');
    }
  }

  /**
   * Obtener estadísticas de conversión
   */
  async getConversion(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/stats/conversion`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener stats de conversión');
    }
  }

  /**
   * Obtener estadísticas de modalidades
   */
  async getModalidades(): Promise<any> {
    try {
      const response = await axios.get(`${API_URL}/stats/modalidades`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener stats de modalidades');
    }
  }
}

export default new StatsServiceWrapper();
