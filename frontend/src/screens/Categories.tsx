import React, {useState, useEffect} from "react";
import {View, Text, FlatList, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator, ScrollView} from "react-native";
import { categoriesStyles } from "../styles/CategoriesStyles";
import { categoryService, authService } from '../services/api';

export default function CategoriesScreen() {
    const [categories, setCategories] = useState<any[]>
    ([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: ''});
    const [error, setError] = useState('')
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        loadCurrentUser();
        loadCategories();
    }, []);

    const loadCurrentUser = async () => {
        try {
            const user = await authService.getCurrentUser();
            setCurrentUser(user); {

            }
        } catch (error ) {
            console.error('Error al cargar el usuario actual: ', error)
        }
    };

    const loadCategories = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await categoryService.getAll();

            setCategories(response?.data || []);
        } catch (error ) {
            setError('No se pudieron cargar las categorias');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }

    const handlesave = async () {
        if (!formData.name.trim) {
            Alert.alert('Error', 'el nombre es obligatorio')
        }

        try {
            if (editing) {
                await categoryService.update(editing.id.formData);
                Alert.alert('Exito', 'Categoria actualizada')
            }
            else {
                await categoryService.create(formData);
                Alert.alert('Exito', 'Categoria creada');
            }
            setModalVisible(false);
            resetForm();
            loadCategories();
        } catch (error ) {
            Alert.alert('Error', 'no se puedo guardar')
        }

        const handleDelete = (item: any) => {
            if (currentUser?.role !== 'ADMIN') {
                Alert.alert('Acesso Denegado', )
            } else {
                Alert.alert('Confiar', `¿Eliminar ${item.name}?`), [
                    { text: 'Cancelar', style: 'cancel'},
                    {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await 
                            }
                        }
                    }
                ]
            }
            return;
        }
    }
}