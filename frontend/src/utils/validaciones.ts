/**
 * Utilidades de validación para React Native
 * Se usa exclusivamente en campos de formulario
 */

export const validaciones = {
  /**
   * Validar que el email sea válido
   */
  esEmailValido: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Validar que el teléfono sea válido (Colombia)
   */
  esTelefonoValido: (telefono: string): boolean => {
    const regex = /^57[0-9]{10}$|^[0-9]{10}$/;
    return regex.test(telefono.replace(/\s/g, ''));
  },

  /**
   * Validar que la contraseña sea segura (mín 8 caracteres)
   */
  esPasswordSeguro: (password: string): boolean => {
    return password.length >= 8;
  },

  /**
   * Validar que un string no esté vacío
   */
  noEstaVacio: (valor: string): boolean => {
    return valor.trim().length > 0;
  },

  /**
   * Validar que un número sea positivo
   */
  esNumeroPositivo: (valor: string): boolean => {
    const numero = parseInt(valor, 10);
    return !isNaN(numero) && numero > 0;
  },

  /**
   * Validar que un número sea mayor o igual a un mínimo
   */
  esNumeroMayorQueMini: (valor: string, minimo: number): boolean => {
    const numero = parseInt(valor);
    return !isNaN(numero) && numero >= minimo;
  },

  /**
   * Validar que una fecha sea válida (YYYY-MM-DD)
   */
  esFechaValida: (fecha: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fecha)) return false;
    
    const fechaDate = new Date(fecha);
    return fechaDate instanceof Date && !isNaN(fechaDate.getTime());
  },

  /**
   * Validar que una fecha sea futura
   */
  esFechaFutura: (fecha: string): boolean => {
    const fechaDate = new Date(fecha);
    return fechaDate > new Date();
  },

  /**
   * Validar que una URL sea válida
   */
  esURLValida: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validar longitud de texto
   */
  esLongitudValida: (texto: string, minimo: number, maximo: number): boolean => {
    const longitud = texto.trim().length;
    return longitud >= minimo && longitud <= maximo;
  },
};

/**
 * Mensajes de error estandarizados
 */
export const mensajesError = {
  requerido: 'Este campo es requerido',
  emailInvalido: 'Email no es válido',
  passwordInseguro: 'La contraseña debe tener al menos 8 caracteres',
  telefonoInvalido: 'Teléfono no es válido',
  numeroInvalido: 'Debe ser un número válido',
  numeroMayorCero: 'Debe ser mayor a 0',
  fechaInvalida: 'La fecha no es válida (usa formato YYYY-MM-DD)',
  fechaNoFutura: 'La fecha debe ser posterior a hoy',
  urlInvalida: 'La URL no es válida',
  longitudMinima: (minimo: number) => `Mínimo ${minimo} caracteres`,
  longitudMaxima: (maximo: number) => `Máximo ${maximo} caracteres`,
};

/**
 * Formatos para mostrar datos
 */
export const formatos = {
  /**
   * Formatear moneda colombiana
   */
  formatearPeso: (cantidad: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(cantidad);
  },

  /**
   * Formatear teléfono (57 3xxxxxxx)
   */
  formatearTelefono: (telefono: string): string => {
    const limpio = telefono.replace(/\D/g, '');
    if (limpio.length === 10) {
      return `57${limpio}`;
    }
    return limpio;
  },

  /**
   * Formatear fecha (DD/MM/YYYY)
   */
  formatearFecha: (fechaString: string): string => {
    const fecha = new Date(fechaString);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  },

  /**
   * Formatear fecha a formato ISO (YYYY-MM-DD)
   */
  formatearFechaISO: (fecha: Date): string => {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  },

  /**
   * Truncar texto a N caracteres
   */
  truncar: (texto: string, longitud: number): string => {
    if (texto.length > longitud) {
      return texto.substring(0, longitud) + '...';
    }
    return texto;
  },

  /**
   * Capitalizar primer letra
   */
  capitalizarPrimera: (texto: string): string => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  },

  /**
   * Convertir enum a label amigable
   */
  enumToLabel: (enumValue: string): string => {
    return enumValue
      .split('_')
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ');
  },
};
