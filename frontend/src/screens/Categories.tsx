import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { categoriesStyles } from '../styles/CategoriesStyles';
import { categoryService, authService } from '../services/api';

export default function CategoriesScreen() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        loadCurrentUser();
        loadCategories();
    }, []);

    const loadCurrentUser = async () => {
        try {
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
        } catch (error) {
            console.error('Failed to load current user', error);
        }
    };

    const loadCategories = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await categoryService.getAll();
            setCategories(response.data || []);
        } catch (error) {
            setError('No se pudieron cargar las categorías');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };


    const handleSave = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return;
        }
        try {
            if (editing) {
                await categoryService.update(editing.id, formData);
                Alert.alert('Éxito', 'Categoría actualizada correctamente');
            } else {
                await categoryService.create(formData);
                Alert.alert('Éxito', 'Categoría creada correctamente');
            }
            setModalVisible(false);
            resetForm();
            loadCategories();
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar la categoría');
        }
    };

    const handleDelete =  (item : any) =>{
        if (currentUser?.role !== 'ADMIN') {
         Alert.alert('Acceso denegado', 'Solo los administradores pueden eliminar categorías.')   
         return
        }
        Alert.alert('Confirmar', `¿Eliminar ${item.name}?`, [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar", style: "destructive", onPress: async () => {  
                    try {
                        await categoryService.delete(item.id);
                        Alert.alert('Éxito', 'Categoría eliminada');
                        loadCategories();
                    } catch (error) {
                        Alert.alert('Error', 'No se puede eliminar la categoría');
                    }

                }
            }
        ]);
    };

    const handleToggleAttive = async (item: any) => {
        const action = item.active ? 'desactivar' : 'activar';
        Alert.alert('Confirmar' , `¿${action.charAt(0).toUpperCase() + action.slice(1)} ${item.name}?`, [
            { text: "Cancelar", style: "cancel" },
            {
                text: action.charAt(0).toUpperCase() + action.slice(1), onPress: async () => {
                    try {
                        await categoryService.update(item.id, {name: item.name, description: item.description, active: !item.active});
                        Alert.alert('Éxito', `Categoría ${item.active ? 'desactivada' : 'activada'}`);
                        loadCategories();
                    } catch (error) {
                        Alert.alert('Error', `No se pudo ${action}`);
                    }
                }
            }
        ]);
    };

    const handleEdit = (item : any) => {
        setFormData({ name: item.name, description : item.description || '' });
        setEditing(item);
        setModalVisible(true);
    };

        const resetForm = () => {
        setFormData({ name: '', description: '' });
        setEditing(null);
    };

    const renderCategory = ({item} : {item: any}) => (
        <View style={categoriesStyles.categoryCard}>
            <View style={categoriesStyles.categoryInfo}>
                <Text style={categoriesStyles.categoryName}>{item.name}{!item.active && <Text style={{ color: '#999' }}> (inactiva)</Text>}
                </Text>
                {item.description && (<Text style={categoriesStyles.categoryDescription}>{item.description}</Text>)}
            </View>

            
            <View style={categoriesStyles.ActionsContainer}>
                <TouchableOpacity style={[categoriesStyles.actionButton, categoriesStyles.editButton]} onPress={() => handleEdit(item)}>
                    <Text style={[categoriesStyles.actionButtonText, categoriesStyles.editButtonText]}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[categoriesStyles.actionButton, categoriesStyles.toggleButton]} onPress={() => handleToggleAttive(item)}>
                    <Text style={[categoriesStyles.actionButtonText, categoriesStyles.toggleButtonText]}>
                    {item.active ? 'Desactivar' : 'Activar'}
                </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    {currentUser?.role !== 'ADMIN' && (
                    <TouchableOpacity style={[categoriesStyles.actionButton, categoriesStyles.deleteButton]} onPress={() => handleDelete(item)}>
                        <Text style={[categoriesStyles.actionButtonText, categoriesStyles.deleteButtonText]}>Eliminar</Text>
                    </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={categoriesStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#007Aff" />
                <Text style={categoriesStyles.loadingText}>Cargando categorías...</Text>
            </View>
        );
    }

    return (
        <View style={categoriesStyles.container}>
            <View style={categoriesStyles.header}>
                <View style={categoriesStyles.headerContent}>
                    <Text style={categoriesStyles.headerTitle}>Gestion de Categorías</Text> 
                    <TouchableOpacity style={categoriesStyles.addButton} onPress={() => { resetForm(); setModalVisible(true); }}>
                        <Text style={categoriesStyles.addButtonText}>+ nueva</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {error ? (
                <View style={categoriesStyles.errorContainer}>
                    <Text style={categoriesStyles.errorText}>{error}</Text>
                    <TouchableOpacity style={categoriesStyles.retryButton} onPress={loadCategories}>
                        <Text style={categoriesStyles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );

    <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id?.toString() || ''}
        contentContainerStyle={categoriesStyles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            !loading && !error ? {
                <View style={categoriesStyles.emptyContainer}>
                    <Text style={categoriesStyles.emptyText}>No hay categorias</Text>
                    <Text style={categoriesStyles.emptySubText}>Toca "nueva" para comenzar</Text>
                </View>
             } : null
        }
    />


    <Model animationType="slide" transparent={true} visible={modalVisible} >
        <View style={categoriesStyles.modalOverlay}>
            <View style={categoriesStyles.modalContent}>
                <ScrollView>
                    <View style={categoriesStyles.modalHeader}>
                        <Text style={categoriesStyles.modalTitle}>{editing ? 'Editar Categoria' : 'Nueva categoria'}</Text>
                    </View>

                    <View style={categoriesStyles.formContainer}>
                        <View style={categoriesStyles.inputGroup}>
                            <Text style={categoriesStyles.inputLabel}>Nombre *</Text>
                            <TextInput
                            style={categoriesStyles.Input}
                            value={FormData.name}
                            onChangeText={(Text) => setFormData({...FormData, name: Text })}
                            placeholder="Nombre de la categoria"
                            placeholderTextColor="#999"/>
                        </View>

                        <View style={categoriesStyles.inputGroup}>
                            <Text style={categoriesStyles.inputLabel}>Descripcion *</Text>
                            <TextInput
                                style={[categoriesStyles.Input,categoriesStyles.textArea]}
                                value={FormData.description}
                                onChangeText={(Text) => setFormData((...FormData, description: Text))}
                                placeholder="Descripcion opcional"
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"/>
                        </View>
                    </View>
                    <View style={categoriesStyles.modalButtons}>
                        <TouchableOpacity style={[categoriesStyles.modalButtons, categoriesStyles.cancelButton]} onPress={() => setModalVisible(visible)}></TouchableOpacity>
                    </View>


                </ScrollView>



            </View>
        </View>
    </Model>


        