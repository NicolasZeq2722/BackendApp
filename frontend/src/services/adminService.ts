import { usuarioService as baseUsuarioService } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DashboardStats {
  totalAspirantes: number;
  totalReclutadores: number;
  totalOfertas: number;
  ofertasAbiertas: number;
  totalPostulaciones: number;
  postulacionesAprobadas: number;
  totalCitaciones: number;
  citacionesRealizadas: number;
  usuariosActivos: number;
  usuariosInactivos: number;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'ASPIRANTE' | 'RECLUTADOR' | 'ADMINISTRADOR';
  isActive?: boolean;
  activo?: boolean;
  fechaCreacion?: string;
  imagen?: string;
}

class AdminService {
  /**
   * Obtener token del almacenamiento
   */
  private async getToken(): Promise<string> {
    const token = await AsyncStorage.getItem('token');
    return token || '';
  }

  /**
   * Obtener estadísticas del dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const token = await this.getToken();

      if (!token) {
        throw new Error('Token no disponible');
      }

      // Para el dashboard, calculamos estadísticas basadas en usuarios y ofertas
      // En producción, esto vendría de un endpoint dedicado
      const usuarios = await this.getUsuarios();
      
      // Calcular estadísticas
      const stats: DashboardStats = {
        totalAspirantes: usuarios.filter(u => u.rol === 'ASPIRANTE').length,
        totalReclutadores: usuarios.filter(u => u.rol === 'RECLUTADOR').length,
        totalOfertas: 0, // Obtener de ofertaService si es necesario
        ofertasAbiertas: 0,
        totalPostulaciones: 0,
        postulacionesAprobadas: 0,
        totalCitaciones: 0,
        citacionesRealizadas: 0,
        usuariosActivos: usuarios.filter(u => u.isActive || u.activo).length,
        usuariosInactivos: usuarios.filter(u => !(u.isActive || u.activo)).length,
      };

      return stats;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al obtener estadísticas';
      throw new Error(message);
    }
  }

  /**
   * Obtener lista de todos los usuarios
   */
  async getUsuarios(): Promise<Usuario[]> {
    try {
      const token = await this.getToken();

      if (!token) {
        throw new Error('Token no disponible');
      }

      const response = await baseUsuarioService.getAll();
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener usuarios';
      throw new Error(message);
    }
  }

  /**
   * Obtener usuario por ID
   */
  async getUsuarioById(id: number): Promise<Usuario> {
    try {
      const token = await this.getToken();

      if (!token) {
        throw new Error('Token no disponible');
      }

      const response = await baseUsuarioService.getById(id);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener usuario';
      throw new Error(message);
    }
  }

  /**
   * Obtener usuarios por rol
   */
  async getUsuariosByRole(role: 'ASPIRANTE' | 'RECLUTADOR' | 'ADMINISTRADOR'): Promise<Usuario[]> {
    try {
      const token = await this.getToken();

      if (!token) {
        throw new Error('Token no disponible');
      }

      const response = await baseUsuarioService.getByRole(role);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener usuarios por rol';
      throw new Error(message);
    }
  }

  /**
   * Actualizar estado de usuario (activo/inactivo)
   */
  async updateUsuarioStatus(id: number, isActive: boolean): Promise<Usuario> {
    try {
      const token = await this.getToken();

      if (!token) {
        throw new Error('Token no disponible');
      }

      const response = await baseUsuarioService.update(id, { isActive });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar usuario';
      throw new Error(message);
    }
  }

  /**
   * Eliminar usuario
   */
  async deleteUsuario(id: number): Promise<void> {
    try {
      const token = await this.getToken();

      if (!token) {
        throw new Error('Token no disponible');
      }

      await baseUsuarioService.delete(id);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al eliminar usuario';
      throw new Error(message);
    }
  }
}

export default new AdminService();
