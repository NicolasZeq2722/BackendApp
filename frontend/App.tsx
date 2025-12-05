import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CitacionesScreen from "./src/screens/CitacionesScreen";
import PostulacionesScreen from "./src/screens/PostulacionesScreen";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" id={undefined}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Menu principal" }}
        />
        <Stack.Screen
          name="Citaciones"
          component={CitacionesScreen}
          options={{ title: "Citaciones" }}
        />
        <Stack.Screen
          name="Postulaciones"
          component={PostulacionesScreen}
          options={{ title: "Postulaciones" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
