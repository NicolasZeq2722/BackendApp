import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/api";
import { saveUserToDatabase, getUserFromDatabase, clearDatabase } from "../services/database";

export const AuthContext = createContext<any>({});

/**
 * Hook para usar el AuthContext en cualquier componente
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Logout primero (para que pueda ser usado por cargarDatos)
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      
      // Limpiar BD local
      await clearDatabase();
      console.log("✅ Base de datos local limpiada");
    } catch (err) {
      console.error("Error en logout:", err);
      // Aún así limpiar el estado local aunque falle el logout en servidor
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }
  };

  // Cargar datos de autenticación al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Solo intentar recuperar del caché si hay un token válido
      const tokenData = await AsyncStorage.getItem("token");
      
      if (tokenData) {
        // Validar que el token sigue siendo válido
        try {
          const userData = await authService.getCurrentUser();
          if (userData) {
            console.log("👤 Usuario recuperado y token válido");
            setUser(userData);
            setToken(tokenData);
          } else {
            // Token expirado o inválido
            await logout();
          }
        } catch (err) {
          // Error al validar token
          console.log("⚠️ Token inválido o expirado");
          await logout();
        }
      } else {
        // Sin token, limpiar cualquier usuario cacheado
        await clearDatabase();
        console.log("📝 Login requerido");
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log("🔐 Iniciando login para:", username);
      const response = await authService.login(username, password);
      console.log("✅ Respuesta del login:", response);
      
      // Construir objeto usuario con la respuesta del backend
      // Backend devuelve: token, rol, usuarioId, nombre, apellido, correo
      const userData = {
        id: response.usuarioId || response.id,
        nombre: response.nombre,
        apellido: response.apellido,
        correo: response.correo || response.email,
        role: response.rol || response.role,
        rol: response.rol || response.role,
        token: response.token,
      };
      
      setUser(userData);
      setToken(response.token);
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      
      // Guardar en BD local para caché
      await saveUserToDatabase(userData);
      
      console.log("✅ Usuario establecido:", userData);
      console.log("💾 Usuario guardado en BD local");
      return { success: true };
    } catch (err: any) {
      console.error("❌ Error en login:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      return {
        success: false,
        error: err.response?.data?.error || err.response?.data?.message || err.message || "Error en login",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
