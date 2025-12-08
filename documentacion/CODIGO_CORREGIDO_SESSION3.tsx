/**
 * 📋 CÓDIGO CORREGIDO - Sesión Bug Fix #3
 * 
 * Este archivo muestra los fragmentos de código actualizado
 * para los 3 problemas resueltos
 */

// ============================================================
// 1️⃣ CitacionesScreen.tsx - handleSave() CORREGIDA
// ============================================================

const handleSave = async () => {
  if (!formData.detallesCitacion || !formData.aspiranteId || !formData.ofertaId) {
    Alert.alert("Error", "Por favor complete todos los campos requeridos");
    return;
  }

  try {
    const aspiranteId = parseInt(formData.aspiranteId);
    const ofertaId = parseInt(formData.ofertaId);

    // 🔍 PASO 1: Buscar la postulación que coincida con aspirante + oferta
    // El backend requiere postulacionId, no aspiranteId + ofertaId
    let postulacionId: number | null = null;

    if (!editingCitacion) {
      // Al crear, necesitamos encontrar la postulación
      try {
        const response = await postulacionService.getByAspirante(aspiranteId);
        const postulaciones = response.data || [];
        
        // Buscar postulación que tenga ofertaId que coincida
        const postulacion = postulaciones.find(
          (p: any) => p.oferta?.id === ofertaId || p.ofertaId === ofertaId
        );

        if (!postulacion) {
          Alert.alert(
            "Error",
            `No existe una postulación del aspirante a esta oferta. Asegúrate que el aspirante se haya postulado a la oferta.`
          );
          return;
        }

        postulacionId = postulacion.id;
        console.log("✅ Postulación encontrada:", postulacionId);
      } catch (error) {
        console.error("❌ Error buscando postulación:", error);
        Alert.alert("Error", "No se pudo verificar la postulación del aspirante");
        return;
      }
    } else {
      // Al editar, usar la postulación existente
      postulacionId = editingCitacion.postulacion?.id;
      if (!postulacionId) {
        Alert.alert("Error", "No se puede obtener la postulación de esta citación");
        return;
      }
    }

    // 📦 PASO 2: Construir el payload correcto para el backend
    // El DTO CitacionCreateRequest espera: postulacionId, reclutadorId, fechaCitacion, hora, linkMeet, detallesCitacion, observaciones
    const citacionData = {
      postulacionId: postulacionId,
      reclutadorId: user.id,
      detallesCitacion: formData.detallesCitacion,
      fechaCitacion: formData.fechaCitacion.toISOString().split("T")[0], // ISO string format YYYY-MM-DD
      hora: formData.horaCitacion, // Formato HH:MM
      linkMeet: formData.enlaceVideoLlamada || "", // Campo llamado linkMeet en backend
      observaciones: "", // Campo adicional disponible en backend
    };

    // 🔍 LOG: Ver exactamente qué se envía
    console.log("📤 Payload enviado al backend:", JSON.stringify(citacionData, null, 2));

    if (editingCitacion) {
      console.log("✏️ Actualizando citación:", editingCitacion.id);
      await citacionService.update(editingCitacion.id, citacionData, user.id);
      Alert.alert("✅ Éxito", "Citación actualizada correctamente");
    } else {
      console.log("➕ Creando nueva citación");
      await citacionService.create(citacionData, user.id);
      Alert.alert("✅ Éxito", "Citación creada correctamente");
    }
    closeModal();
    cargarCitaciones();
  } catch (error: any) {
    console.error("❌ Error al guardar citación:", error);
    console.error("Detalles del error:", error.response?.data);
    Alert.alert(
      "Error",
      error.response?.data?.message || 
      error.message || 
      "Error al guardar citación"
    );
  }
};

// ============================================================
// 2️⃣ PostulacionesScreen.tsx - handleNavigateToOferta() MEJORADA
// ============================================================

const handleNavigateToOferta = () => {
  // 🔍 DEPURACIÓN: Log del objeto postulación
  console.log("📦 Objeto postulación completo:", JSON.stringify(item, null, 2));
  
  // Intentar obtener ID de oferta de varias formas posibles
  // Orden de preferencia: item.oferta.id > item.ofertaId
  const ofertaId = item.oferta?.id || item.ofertaId;
  
  console.log("🔍 Buscando ofertaId...");
  console.log("   - item.oferta?.id:", item.oferta?.id);
  console.log("   - item.ofertaId:", item.ofertaId);
  console.log("   - ofertaId final:", ofertaId);
  
  if (!ofertaId) {
    console.error("❌ No se encontró ofertaId en la postulación:", item);
    Alert.alert(
      "Error",
      "Los datos de la oferta no están disponibles. Por favor intente más tarde.",
      [{ text: "OK" }]
    );
    return;
  }
  
  console.log("✅ Navegando a DetalleOferta con ofertaId:", ofertaId);
  navigation.navigate('DetalleOferta', { ofertaId });
};

// ============================================================
// 3️⃣ OfertasScreen.tsx - renderItem() CON LÓGICA DE ROLES
// ============================================================

