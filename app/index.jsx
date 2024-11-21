import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AddTask from "./AddTask";
import HomeScreen from "./HomeScreen";
import { stackOptions } from "./data";

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{
            headerShown: true, 
          }}
        >

          {
            stackOptions.map((item,index)=>(
              <Stack.Screen key={index}
            name={item.name}
            component={item.component}
            options={{
              headerTitle: "Home", 
            }}
          />

            ))
          }
          
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
