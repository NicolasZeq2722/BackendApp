/**
 * Hooks personalizados para React Native
 */

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook para manejar estado de carga asíncrona
 */
export const useCarga = (funcionAsync: () => Promise<any>) => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutar = async () => {
    try {
      setCargando(true);
      setError(null);
      const resultado = await funcionAsync();
      setCargando(false);
      return resultado;
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
      setCargando(false);
      throw err;
    }
  };

  return { cargando, error, ejecutar };
};

/**
 * Hook para manejar almacenamiento local
 */
export const useAlmacenamiento = (clave: string, valorInicial?: any) => {
  const [valor, setValor] = useState(valorInicial);
  const [cargando, setCargando] = useState(true);

  // Cargar valor al montar
  useEffect(() => {
    const cargar = async () => {
      try {
        const item = await AsyncStorage.getItem(clave);
        if (item) {
          setValor(JSON.parse(item));
        }
      } catch (error) {
        console.error('Error cargando almacenamiento:', error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [clave]);

  // Guardar valor
  const guardar = async (nuevoValor: any) => {
    try {
      setValor(nuevoValor);
      await AsyncStorage.setItem(clave, JSON.stringify(nuevoValor));
    } catch (error) {
      console.error('Error guardando almacenamiento:', error);
    }
  };

  // Limpiar valor
  const limpiar = async () => {
    try {
      setValor(valorInicial);
      await AsyncStorage.removeItem(clave);
    } catch (error) {
      console.error('Error limpiando almacenamiento:', error);
    }
  };

  return { valor, cargando, guardar, limpiar };
};

/**
 * Hook para manejar formularios
 */
export const useFormulario = (valorInicial: any = {}) => {
  const [valores, setValores] = useState(valorInicial);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const manejarCambio = (nombreCampo: string, valor: any) => {
    setValores((prev: any) => ({
      ...prev,
      [nombreCampo]: valor,
    }));
  };

  const establecerError = (nombreCampo: string, mensaje: string) => {
    setErrores((prev) => ({
      ...prev,
      [nombreCampo]: mensaje,
    }));
  };

  const limpiarErrores = () => {
    setErrores({});
  };

  const resetear = () => {
    setValores(valorInicial);
    setErrores({});
  };

  const tieneErrores = Object.keys(errores).length > 0;

  return {
    valores,
    errores,
    manejarCambio,
    establecerError,
    limpiarErrores,
    resetear,
    tieneErrores,
    setValores,
  };
};

/**
 * Hook para detectar si hay cambios sin guardar
 */
export const useCambiosSinGuardar = (valores: any, valoresOriginales: any) => {
  const [tieneCambios, setTieneCambios] = useState(false);

  useEffect(() => {
    const tieneAlgunCambio = JSON.stringify(valores) !== JSON.stringify(valoresOriginales);
    setTieneCambios(tieneAlgunCambio);
  }, [valores, valoresOriginales]);

  return tieneCambios;
};

/**
 * Hook para manejar debounce
 */
export const useDebounce = <T,>(valor: T, retraso: number = 500): T => {
  const [valorDebounce, setValorDebounce] = useState<T>(valor);

  useEffect(() => {
    const manejador = setTimeout(() => {
      setValorDebounce(valor);
    }, retraso);

    return () => clearTimeout(manejador);
  }, [valor, retraso]);

  return valorDebounce;
};

/**
 * Hook para manejar paginación
 */
export const usePaginacion = (itemsPorPagina: number = 10) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [items, setItems] = useState<any[]>([]);

  const irAPagina = (numeroPagina: number) => {
    setPaginaActual(Math.max(1, numeroPagina));
  };

  const irALaSiguiente = () => {
    setPaginaActual((prev) => prev + 1);
  };

  const irALaAnterior = () => {
    setPaginaActual((prev) => Math.max(1, prev - 1));
  };

  const totalPaginas = Math.ceil(items.length / itemsPorPagina);

  const itemsVisibles = items.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  return {
    paginaActual,
    totalPaginas,
    itemsVisibles,
    irAPagina,
    irALaSiguiente,
    irALaAnterior,
    setItems,
  };
};

/**
 * Hook para manejar refresh/recargar
 */
export const useRefresh = () => {
  const [refrescando, setRefrescando] = useState(false);

  const onRefresh = async (funcionAsync: () => Promise<void>) => {
    try {
      setRefrescando(true);
      await funcionAsync();
    } catch (error) {
      console.error('Error en refresh:', error);
    } finally {
      setRefrescando(false);
    }
  };

  return { refrescando, onRefresh };
};

/**
 * Hook para manejar modales
 */
export const useModal = (visibleInicial: boolean = false) => {
  const [visible, setVisible] = useState(visibleInicial);

  const abrir = () => setVisible(true);
  const cerrar = () => setVisible(false);
  const alternar = () => setVisible((prev) => !prev);

  return { visible, abrir, cerrar, alternar };
};

/**
 * Hook para manejar alertas
 */
export const useAlerta = () => {
  const mostrarExito = (titulo: string, mensaje: string = '') => {
    Alert.alert(titulo, mensaje, [{ text: 'OK' }]);
  };

  const mostrarError = (titulo: string, mensaje: string = '') => {
    Alert.alert('❌ ' + titulo, mensaje, [{ text: 'OK' }]);
  };

  const mostrarConfirmacion = (
    titulo: string,
    mensaje: string,
    onAceptar: () => void,
    onCancelar?: () => void
  ) => {
    Alert.alert(titulo, mensaje, [
      {
        text: 'Cancelar',
        onPress: onCancelar,
        style: 'cancel',
      },
      {
        text: 'Aceptar',
        onPress: onAceptar,
        style: 'destructive',
      },
    ]);
  };

  return { mostrarExito, mostrarError, mostrarConfirmacion };
};

/**
 * Hook para manejar timeout
 */
export const useTimeout = (callback: () => void, delay: number) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timer);
  }, [callback, delay]);
};

/**
 * Hook para manejar intervalo
 */
export const useIntervalo = (callback: () => void, delay: number, activo: boolean = true) => {
  useEffect(() => {
    if (!activo) return;

    const id = setInterval(() => {
      callback();
    }, delay);

    return () => clearInterval(id);
  }, [callback, delay, activo]);
};

/**
 * Hook para detectar si el componente está montado
 */
export const useIsMounted = (): boolean => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
};
