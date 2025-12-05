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
import { postulacionService, authService } from "../services/api";
import { postulacionesStyles } from "../styles/PostulacionesStyles";
import { Colors } from "../styles/GlobalStyles";

export default function PostulacionesScreen({ navigation }: any) {
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
    loadPostulaciones();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadPostulaciones = async () => {
    try {
      setLoading(true);
      const response = await postulacionService.getAll();
      setPostulaciones(response.data);
    } catch (error) {
      console.error("Error loading postulaciones:", error);
      Alert.alert("Error", "No se pudieron cargar las postulaciones");
    } finally {
      setLoading(false);
    }
  };

  const renderPostulacion = ({ item }: any) => (
    <View style={postulacionesStyles.postulacionItem}>
      <Text style={postulacionesStyles.postulacionText}>
        Oferta: {item.oferta?.titulo}
      </Text>
      <Text style={postulacionesStyles.postulacionText}>
        Estado: {item.estado}
      </Text>
      <TouchableOpacity
        style={postulacionesStyles.button}
        onPress={() => handleViewPostulacion(item)}
      >
        <Text style={postulacionesStyles.buttonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </View>
  );

  const handleViewPostulacion = (postulacion: any) => {
    Alert.alert("Postulación", `Detalles: ${postulacion.fechaPostulacion}`);
  };

  if (loading) {
    return (
      <View style={postulacionesStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={postulacionesStyles.container}>
      <Text style={postulacionesStyles.title}>Postulaciones</Text>
      <FlatList
        data={postulaciones}
        renderItem={renderPostulacion}
        keyExtractor={(item: any) => item.id.toString()}
        ListEmptyComponent={
          <Text style={postulacionesStyles.emptyText}>
            No hay postulaciones disponibles
          </Text>
        }
      />
      {user && user.rol === "ASPIRANTE" && (
        <TouchableOpacity
          style={postulacionesStyles.addButton}
          onPress={() => navigation.navigate("CrearPostulacion")}
        >
          <Text style={postulacionesStyles.addButtonText}>
            Crear Postulación
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
