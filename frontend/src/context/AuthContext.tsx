import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/api";

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

  // Cargar datos de autenticación al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const userData = await authService.getCurrentUser();
      const tokenData = await AsyncStorage.getItem("token");
      if (userData && tokenData) {
        setUser(userData);
        setToken(tokenData);
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      console.log("Login response:", response);
      
      // Construir objeto usuario con la respuesta
      const userData = {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
        token: response.token
      };
      
      setUser(userData);
      setToken(response.token);
      await AsyncStorage.setItem("token", response.token);
      console.log("Usuario establecido:", userData);
      return { success: true };
    } catch (err: any) {
      console.error("Error en login:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Error en login",
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("token");
    } catch (err) {
      console.error("Error en logout:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
