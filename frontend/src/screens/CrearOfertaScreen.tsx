import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { ofertaService, authService } from "../services/api";

const CrearOfertaScreen = ({ route, navigation }: any) => {
  const { ofertaId } = route.params || {};
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [salario, setSalario] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipoContrato, setTipoContrato] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [habilidades, setHabilidades] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    cargarUsuario();
    if (ofertaId) {
      cargarOferta();
    }
  }, []);

  const cargarUsuario = async () => {
    const currentUser = await authService.getCurrentUser();
    if (currentUser?.role !== "RECLUTADOR" && currentUser?.role !== "ADMIN") {
      Alert.alert("Acceso Denegado", "Solo reclutadores pueden crear ofertas");
      navigation.goBack();
    }
    setUser(currentUser);
  };

  const cargarOferta = async () => {
    try {
      setLoading(true);
      const response = await ofertaService.getById(ofertaId);
      const oferta = response.data;
      setTitulo(oferta.titulo);
      setDescripcion(oferta.descripcion);
      setEmpresa(oferta.empresa);
      setSalario(oferta.salario.toString());
      setUbicacion(oferta.ubicacion);
      setTipoContrato(oferta.tipoContrato || "");
      setExperiencia(oferta.experienciaRequerida?.toString() || "");
      setHabilidades(oferta.habilidadesRequeridas || "");
      setIsEditMode(true);
    } catch (err) {
      Alert.alert("Error", "No se pudo cargar la oferta");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validarFormulario = () => {
    if (
      !titulo.trim() ||
      !descripcion.trim() ||
      !empresa.trim() ||
      !salario.trim() ||
      !ubicacion.trim()
    ) {
      Alert.alert("Error", "Todos los campos obligatorios deben completarse");
      return false;
    }
    if (isNaN(Number(salario))) {
      Alert.alert("Error", "El salario debe ser un número");
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validarFormulario() || !user) return;

    setLoading(true);
    try {
      const datosOferta = {
        titulo,
        descripcion,
        empresa,
        salario: Number(salario),
        ubicacion,
        tipoContrato,
        experienciaRequerida: experiencia ? Number(experiencia) : 0,
        habilidadesRequeridas: habilidades,
        reclutadorId: user.id,
        estado: "ACTIVA",
      };

      if (isEditMode && ofertaId) {
        await ofertaService.update(ofertaId, datosOferta, user.id);
        Alert.alert("Éxito", "Oferta actualizada correctamente");
      } else {
        await ofertaService.create(datosOferta, user.id);
        Alert.alert("Éxito", "Oferta creada correctamente");
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Error al guardar la oferta");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {isEditMode ? "Editar Oferta" : "Crear Nueva Oferta"}
        </Text>
      </View>

      {/* Título */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Título del Puesto *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Desarrollador Senior"
          value={titulo}
          onChangeText={setTitulo}
          editable={!loading}
        />
      </View>

      {/* Empresa */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Empresa *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Tech Company"
          value={empresa}
          onChangeText={setEmpresa}
          editable={!loading}
        />
      </View>

      {/* Descripción */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Descripción del Puesto *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe el puesto, responsabilidades, etc."
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={5}
          editable={!loading}
        />
      </View>

      {/* Ubicación */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Ubicación *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Ciudad, País"
          value={ubicacion}
          onChangeText={setUbicacion}
          editable={!loading}
        />
      </View>

      {/* Salario */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Salario (USD) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 50000"
          value={salario}
          onChangeText={setSalario}
          keyboardType="numeric"
          editable={!loading}
        />
      </View>

      {/* Tipo de Contrato */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Tipo de Contrato</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Tiempo completo, Contrato"
          value={tipoContrato}
          onChangeText={setTipoContrato}
          editable={!loading}
        />
      </View>

      {/* Experiencia Requerida */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Años de Experiencia</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 5"
          value={experiencia}
          onChangeText={setExperiencia}
          keyboardType="numeric"
          editable={!loading}
        />
      </View>

      {/* Habilidades */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Habilidades Requeridas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ej: Java, Spring Boot, SQL (separadas por comas)"
          value={habilidades}
          onChangeText={setHabilidades}
          multiline
          numberOfLines={3}
          editable={!loading}
        />
      </View>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.guardarBtn, loading && styles.buttonDisabled]}
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.guardarBtnText}>
              {isEditMode ? "Actualizar" : "Crear"} Oferta
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  formSection: {
    backgroundColor: "white",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  textArea: {
    textAlignVertical: "top",
    paddingTop: 12,
  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    gap: 10,
  },
  guardarBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  guardarBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default CrearOfertaScreen;
