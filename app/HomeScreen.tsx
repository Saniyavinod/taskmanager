import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableOpacity,Button, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import HeadingCard from '@/components/HeadingCard';
import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';
import TaskCard from '@/components/TaskCard';
import moment from 'moment';
import { GestureHandlerRootView, ScrollView, TextInput } from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css';
import 'react-clock/dist/Clock.css';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native'
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import AddTask from './AddTask';
import { styles } from './styles/HomeScreenStyles';
import { router, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';


type ValuePiece = Date | string | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// type Tasks = {
//   title:string,
//   sTitle:string
// }[]

type HeadingsType = {
  heading:string
  description:string
  id:string
}[]

type Task = {
  title: string;
  sTitle: string;
};
SplashScreen.preventAutoHideAsync();



 export default  function HomeScreen() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [newTaskVisible, setNewTaskVisible] = useState(false);
  const [notifications, setNotifications] = useState({
    all: 5, 
    open: 3, 
    closed: 2,
  });

  // Separate state for each button press
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [headings, setHeadings] = useState<HeadingsType>([]); // Initial empty array
  const [headingIndex,setHeadingIndex] = useState(0)
  const [loading,setLoading] = useState(true)
  const router = useRouter();
  // const [open, setOpen] = useState(false)
  // const [value, onChange] = useState<Value>(['10:00', '11:00']);
  // Correctly using useFonts hook inside the component
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(()=>{
    async function getHeading(){
     setLoading(true)
      const response=await fetch("https://67333b5d2a1b1a4ae112a811.mockapi.io/api/p/carddara")
      const data = await response.json()
      setHeadings(data)
      setLoading(false)
    }
    
getHeading()

  },[])

  useEffect(() => {
    const intervalId = setInterval(() => {
      headingIndex == headings.length-1 ? setHeadingIndex(0) : setHeadingIndex(headingIndex + 1)
          
      setHeading(headings[headingIndex].heading);
      
      setDescription(headings[headingIndex].description);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [headingIndex,headings]);

 const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  
  const handleButtonPress = (button:string) => {
    setPressedButton(button); 
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // const handleFormSubmit = async() =>{
  //   const item = {
  //     title,
  //     sTitle
  //   }
  //   setTasks((prev)=>[...prev,item])
  //   bottomSheetModalRef.current?.dismiss()
  // }

  if (!fontsLoaded || !appIsReady) {
    return null;
  }
  // const { newTask } = useLocalSearchParams();
  // const parsedTask = newTask ? JSON.parse(newTask) : null;

  // const [tasks, setTasks] = useState<Task[]>([]);

  // useEffect(() => {
  //   if (parsedTask) {
  //     // If parsedTask is an object, convert it to an array
  //     setTasks((prev) => Array.isArray(parsedTask) ? [...prev, ...parsedTask] : [...prev, parsedTask]);
  //   }
  // }, [parsedTask]);
  return (
    <GestureHandlerRootView style={styles.bottomSheetContainer}>
    <BottomSheetModalProvider>
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar hidden={false} />

      <HeadingCard heading={heading} description={description} loading={loading}/>

      <View style={styles.content}>
        <View style={styles.taskRow}>
          <View>
            <Text style={[styles.taskTitle, { fontFamily: 'Poppins_400Regular' }]}>Today's Task</Text>
            <Text style={[styles.date, { fontFamily: 'Poppins_400Regular' }]}>{moment(Date.now()).format('dddd ,DD MMM ')}</Text>
          </View>

          <TouchableOpacity 
            style={styles.newTaskButton} 
            onPress={ ()=> router.replace('/AddTask')}
            activeOpacity={0.7}
            
            
          >
            <Entypo name="plus" size={18} color="blue" />
            <Text style={[styles.newTaskText, { fontFamily: 'Poppins_400Regular' }]}>New Task</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.notificationsContainer}>
          <TouchableOpacity 
            style={styles.notificationItem} 
            activeOpacity={0.7}
            onPress={() => handleButtonPress('all')}
          >
            <Text style={[styles.notificationText, { fontFamily: 'Poppins_400Regular', color: pressedButton === 'all' ? 'blue' : 'black' }]}>
              All
            </Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{notifications.all}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.notificationItem} 
            activeOpacity={0.7}
            onPress={() => handleButtonPress('open')}
          >
            <Text style={[styles.notificationText, { fontFamily: 'Poppins_400Regular', color: pressedButton === 'open' ? 'blue' : 'black' }]}>
              Open
            </Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{notifications.open}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.notificationItem} 
            activeOpacity={0.7}
            onPress={() => handleButtonPress('closed')}
          >
            <Text style={[styles.notificationText, { fontFamily: 'Poppins_400Regular', color: pressedButton === 'closed' ? 'blue' : 'black' }]}>
              Closed
            </Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{notifications.closed}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* <ScrollView style={{width:"100%",display:"flex"}}>
    {tasks?.map((task,index)=>(
        <TaskCard taskname={task.title} description={task.sTitle} key={index}/>
      ))}
      </ScrollView> */}
        
        
       
    

        {/* Conditionally show new task content */}
        {newTaskVisible && <Text style={[styles.newTaskContent]}>New Task Content Here</Text>}
      </View>
    </View>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
