import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import UsersScreen from './src/screens/UsersScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import SucategoriesScreen from './src/screens/SubcategoriesScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{title: "Menu principal"}}/>
        <Stack.Screen name="Users" component={UsersScreen} options={{title: "Gestion de usuarios"}}/>
        <Stack.Screen name="Products" component={ProductsScreen} options={{title: "Productos"}}/>
        <Stack.Screen name="Categories" component={CategoriesScreen} options={{title: "Categorías"}}/>
        <Stack.Screen name="Subcategories" component={SucategoriesScreen} options={{title: "Subcategorías"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
