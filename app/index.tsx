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







type ValuePiece = Date | string | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type Tasks = {
  title:string,
  sTitle:string
}[]

type HeadingsType = {
  heading:string
  description:string
  id:string
}[]


SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

function HomeScreen() {
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
  const [pressedButton, setPressedButton] = useState(null);
  const [title, onChangeTitle] = React.useState('');
  const [sTitle, onChangeSTitle] = React.useState('');
  const [tasks,setTasks] = useState<Tasks|[]>([])
  const [headings,setHeadings] = useState<HeadingsType>([])
  const [headingIndex,setHeadingIndex] = useState(0)
  const [loading,setLoading] = useState(true)


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

  const handleFormSubmit = async() =>{
    const item = {
      title,
      sTitle
    }
    setTasks((prev)=>[...prev,item])
    bottomSheetModalRef.current?.dismiss()
  }

  if (!fontsLoaded || !appIsReady) {
    return null;
  }

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
            <Text style={[styles.date, { fontFamily: 'Poppins_400Regular' }]}>{moment(Date.now()).format('dddd DD MMM ')}</Text>
          </View>

          <TouchableOpacity 
            style={styles.newTaskButton} 
            onPress={handlePresentModalPress}
            activeOpacity={0.7}
          >
            <Entypo name="plus" size={24} color="blue" />
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

        <ScrollView style={{width:"100%",display:"flex"}}>
    {tasks && tasks.map((item,index)=>(
        <TaskCard taskname={item.title} description={item.sTitle} key={index}/>
      ))}
      </ScrollView>
        
        
        
          {/* <Button
            onPress={handlePresentModalPress}
            title="Present Modal"
            color="black"
          /> */}
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            >
            
            <BottomSheetView style={styles.contentContainer}>
              <Text>Add New Task</Text>
              <View style={styles.form}>
              <Text>Title</Text>
              
              <TextInput  style={styles.input}
          onChangeText={onChangeTitle}
          value={title} ></TextInput>
              <Text>Description</Text>
              <TextInput style={styles.input}
          onChangeText={onChangeSTitle}
          value={sTitle} ></TextInput>
          <Button onPress={handleFormSubmit} title='Submit'></Button>
          {/* <Pressable onPress={toggleDatePicker}>
          <Text>Pick the date</Text>
            <TextInput editable={false} style={styles.input} value={moment(new Date()).format()}></TextInput>
          </Pressable>
          <Pressable onPress={toggleStartTimePicker}>
          <Text>Pick the start time</Text>
            <TextInput editable={false} style={styles.input} value={moment(new Date()).format()}></TextInput>
          </Pressable>
          <Pressable onPress={toggleEndTimePicker}>
          <Text>Pick the end time</Text>
            <TextInput editable={false} style={styles.input} value={moment(new Date()).format()}></TextInput>
          </Pressable> */}
         
            <View>
            {/* {openDatePicker && <DateTimePicker mode='date' display='default' value={date} onChange={onChange}/>}
            {startTimeSelector && <DateTimePicker mode='time' display='default' value={startTime} onChange={onChangeStartTime}/>}
            {endTimeSelector && <DateTimePicker mode='time' display='default' value={endTime} onChange={onChangeEndTime}/>} */}
      </View>
      {/* <TimeRangePicker onChange={onChange} value={value} /> */}
    
     
      </View>
             
            </BottomSheetView>
        
        </BottomSheetModal>
        
    

        {/* Conditionally show new task content */}
        {newTaskVisible && <Text style={[styles.newTaskContent]}>New Task Content Here</Text>}
      </View>
    </View>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}  
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    fontFamily:"Poppins_400Regular",
    position:"relative",
    zIndex:-1
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 18,
    color: '#555',
  },
  newTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d3e4f1',
    padding: 10,
    borderRadius: 5,
  },
  newTaskText: {
    marginLeft: 10,
    color: 'blue',
    fontSize: 18,
  },
  newTaskContent: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },

  // Notifications Section Styles
  notificationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 18,
    color: '#333',
    marginRight: 10,
  },
  notificationBadge: {
    backgroundColor: '#d3e4f1',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  notificationCount: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSheetContainer: {
    flex: 1,
    
    width:"100%"


  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  form:{
    width:"100%",
    display:"flex",
    rowGap:5

  }
});