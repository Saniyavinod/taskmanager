import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';
import HeadingCard from '@/components/HeadingCard';
import moment from 'moment';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from './styles/HomeScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskCard from '@/components/TaskCard';
import { buttonOptions } from './data';


type HeadingsType = {
  heading: string;
  description: string;
  id: string;
}[];

type Task = {
  title: string;
  sTitle: string;
  id: string;
  date:Date;
  startTime:Date;
  endTime:Date;
};

SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [headings, setHeadings] = useState<HeadingsType>([]);
  const [headingIndex, setHeadingIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    all: 5,
    open: 3,
    closed: 2,
  });
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });
  const router = useRouter();
  const { taskUpdated } = useLocalSearchParams();
  const [refetch,setRefetch] = useState(true)

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    if (storedTasks) {
      setTasksList(JSON.parse(storedTasks));
      console.log(storedTasks)
    }
  };

  // Load tasks on mount and when taskUpdated changes
  useEffect(() => {
    loadTasks();
  }, [taskUpdated,refetch]);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate some loading time
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    async function fetchHeadings() {
      setLoading(true);
      try {
        const response = await fetch("https://67333b5d2a1b1a4ae112a811.mockapi.io/api/p/carddara");
        const data = await response.json();
        setHeadings(data);
      } catch (error) {
        console.error("Error fetching headings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHeadings();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHeadingIndex((prevIndex) => {
        const nextIndex = prevIndex === headings.length - 1 ? 0 : prevIndex + 1;
        setHeading(headings[nextIndex]?.heading || "");
        setDescription(headings[nextIndex]?.description || "");
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [headings]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const handleButtonPress = (button: string) => {
    console.log(button)
    setPressedButton(button);
  };


  if (!fontsLoaded || !appIsReady) {
    return null;
  }

 

  return (
    <GestureHandlerRootView style={styles.bottomSheetContainer}>
      <BottomSheetModalProvider>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <StatusBar hidden={false} />
          <HeadingCard heading={heading} description={description} loading={loading} />
          <View style={styles.content}>
            <View style={styles.taskRow}>
              <View>
                <Text style={[styles.taskTitle, { fontFamily: 'Poppins_400Regular' }]}>Today's Task</Text>
                <Text style={[styles.date, { fontFamily: 'Poppins_400Regular' }]}>{moment(Date.now()).format('dddd ,DD MMM ')}</Text>
              </View>
              <TouchableOpacity
                style={styles.newTaskButton}
                onPress={() => router.replace('/AddTask')}
                activeOpacity={0.7}
              >
                <Entypo name="plus" size={18} color="blue" />
                <Text style={[styles.newTaskText, { fontFamily: 'Poppins_400Regular' }]}>New Task</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.notificationsContainer}>
              {
                buttonOptions.map((item,index)=>(
                  <TouchableOpacity key={index}
                style={styles.notificationItem}
                activeOpacity={0.7}
                onPress={() => handleButtonPress(item.buttonText)}
              >
                <Text style={[styles.notificationText, { color: pressedButton === item.buttonText ? 'blue' : 'black' }]}>{item.buttonText}</Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>{notifications.all}</Text>
                </View>
              </TouchableOpacity>

                ))
              }
              

             
            </View>

            <FlatList
              style={{ width: "100%" }}
              contentContainerStyle={{ paddingBottom: 100 }}
              data={tasksList}
              renderItem={({ item }) => (
                <TaskCard taskname={item.title} description={item.sTitle} taskId={item.id} setRefetch={setRefetch} date={item.date} startTime={item.startTime} endTime={item.endTime}/>
              )}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center' }}>No tasks available</Text>
              }
            />
          </View>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
