/**
 * 🔍 Validación del Admin Dashboard
 * 
 * Herramienta para verificar que todos los servicios y conexiones estén correctamente configurados
 * Ejecutar en AdminDashboardScreen.tsx durante desarrollo
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface ValidationResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const AdminDashboardValidator = {
  /**
   * Valida que el token esté disponible
   */
  validateToken: (): ValidationResult => {
    try {
      const token = localStorage?.getItem?.('token') || sessionStorage?.getItem?.('token');
      
      if (!token) {
        return {
          name: 'Token Check',
          status: 'error',
          message: 'No se encontró token en localStorage o sessionStorage',
          details: {
            localStorage: localStorage?.getItem?.('token'),
            sessionStorage: sessionStorage?.getItem?.('token'),
          },
        };
      }

      if (token.length < 50) {
        return {
          name: 'Token Check',
          status: 'warning',
          message: 'El token parece muy corto, puede ser inválido',
          details: { tokenLength: token.length },
        };
      }

      return {
        name: 'Token Check',
        status: 'success',
        message: `Token encontrado (${token.length} caracteres)`,
        details: { tokenLength: token.length },
      };
    } catch (err: any) {
      return {
        name: 'Token Check',
        status: 'error',
        message: `Error al verificar token: ${err.message}`,
      };
    }
  },

  /**
   * Valida que el backend esté respondiendo
   */
  validateBackendConnection: async (): Promise<ValidationResult> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 5000,
      }).catch(() => axios.get(`${API_BASE_URL}/ofertas`)); // Fallback si no existe /health

      return {
        name: 'Backend Connection',
        status: 'success',
        message: `Backend accesible en ${API_BASE_URL}`,
        details: { status: response.status },
      };
    } catch (err: any) {
      return {
        name: 'Backend Connection',
        status: 'error',
        message: `No se puede conectar al backend en ${API_BASE_URL}`,
        details: { error: err.message },
      };
    }
  },

  /**
   * Valida que /api/admin/dashboard esté disponible
   */
  validateDashboardEndpoint: async (): Promise<ValidationResult> => {
    try {
      const token = localStorage?.getItem?.('token') || sessionStorage?.getItem?.('token');
      
      if (!token) {
        return {
          name: 'Dashboard Endpoint',
          status: 'error',
          message: 'Token no disponible para validar endpoint',
        };
      }

      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      const requiredFields = [
        'totalAspirantes',
        'totalReclutadores',
        'totalOfertas',
        'ofertasAbiertas',
        'totalPostulaciones',
        'postulacionesAprobadas',
        'totalCitaciones',
        'citacionesRealizadas',
        'usuariosActivos',
        'usuariosInactivos',
      ];

      const missingFields = requiredFields.filter((field) => !(field in response.data));

      if (missingFields.length > 0) {
        return {
          name: 'Dashboard Endpoint',
          status: 'warning',
          message: `Faltan campos en respuesta: ${missingFields.join(', ')}`,
          details: { receivedFields: Object.keys(response.data) },
        };
      }

      return {
        name: 'Dashboard Endpoint',
        status: 'success',
        message: 'GET /api/admin/dashboard respondiendo correctamente',
        details: response.data,
      };
    } catch (err: any) {
      if (err.response?.status === 401) {
        return {
          name: 'Dashboard Endpoint',
          status: 'error',
          message: '401 Unauthorized - Token inválido o expirado',
          details: { status: err.response.status },
        };
      }

      if (err.response?.status === 403) {
        return {
          name: 'Dashboard Endpoint',
          status: 'error',
          message: '403 Forbidden - No tienes rol de ADMINISTRADOR',
          details: { status: err.response.status },
        };
      }

      return {
        name: 'Dashboard Endpoint',
        status: 'error',
        message: `Error en GET /api/admin/dashboard: ${err.message}`,
        details: { status: err.response?.status, data: err.response?.data },
      };
    }
  },

  /**
   * Valida que /api/admin/usuarios esté disponible
   */
  validateUsuariosEndpoint: async (): Promise<ValidationResult> => {
    try {
      const token = localStorage?.getItem?.('token') || sessionStorage?.getItem?.('token');
      
      if (!token) {
        return {
          name: 'Usuarios Endpoint',
          status: 'error',
          message: 'Token no disponible para validar endpoint',
        };
      }

      const response = await axios.get(`${API_BASE_URL}/admin/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      if (!Array.isArray(response.data)) {
        return {
          name: 'Usuarios Endpoint',
          status: 'error',
          message: 'Respuesta no es un array',
          details: { type: typeof response.data },
        };
      }

      const requiredFields = ['id', 'nombre', 'correo', 'rol'];
      const firstUser = response.data[0];

      if (firstUser) {
        const missingFields = requiredFields.filter((field) => !(field in firstUser));
        
        if (missingFields.length > 0) {
          return {
            name: 'Usuarios Endpoint',
            status: 'warning',
            message: `Faltan campos en usuarios: ${missingFields.join(', ')}`,
            details: { userCount: response.data.length },
          };
        }
      }

      return {
        name: 'Usuarios Endpoint',
        status: 'success',
        message: `GET /api/admin/usuarios respondiendo (${response.data.length} usuarios)`,
        details: { userCount: response.data.length },
      };
    } catch (err: any) {
      if (err.response?.status === 401) {
        return {
          name: 'Usuarios Endpoint',
          status: 'error',
          message: '401 Unauthorized - Token inválido o expirado',
          details: { status: err.response.status },
        };
      }

      if (err.response?.status === 403) {
        return {
          name: 'Usuarios Endpoint',
          status: 'error',
          message: '403 Forbidden - No tienes rol de ADMINISTRADOR',
          details: { status: err.response.status },
        };
      }

      return {
        name: 'Usuarios Endpoint',
        status: 'error',
        message: `Error en GET /api/admin/usuarios: ${err.message}`,
        details: { status: err.response?.status },
      };
    }
  },

  /**
   * Valida que /api/ofertas esté disponible
   */
  validateOfertasEndpoint: async (): Promise<ValidationResult> => {
    try {
      const token = localStorage?.getItem?.('token') || sessionStorage?.getItem?.('token');
      
      if (!token) {
        return {
          name: 'Ofertas Endpoint',
          status: 'error',
          message: 'Token no disponible para validar endpoint',
        };
      }

      const response = await axios.get(`${API_BASE_URL}/ofertas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      if (!Array.isArray(response.data)) {
        return {
          name: 'Ofertas Endpoint',
          status: 'error',
          message: 'Respuesta no es un array',
          details: { type: typeof response.data },
        };
      }

      const requiredFields = ['id', 'titulo', 'estado', 'salario'];
      const firstOferta = response.data[0];

      if (firstOferta) {
        const missingFields = requiredFields.filter((field) => !(field in firstOferta));
        
        if (missingFields.length > 0) {
          return {
            name: 'Ofertas Endpoint',
            status: 'warning',
            message: `Faltan campos en ofertas: ${missingFields.join(', ')}`,
            details: { ofertaCount: response.data.length },
          };
        }
      }

      return {
        name: 'Ofertas Endpoint',
        status: 'success',
        message: `GET /api/ofertas respondiendo (${response.data.length} ofertas)`,
        details: { ofertaCount: response.data.length },
      };
    } catch (err: any) {
      if (err.response?.status === 401) {
        return {
          name: 'Ofertas Endpoint',
          status: 'error',
          message: '401 Unauthorized - Token inválido o expirado',
          details: { status: err.response.status },
        };
      }

      return {
        name: 'Ofertas Endpoint',
        status: 'error',
        message: `Error en GET /api/ofertas: ${err.message}`,
        details: { status: err.response?.status },
      };
    }
  },

  /**
   * Ejecuta todas las validaciones
   */
  runAllValidations: async (): Promise<ValidationResult[]> => {
    const results: ValidationResult[] = [];

    // Validaciones sincrónicas
    results.push(AdminDashboardValidator.validateToken());

    // Validaciones asincrónicas
    results.push(await AdminDashboardValidator.validateBackendConnection());
    results.push(await AdminDashboardValidator.validateDashboardEndpoint());
    results.push(await AdminDashboardValidator.validateUsuariosEndpoint());
    results.push(await AdminDashboardValidator.validateOfertasEndpoint());

    return results;
  },

  /**
   * Genera un reporte en consola
   */
  printReport: (results: ValidationResult[]) => {
    console.log('\n📊 ============= ADMIN DASHBOARD VALIDATION REPORT =============');
    console.log(`⏰ Generado: ${new Date().toLocaleString()}\n`);

    results.forEach((result) => {
      const icon = result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⚠️';
      console.log(`${icon} ${result.name}: ${result.message}`);
      
      if (result.details) {
        console.log(`   📋 Detalles:`, result.details);
      }
    });

    const summary = {
      success: results.filter((r) => r.status === 'success').length,
      error: results.filter((r) => r.status === 'error').length,
      warning: results.filter((r) => r.status === 'warning').length,
    };

    console.log('\n📈 Resumen:');
    console.log(`   ✅ Exitosas: ${summary.success}`);
    console.log(`   ❌ Errores: ${summary.error}`);
    console.log(`   ⚠️  Advertencias: ${summary.warning}`);
    console.log('============================================================\n');
  },
};

export default AdminDashboardValidator;
