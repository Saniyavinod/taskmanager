import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./HomeScreen";
import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';



const Stack = createStackNavigator();

export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);

  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(()=>{
    onLayoutRootView()
  },[appIsReady])

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          screenOptions={{ headerShown: true }}
        >
        
            <Stack.Screen
              
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerTitle: "" }}
            />
          
        </Stack.Navigator>
      </NavigationContainer>
   
  );
}
