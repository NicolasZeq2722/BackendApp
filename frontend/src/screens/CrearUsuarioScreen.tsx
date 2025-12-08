import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { usuarioService } from "../services/api";

const CrearUsuarioScreen = ({ route, navigation }: any) => {
  const isEditing = route?.params?.usuario;
  const [username, setUsername] = useState(isEditing?.username || "");
  const [email, setEmail] = useState(isEditing?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(isEditing?.role || "ASPIRANTE");
  const [numeroTelefono, setNumeroTelefono] = useState(isEditing?.numeroTelefono || "");
  const [resumen, setResumen] = useState(isEditing?.resumen || "");
  const [loading, setLoading] = useState(false);

  const validarFormulario = () => {
    if (!username.trim() || !email.trim() || !role) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return false;
    }
    if (!isEditing && !password.trim()) {
      Alert.alert("Error", "La contraseña es requerida");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Email no válido");
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      const userData: any = {
        username,
        email,
        role,
        numeroTelefono,
        resumen,
      };

      if (!isEditing) {
        userData.password = password;
        await usuarioService.create(userData);
        Alert.alert("Éxito", "Usuario creado correctamente");
      } else {
        await usuarioService.update(isEditing.id, userData);
        Alert.alert("Éxito", "Usuario actualizado correctamente");
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Error al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titulo}>
          {isEditing ? "Editar Usuario" : "Crear Usuario"}
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre de Usuario *</Text>
          <TextInput
            placeholder="ej: juan_perez"
            value={username}
            onChangeText={setUsername}
            editable={!loading}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            placeholder="ej: juan@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {!isEditing && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Contraseña *</Text>
            <TextInput
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Rol *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              enabled={!loading}
            >
              <Picker.Item label="Aspirante" value="ASPIRANTE" />
              <Picker.Item label="Reclutador" value="RECLUTADOR" />
              <Picker.Item label="Admin" value="ADMIN" />
              <Picker.Item label="ADSO" value="ADSO" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            placeholder="3001234567"
            value={numeroTelefono}
            onChangeText={setNumeroTelefono}
            keyboardType="phone-pad"
            editable={!loading}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Resumen / Bio</Text>
          <TextInput
            placeholder="Cuéntanos sobre ti..."
            value={resumen}
            onChangeText={setResumen}
            multiline
            numberOfLines={4}
            editable={!loading}
            style={[styles.input, styles.textArea]}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.guardarButton, loading && styles.buttonDisabled]}
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.guardarButtonText}>Guardar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
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
  content: {
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  textArea: {
    textAlignVertical: "top",
    minHeight: 100,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  guardarButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  guardarButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default CrearUsuarioScreen;