renderItem={({ item }) => {
  // 🔐 LÓGICA DE ROLES - Según SecurityConfig.java
  // RECLUTADOR y ADMIN pueden editar/eliminar TODAS las ofertas
  const isRecruiterOrAdmin = user?.role === "ADMIN" || user?.role === "RECLUTADOR";
  const isAspirante = user?.role === "ASPIRANTE";

  console.log("👤 Usuario:", user?.username, "Rol:", user?.role);
  console.log("🔑 isRecruiterOrAdmin:", isRecruiterOrAdmin, "isAspirante:", isAspirante);

  return (
    <View style={styles.ofertaCard}>
      <Text style={styles.ofertaTitulo}>{item.titulo}</Text>
      <Text style={styles.ofertaEmpresa}>{item.empresa}</Text>

      <View style={styles.detallesRow}>
        <Text style={styles.detalleItem}>📍 {item.ubicacion}</Text>
        <Text style={styles.detalleItem}>💰 ${item.salario}</Text>
      </View>

      <Text style={styles.ofertaDescripcion} numberOfLines={2}>
        {item.descripcion}
      </Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.verDetallesBtn}
          onPress={() => navigation.navigate('DetalleOferta', { ofertaId: item.id })}
        >
          <Text style={styles.verDetallesText}>Ver Detalles</Text>
        </TouchableOpacity>

        {/* ✅ Solo ASPIRANTE puede postularse */}
        {isAspirante && (
          <TouchableOpacity
            style={styles.postularseBtn}
            onPress={() => handlePostularse(item.id)}
          >
            <Text style={styles.postularseText}>Postularme</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ✅ Solo RECLUTADOR y ADMIN ven botones de editar/eliminar */}
      {isRecruiterOrAdmin && (
        <View style={styles.adminActionButtons}>
          <TouchableOpacity
            style={[styles.adminButton, styles.editButton]}
            onPress={() => {
              console.log("✏️ Editando oferta ID:", item.id, "por usuario:", user?.username);
              // ✅ Navegar a CrearOfertaScreen en modo edición (reutiliza la pantalla)
              navigation.navigate('CrearOferta', { 
                ofertaId: item.id,
                editMode: true
              });
            }}
          >
            <Text style={styles.adminButtonText}>✏️ Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.adminButton, styles.deleteButton]}
            onPress={() =>
              Alert.alert(
                "❌ Eliminar Oferta",
                `¿Está seguro que desea eliminar "${item.titulo}"?\n\nEsta acción no se puede deshacer.`,
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        console.log("🗑️ Eliminando oferta ID:", item.id, "por usuario:", user?.username);
                        await ofertaService.delete(item.id, user.id);
                        Alert.alert(
                          "✅ Éxito",
                          "Oferta eliminada correctamente"
                        );
                        cargarOfertas();
                      } catch (error: any) {
                        console.error("❌ Error eliminando oferta:", error);
                        Alert.alert(
                          "Error",
                          error.response?.data?.message ||
                            "Error al eliminar oferta"
                        );
                      }
                    },
                  },
                ]
              )
            }
          >
            <Text style={styles.adminButtonText}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}}

// ============================================================
// COMPARATIVA: ANTES vs DESPUÉS
// ============================================================

/*
 
PROBLEMA 1: Error 400 en Citaciones
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ ANTES:
  const citacionData = {
    aspiranteId: parseInt(formData.aspiranteId),        // ❌ No esperado
    ofertaId: parseInt(formData.ofertaId),              // ❌ No esperado
    horaCitacion: formData.horaCitacion,                // ❌ Campo incorrecto
    enlaceVideoLlamada: formData.enlaceVideoLlamada,    // ❌ Campo incorrecto
  };

✅ DESPUÉS:
  const citacionData = {
    postulacionId: postulacionId,        // ✅ Búsqueda automática
    reclutadorId: user.id,
    detallesCitacion,
    fechaCitacion,                       // ✅ Formato YYYY-MM-DD
    hora,                                // ✅ Nombre correcto
    linkMeet,                            // ✅ Nombre correcto
    observaciones: "",
  };

 
PROBLEMA 2: Navegación en Postulaciones
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ ANTES:
  const ofertaId = item.oferta?.id || item.ofertaId;
  navigation.navigate('DetalleOferta', { ofertaId });
  // Sin logging, sin validación

✅ DESPUÉS:
  const ofertaId = item.oferta?.id || item.ofertaId;
  
  if (!ofertaId) {
    Alert.alert("Error", "Los datos no están disponibles");
    return;
  }
  
  console.log("✅ Navegando con ofertaId:", ofertaId);
  navigation.navigate('DetalleOferta', { ofertaId });

 
PROBLEMA 3: Permisos de Edición
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ ANTES:
  const canEditDelete = 
    user?.role === "ADMIN" ||
    (user?.role === "RECLUTADOR" && user?.id === item.reclutadorId);
  // Solo propietario de la oferta puede editar
  
  {user?.role === "ASPIRANTE" && <Postularme />}
  // Pero aspirante TAMBIÉN ve botones de editar si es propietario

✅ DESPUÉS:
  const isRecruiterOrAdmin = user?.role === "ADMIN" || user?.role === "RECLUTADOR";
  const isAspirante = user?.role === "ASPIRANTE";
  
  {isAspirante && <Postularme />}
  {isRecruiterOrAdmin && <Editar /> <Eliminar />}
  // Roles completamente separados, sin cruce

*/
