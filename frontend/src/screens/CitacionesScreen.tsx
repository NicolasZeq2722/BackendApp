import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { citacionService, authService } from "../services/api";
import { citacionesStyles } from "../styles/CitacionesStyles";
import { Colors } from "../styles/GlobalStyles";

export default function CitacionesScreen({ navigation }: any) {
  const [citaciones, setCitaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
    loadCitaciones();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadCitaciones = async () => {
    try {
      setLoading(true);
      const response = await citacionService.getAll();
      setCitaciones(response.data);
    } catch (error) {
      console.error("Error loading citaciones:", error);
      Alert.alert("Error", "No se pudieron cargar las citaciones");
    } finally {
      setLoading(false);
    }
  };

  const renderCitacion = ({ item }: any) => (
    <View style={citacionesStyles.citacionItem}>
      <Text style={citacionesStyles.citacionText}>
        Fecha: {item.fechaCitacion}
      </Text>
      <Text style={citacionesStyles.citacionText}>Estado: {item.estado}</Text>
      <TouchableOpacity
        style={citacionesStyles.button}
        onPress={() => handleViewCitacion(item)}
      >
        <Text style={citacionesStyles.buttonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </View>
  );

  const handleViewCitacion = (citacion: any) => {
    // Navegar a detalles o editar
    Alert.alert("Citación", `Detalles: ${citacion.detallesCitacion}`);
  };

  if (loading) {
    return (
      <View style={citacionesStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={citacionesStyles.container}>
      <Text style={citacionesStyles.title}>Citaciones</Text>
      <FlatList
        data={citaciones}
        renderItem={renderCitacion}
        keyExtractor={(item: any) => item.id.toString()}
        ListEmptyComponent={
          <Text style={citacionesStyles.emptyText}>
            No hay citaciones disponibles
          </Text>
        }
      />
      {user && (user.rol === "RECLUTADOR" || user.rol === "ADMIN") && (
        <TouchableOpacity
          style={citacionesStyles.addButton}
          onPress={() => navigation.navigate("CrearCitacion")}
        >
          <Text style={citacionesStyles.addButtonText}>Crear Citación</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
