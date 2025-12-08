import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";

// Import Screens
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";

const NavigationWrapper = () => {
  const authContext = useContext(AuthContext);
  
  if (authContext?.loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  const user = authContext?.user;

  // Renderiza LoginScreen si no hay usuario
  if (!user) {
    return <LoginScreen navigation={null} />;
  }

  // Renderiza HomeScreen si hay usuario
  return <HomeScreen navigation={null} />;
};

export default NavigationWrapper;
