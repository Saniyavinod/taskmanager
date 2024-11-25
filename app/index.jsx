import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./HomeScreen";


const Stack = createStackNavigator();

export default function App() {
  return (
    
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{ headerShown: true }}
        >
        
            <Stack.Screen
              
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerTitle: "Home" }}
            />
          
        </Stack.Navigator>
      </NavigationContainer>
   
  );
}
