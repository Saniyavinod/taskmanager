import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';
import HeadingCard from '@/components/HeadingCard';
import moment from 'moment';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { styles } from './styles/HomeScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskCard from '@/components/TaskCard';
import Modal from '@/components/Modal';
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
  date: Date;
  startTime: Date;
  endTime: Date;
  status: string;
};

type indiTask = {
  id: string
  taskname: string;
  description: string;
  startTime: Date
  endTime: Date
  date: Date
}

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
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [refetch, setRefetch] = useState(false); // Add refetch state
  const [indiTask, setIndiTask] = useState<indiTask | null>(null)

  const loadTasks = async () => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    if (storedTasks) {
      const list = await JSON.parse(storedTasks)
      setTasksList(list);
      console.log(storedTasks);
      const rest = list.length > 0
        ? {
          open: list.filter((task: { status: string }) => task.status === 'Open').length,
          closed: list.filter((task: { status: string }) => task.status === 'Close').length,
        }

        : { open: 0, closed: 0 };

      console.log("Open", rest.open)
      console.log("Close", rest.closed)

      if (rest.open && rest.closed) {
        setNotifications({ all: list.length, open: rest.open, closed: rest.closed })
      }
    }
  };

  useEffect(() => {
    loadTasks();
  }, [refetch]); // Add refetch as a dependency

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

  const handleButtonPress = async (button: string) => {
    setPressedButton(button);
    const statusText = button
    console.log(statusText)
    if (statusText == "All") {
      setRefetch((prev) => !prev)
    }

    const storageData = await AsyncStorage.getItem('tasks')
    if (storageData) {
      const taskList = await JSON.parse(storageData)
      const updatedList = taskList.filter((item: { status: string }) => item.status === statusText)
      setTasksList(updatedList)
    }
  };


  if (!fontsLoaded || !appIsReady) {
    return null;
  }


  return (
    <>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar hidden={false} />
        <HeadingCard heading={heading} description={description} loading={loading} />
        <View style={styles.content}>
          <View style={styles.taskRow}>
            <View>
              <Text style={[styles.taskTitle, { fontFamily: 'Poppins_400Regular' }]}>Today's Task</Text>
              <Text style={[styles.date, { fontFamily: 'Poppins_400Regular' }]}>{moment(Date.now()).format('dddd, DD MMM')}</Text>
            </View>
            <TouchableOpacity
              style={styles.newTaskButton}
              onPress={() => setBottomSheetVisible(true)}
              activeOpacity={0.7}
            >
              <Entypo name="plus" size={18} color="blue" />
              <Text style={[styles.newTaskText, { fontFamily: 'Poppins_400Regular' }]}>New Task</Text>
            </TouchableOpacity>
          </View>



          <View style={styles.notificationsContainer}>
            {buttonOptions.map((item, index) => (
              <TouchableOpacity key={index}
                style={styles.notificationItem}
                activeOpacity={0.7}
                onPress={() => handleButtonPress(item.buttonText)}
              >
                <Text style={[styles.notificationText, { color: pressedButton === item.buttonText ? 'blue' : 'black' }]}>{item.buttonText}</Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>{item.buttonText === "All"
                    ? notifications.all
                    : item.buttonText === "Open"
                      ? notifications.open
                      : item.buttonText === "Close"
                        ? notifications.closed
                        : 0}</Text>
                </View>
              </TouchableOpacity>
            ))}

          </View>

          <FlatList
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingBottom: 100 }}
            data={tasksList}
            renderItem={({ item }) => (
              <TaskCard setIndiTask={setIndiTask} setBottomSheetVisible={setBottomSheetVisible} id={item.id} taskname={item.title} description={item.sTitle} taskId={item.id} setRefetch={setRefetch} date={item.date} startTime={item.startTime} endTime={item.endTime} />
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center' }}>No tasks available</Text>
            }
          />
        </View>
      </View>


      {bottomSheetVisible && (
        <Modal setIndiTask={setIndiTask} setRefetch={setRefetch} setBottomSheetVisible={setBottomSheetVisible} indiTask={indiTask} /> // Pass setRefetch to Modal
      )}
    </>
  );
}
