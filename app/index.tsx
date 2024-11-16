import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AddTask from "./AddTask";
import HomeScreen from "./HomeScreen";

const Stack = createStackNavigator();
export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}  
          />
            <Stack.Screen
            name="Add Task"
            component={AddTask}
            options={{ headerShown: false }}  
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  