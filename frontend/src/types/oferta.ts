// Tipos y interfaces para Ofertas

export interface OfertaResponse {
  id: number;
  titulo: string;
  descripcion: string;
  salario: number;
  numeroVacantes: number;
  modalidad: 'REMOTO' | 'PRESENCIAL' | 'HIBRIDO';
  tipoContrato: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'TEMPORAL' | 'PRESTACION_SERVICIOS' | 'PRACTICAS';
  nivelExperiencia: 'SIN_EXPERIENCIA' | 'BASICO' | 'INTERMEDIO' | 'AVANZADO' | 'EXPERTO';
  estado: 'ABIERTA' | 'CERRADA' | 'PAUSADA';
  fechaLimite: string;
  fechaPublicacion: string;
  empresa?: {
    id: number;
    nombre: string;
    reclutadores?: Array<{
      id: number;
      nombre: string;
      apellido: string;
    }>;
  };
  municipio?: {
    id: number;
    nombre: string;
    departamento: string;
  };
  requisitos?: string[];
  beneficios?: string[];
  habilidadesRequeridas?: string[];
}

export interface OfertaCreateRequest {
  titulo: string;
  descripcion: string;
  salario: number;
  numeroVacantes: number;
  modalidad: 'REMOTO' | 'PRESENCIAL' | 'HIBRIDO';
  tipoContrato: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'TEMPORAL' | 'PRESTACION_SERVICIOS' | 'PRACTICAS';
  nivelExperiencia: 'SIN_EXPERIENCIA' | 'BASICO' | 'INTERMEDIO' | 'AVANZADO' | 'EXPERTO';
  estado: 'ABIERTA' | 'CERRADA' | 'PAUSADA';
  fechaLimite: string;
  municipioId: number;
  empresaId?: number;
  requisitos?: string[];
  beneficios?: string[];
  habilidadesRequeridas?: string[];
}

export interface OfertaUpdateRequest extends Partial<OfertaCreateRequest> {}
