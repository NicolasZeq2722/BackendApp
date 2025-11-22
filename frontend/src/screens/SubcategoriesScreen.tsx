import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator, ScrollView} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { subcategoriesStyles } from '../styles/SubcategoriesStyles';
import { subcategoryService, categoryService, authService } from '../services/api';

export default function SubcategoriesScreen() {
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: '', categoryId: '', active: true });
    
    useEffect(() => {
        loadCurrentUser();
        loadSubcategories();
        loadCategories();
    }, []);

    const loadCurrentUser = async () => {
        try {
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
        } catch (error) {
            console.error('Error al cargar el usuario: ', error);
        }
    };

    const loadSubcategories = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await subcategoryService.getAll();
            setSubcategories(response?.data || []);
        } catch (error) {
            console.error('Error al cargar las subcategorias');
            setSubcategories([]);
            setError('No se pudieron cargar las subcategorias');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await categoryService.getAll();
            setCategories(response?.data || []);
        } catch (error) {
            console.error('Error al cargar las categorias');
            setCategories([]);
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return;
        }

        if (!formData.categoryId) {
            Alert.alert('Error', 'Debe seleccionar una categoria');
            return;
        }

        try {
            const data = {
                name: formData.name,
                description: formData.description,
                active: formData.active,
                categoryId: parseInt(formData.categoryId)
            };

            if (editing) {
                await subcategoryService.update(editing.id, data);
                Alert.alert('Exito', 'Subcategoria actualizada');
            } else {
                await subcategoryService.create(data);
                Alert.alert('Exito', 'Subcategoria creada');
            }
            setModalVisible(false);
            resetForm();
            loadSubcategories();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Error al guardar');
        }
    };

    const handleDelete = (item: any) => {
        if (currentUser?.role !== 'ADMIN') {
            Alert.alert('Acceso denegado', 'Solo los administradores pueden eliminar');
            return;
        }
        
        Alert.alert('Confirmar', `¿Eliminar Subcategoria ${item.name}?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await subcategoryService.delete(item.id);
                        Alert.alert('Exito', 'Subcategoria Eliminada');
                        loadSubcategories();
                    } catch (error) {
                        Alert.alert('Error', 'No se puede eliminar');
                    }
                }
            }
        ]);
    };

    const handleToggleActive = (item: any) => {
        const action = item.active ? 'Desactivar' : 'Activar';
        Alert.alert('Confirmar', `¿${action} ${item.name}?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: action,
                onPress: async () => {
                    try {
                        await subcategoryService.update(item.id, {
                            name: item.name,
                            description: item.description,
                            active: !item.active,
                            categoryId: item.category?.id
                        });
                        Alert.alert('Exito', `Subcategoria ${item.active ? 'desactivada' : 'activada'}`);
                        loadSubcategories();
                    } catch (error) {
                        Alert.alert('Error', `No se pudo ${action.toLowerCase()}`);
                    }
                }
            }
        ]);
    };

    const openModal = (item: any = null) => {
        if (item) {
            setEditing(item);
            setFormData({
                name: item.name,
                description: item.description || '',
                categoryId: item.category?.id?.toString() || '',
                active: item.active
            });
        } else {
            resetForm();
        }
        setModalVisible(true);
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({ name: '', description: '', categoryId: '', active: true });
    };

    const renderSubcategory = ({ item }: { item: any }) => (
        <View style={subcategoriesStyles.card}>
            <View style={subcategoriesStyles.cardContent}>
                <Text style={subcategoriesStyles.cardTitle}>
                    {item?.name || 'Sin nombre'} {!item.active && <Text style={{ color: '#999' }}>(Inactiva)</Text>}
                </Text>
                {item.description && (
                    <Text style={subcategoriesStyles.cardDescription}>{item.description}</Text>
                )}
                <Text style={subcategoriesStyles.cardCategory}>
                    Categoría: {item?.category?.name || 'Sin categoría'}
                </Text>
            </View>
            <View style={subcategoriesStyles.cardActions}>
                <TouchableOpacity
                    style={[subcategoriesStyles.actionButton, subcategoriesStyles.editButton]}
                    onPress={() => openModal(item)}
                >
                    <Text style={subcategoriesStyles.actionButtonText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[subcategoriesStyles.actionButton, item.active ? subcategoriesStyles.toggleButton : subcategoriesStyles.editButton]}
                    onPress={() => handleToggleActive(item)}
                >
                    <Text style={subcategoriesStyles.actionButtonText}>{item.active ? '✓' : '✗'}</Text>
                </TouchableOpacity>
                {currentUser?.role === 'ADMIN' && (
                    <TouchableOpacity
                        style={[subcategoriesStyles.actionButton, subcategoriesStyles.deleteButton]}
                        onPress={() => handleDelete(item)}
                    >
                        <Text style={subcategoriesStyles.actionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={subcategoriesStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#007Aff" />
                <Text style={subcategoriesStyles.loadingText}>Cargando subcategorias...</Text>
            </View>
        );
    }

    return (
        <View style={subcategoriesStyles.container}>
            <View style={subcategoriesStyles.header}>
                <View style={subcategoriesStyles.headerContent}>
                    <Text style={subcategoriesStyles.headerTitle}>Gestion de Subcategorias</Text>
                    <Text style={subcategoriesStyles.headerSubtitle}>Administra las subcategorias de productos</Text>
                    <TouchableOpacity 
                        style={subcategoriesStyles.primaryButton}
                        onPress={() => openModal()}
                    >
                        <Text style={subcategoriesStyles.primaryButtonText}>+ Nueva Subcategoria</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {error ? (
                <View style={subcategoriesStyles.errorContainer}>
                    <Text style={subcategoriesStyles.errorText}>{error}</Text>
                    <TouchableOpacity style={subcategoriesStyles.retryButton} onPress={loadSubcategories}>
                        <Text style={subcategoriesStyles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            <FlatList
                data={subcategories}
                keyExtractor={(item, index) => item?.id?.toString() || `subcategory-${index}`}
                refreshing={loading}
                onRefresh={loadSubcategories}
                contentContainerStyle={subcategoriesStyles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={renderSubcategory}
                ListEmptyComponent={
                    !loading && !error ? (
                        <View style={subcategoriesStyles.emptyContainer}>
                            <Text style={subcategoriesStyles.emptyText}>No hay subcategorias</Text>
                            <Text style={subcategoriesStyles.emptySubtext}>Toca "Nueva" para comenzar</Text>
                        </View>
                    ) : null
                }
            />

            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={subcategoriesStyles.modalOverlay}>
                    <View style={subcategoriesStyles.modalContent}>
                        <ScrollView>
                            <View style={subcategoriesStyles.modalHeader}>
                                <Text style={subcategoriesStyles.modalTitle}>
                                    {editing ? 'Editar Subcategoria' : 'Nueva Subcategoria'}
                                </Text>
                            </View>

                            <View style={subcategoriesStyles.formContainer}>
                                <View style={subcategoriesStyles.inputGroup}>
                                    <Text style={subcategoriesStyles.inputLabel}>Nombre *</Text>
                                    <TextInput
                                        style={subcategoriesStyles.input}
                                        value={formData.name}
                                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                                        placeholder="Nombre de la subcategoria"
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            
                                <View style={subcategoriesStyles.inputGroup}>
                                    <Text style={subcategoriesStyles.inputLabel}>Descripcion</Text>
                                    <TextInput
                                        style={[subcategoriesStyles.input, subcategoriesStyles.textArea]}
                                        value={formData.description}
                                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                                        placeholder="Descripcion opcional"
                                        placeholderTextColor="#999"
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                    />
                                </View>

                                <View style={subcategoriesStyles.inputGroup}>
                                    <Text style={subcategoriesStyles.inputLabel}>Categoría *</Text>
                                    <Picker
                                        selectedValue={formData.categoryId}
                                        onValueChange={(value: string) => setFormData({ ...formData, categoryId: value })}
                                        style={subcategoriesStyles.picker}
                                    >
                                        <Picker.Item label="Seleccione una categoría" value="" />
                                        {(categories || []).map((cat) => (
                                            <Picker.Item
                                                key={cat.id}
                                                label={cat.name}
                                                value={cat.id.toString()}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={subcategoriesStyles.modalButtons}>
                                <TouchableOpacity 
                                    style={[subcategoriesStyles.modalButton, subcategoriesStyles.cancelButton]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={[subcategoriesStyles.modalButtonText, subcategoriesStyles.cancelButtonText]}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[subcategoriesStyles.modalButton, subcategoriesStyles.saveButton]}
                                    onPress={handleSave}
                                >
                                    <Text style={[subcategoriesStyles.modalButtonText, subcategoriesStyles.saveButtonText]}>
                                        {editing ? 'Actualizar' : 'Guardar'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}