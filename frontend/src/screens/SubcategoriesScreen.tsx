import React,{useState, useEffect, act} from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator,ScrollView } from "react-native";
import { picker } from '@react-native-picker/picker'
import {categoriesStyles} from '../styles/CategoriesStyles';
import {SubcategoryService, CategoryService, authService} from '../services/api';

export default function SucategoriesScreen(){
    const [Subcategories, setSubcategories] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] =  useState<any>(null);
    const [currenteUser, setCurrentUser] = useState<any>(null);
    const [formData, setFormData] = useState({name:'',description: '', categoryId: '', active: true});
    
    useEffect(()=>{
        loadSubcategories();
        loadCategories();
        loadCurrentUser();
    },[]);

    const loadCurrentUser = async () => {
        try{
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
        }catch(error){
            console.error('Error al cargar el usuario: ',error);
        }
    };

    const loadSubcategories = async () => {
        setLoading(true);
        try{
            const response = await SubcategoryService.getAll();
            setCategories(response?.data||[]);
        }catch(error){
            console.error('Error al cargar las subcategorias');
            setSubcategories([]);
            Alert.alert('Error', 'No se pudieron cargar las subcategorias')
        }finally{
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        setLoading(true);
        try{
            const response = await CategoryService.getAll();
            setCategories(response?.data||[]);
        }catch(error){
            console.error('Error al cargar las categorias');
            setCategories([]);
    };

    const handlesave = async () => {
        if(!formData.CategoryId){
            Alert.alert('Error','Debe seleccionar una categoria');
            return;
        }

        try{
            const data = {
                name: formData.name,
                description: formData.description,
                active: formData.active,
                category: { id: parseInt(formData.CategoryId)}
            };

            if(editing){
                await SubcategoryService.update(editing.id, formData);
                Alert.alert('Exito', 'Subcategoria actualizada')
            }else{
                await SubcategoryService.create(formData);
                Alert.alert('Exito','Subcategoria creada');
            }
            setModalVisible(false);
            resetForm();
            loadSubcategories();
        }catch (error: any){
            Alert.alert('Error', error.respone?.data?.message || 'Error al guardar');
        }
    };

    const handleDelete =(item:any) =>{
        if(currenteUser?.role !== 'ADMIN'){
            Alert.alert('Acceso denegado','Solo los administradores pueden eliminar');
            return;
        }
        
        Alert.alert('Confirmar',`¿Eliminar  Subcategoria ${item.name}?`
            ,[
            {text: 'Cancelar', style: 'cancel'},
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () =>{
                    try{
                        await SubcategoryService.delete(item.id);
                        Alert.alert('Exito','Subcategoria Eliminada');
                        loadSubcategories();
                    }catch(error){
                        Alert.alert('Error','No se puede eliminar');
                    }
                }
            }
        ]);
    };

    const handleToggleActive = (item : any) => {
        const action = item.active ? 'Desactivar' : 'Activar';
        Alert.alert('Confirmar',`¿${action.charAt(0).toUpperCase() + action.slice(1)}${item.name}?`,[
            {text: 'Cancelar', style: 'cancel'},
            {
                text: action.charAt(0).toUpperCase() + action.slice(1),onPress: async () =>{
                    try{
                        await SubcategoryService.update(item.id,{
                            name: item.name,
                            description: item.description,
                            active: item.active,
                            category: { id: item.category.id}
                        });
                        Alert.alert('Exito',`Subcategoria ${item.active ? 'desactivada' : 'activada'}`);
                        loadCategories();
                    }catch(error){
                        Alert.alert('Error',`No se pudo ${action}`);
                    }
                }
            }
        ]);
    };

    const openModal = (item : any = null) => {
        if (item) {
            setEditing(item);
            setFormData({name: item.name, description: item.description || '',
            categoryId: item.category.id?.toString() || '',
            active: item.active
            });
        } else {
            resetForm();
        }
        setModalVisible(true);
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({name: '', description: '', categoryId: '', active: tr});
    };

    if(loading){
        return(
            <View style={SubcategoriesStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#007Aff"/>
                <Text style={categoriesStyles.loadingText}>Cargando subcategorias...</Text>
            </View>
        );
    }

    return(
        <View style={SubcategoriesStyles.container}>
            {'/header'}
            <View style={SubcategoriesStyles.header}>
                <View style={SubcategoriesStyles.headerTitle}>
                    <Text style={SubcategoriesStyles.headerTitle}>Gestion de Subcategorias</Text>
                    <Text style={SubcategoriesStyles.headerSubtitle}>Administra las subcategorias de productos</Text>
                    {/*Actions*/}
                    <View style={subcategoriesStyles.actionsContainer}></View>
                    <TouchableOpacity 
                        style={SubcategoriesStyles.primaryButton}
                        onPress={() => {
                            openModal();
                        }}
                    >
                        <Text style={SubcategoriesStyles.primaryButtonText}>+ Nueva Subcategoria</Text>
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


        const renderCategory = ({item}: {item:any}) => (
        <View style={categoriesStyles.categoryCard}>
            <View style={categoriesStyles.categoryInfo}>
                <Text style={categoriesStyles.categoryName}>
                    {item.name} {!item.active && <Text style={{color: '#999'}}> (Inactiva)
                        </Text>}
                </Text>
                {item.description && (
                    <Text style={categoriesStyles.categoryDescription}>{item.description}</Text>
                )}
            </View>
            <View style={categoriesStyles.actionsConatiner}>
                <TouchableOpacity 
                    style={[categoriesStyles.actionButton, categoriesStyles.editButton]}
                    onPress={() => handleEdit(item)}
                    >
                    <Text style={[categoriesStyles.actionButtonText, categoriesStyles.editButtonText]}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[categoriesStyles.actionButton,item.active ? categoriesStyles.deleteButton : categoriesStyles.editButton]}
                    onPress={() => handleToggleActive(item)}
                    >
                    <Text style={[categoriesStyles.actionButtonText,item.active ? categoriesStyles.deleteButtonText : categoriesStyles.editButtonText]}>
                        {item.active ? 'Descativar' : 'Activar'}
                    </Text>
                </TouchableOpacity>
                {currenteUser?.role ==='ADMIN' &&(
                        <TouchableOpacity
                        style={[categoriesStyles.actionButton,categoriesStyles.deleteButton]}
                        onPress={() => handleDelete(item)}
                        >
                            <Text style={[categoriesStyles.actionButtonText, categoriesStyles.deleteButtonText]}>Eliminar</Text>
                        </TouchableOpacity>
                    )}
            </View>
        </View>
    );


            <FlatList
                data={subcategories}
                keyExtractor={(item) => item.id.toString() || Math.random().toString()}
                refreshing={loading}
                onRefresh={loadSubcategories}
                contentContainerStyle={SubcategoriesStyles.listContainer}
                showsVerticalScrollIndicator={false}
                renderItem={(!item)} => (
                    if (!item) return null;

                    return {
                        <View style={SubcategoriesStyles.card}>
                            <View style={SubcategoriesStyles.cardHeader}>
                                <Text style ={SubcategoriesStyles.cardTitle}>
                                    {item?.name || 'Sin nombre'} {!item.active && <Text style={{ color: '#999'}}>(Inactiva)</Text>}
                                    <Text style={SubcategoriesStyles.cardSubtitle}>()</Text>
                                    <Text></Text>
                                    <View style={SubcategoriesStyles.cardActions}>
                                        <TouchableOpacity>
                                            style={[SubcategoriesStyles.actionButton, SubcategoriesStyles.editButton]}
                                            onPress={()}
                                        </TouchableOpacity>
                ListEmptyComponent={
                    loading && !error ? (
                        <View style={categoriesStyles.emptyContainer}>
                            <Text style={categoriesStyles.emptyText}>No hay categorias</Text>
                            <Text style={categoriesStyles.emptySubtext}>Toca "Nueva" para comenzar</Text>
                        </View>
                    ) : null
                }
            />

            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={categoriesStyles.modalOverlay}>
                    <View style={categoriesStyles.modalContent}>
                        <ScrollView>
                            <View style={categoriesStyles.modalHeader}>
                                <Text style={categoriesStyles.modalTitle}>
                                    {editing ? 'Editar Categoria' : 'Nueva Categoria'}
                                </Text>
                            </View>

                            <View style={categoriesStyles.formContainer}>
                                <View style={categoriesStyles.inputGroup}>
                                    <Text style={categoriesStyles.inputLabel}>Nombre *</Text>
                                    <TextInput
                                        style={categoriesStyles.input}
                                        value={formData.name}
                                        onChangeText={(text) => setFormData({...formData, name: text})}
                                        placeholder="Nombre de la categoria"
                                        placeholderTextColor="#999"
                                    />
                                </View>
                            
                                <View style={categoriesStyles.inputGroup}>
                                        <Text style={categoriesStyles.inputLabel}>Descripcion</Text>
                                        <TextInput
                                            style={[categoriesStyles.input, categoriesStyles.textArea]}
                                            value={formData.description}
                                            onChangeText={(text) => setFormData({...formData, description: text})}
                                            placeholder="Descripcion opcional"
                                            placeholderTextColor="#999"
                                            multiline
                                            numberOfLines={3}
                                            textAlignVertical="top"
                                        />
                                </View>
                            </View>

                            <View style={categoriesStyles.modalButtons}>
                                <TouchableOpacity 
                                style={[categoriesStyles.modalButton, categoriesStyles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                                >
                                    <Text style={[categoriesStyles.modalButtonText, categoriesStyles.cancelButtonText]}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[categoriesStyles.modalButton, categoriesStyles.saveButton]}
                                    onPress={handlesave}
                                >
                                    <Text style={[categoriesStyles.modalButtonText, categoriesStyles.saveButtonText]}>
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