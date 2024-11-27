import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import HeadingCard from '@/components/HeadingCard';
import moment from 'moment';
import { styles } from './styles/HomeScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskCard from '@/components/TaskCard';
import Modal from '@/components/Modal';  // Import Modal component
import { buttonOptions } from './data';

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
  id: string;
  taskname: string;
  description: string;
  startTime: Date;
  endTime: Date;
  date: Date;
};



export default function HomeScreen() {
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [headings, setHeadings] = useState<
    { heading: string; description: string; id: string }[]
  >([]);
  const [headingIndex, setHeadingIndex] = useState(0);
  const [notifications, setNotifications] = useState({
    all: 5,
    open: 3,
    closed: 2,
  });
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [tasksList, setTasksList] = useState<Task[]>([]);
 
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [indiTask, setIndiTask] = useState<indiTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [openNumber,setOpenNumber] = useState(0)

  const loadTasks = async () => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    if (storedTasks) {
      const list: Task[] = JSON.parse(storedTasks);
      setTasksList(list);
      const rest = list.length
        ? {
          open: list.filter((task) => task.status === 'Open').length,
          closed: list.filter((task) => task.status === 'Close').length,
        }
        : { open: 0, closed: 0 };

      setNotifications({
        all: list.length,
        open: rest.open,
        closed: rest.closed,
      });
    }
  };

  useEffect(() => {
    loadTasks();
  }, [refetch]);



  useEffect(() => {
    async function fetchHeadings() {
      setLoading(true);
      try {
        const response = await fetch(
          'https://67333b5d2a1b1a4ae112a811.mockapi.io/api/p/carddara'
        );
        const data = await response.json();
        setHeadings(data);
      } catch (error) {
        console.error('Error fetching headings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHeadings();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHeadingIndex((prevIndex) => {
        const nextIndex =
          prevIndex === headings.length - 1 ? 0 : prevIndex + 1;
        setHeading(headings[nextIndex]?.heading || '');
        setDescription(headings[nextIndex]?.description || '');
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [headings]);



  const handleButtonPress = async (button: string) => {
    setPressedButton(button);
    const storageData = await AsyncStorage.getItem('tasks');
    if (storageData) {
      const taskList: Task[] = JSON.parse(storageData);
      if (button === 'All') {
        setRefetch((prev) => !prev);
      } else {
        const updatedList = taskList.filter(
          (item) => item.status === button
        );
        setTasksList(updatedList);
      }
    }
  };

 

  return (
    <>
      <View style={styles.container}>
        <HeadingCard heading={heading} description={description} loading={false} />
        <View style={styles.content}>
          <View style={styles.taskRow}>
            <View>
              <Text
                style={[
                  styles.taskTitle,
                  { fontFamily: 'Poppins_400Regular' },
                ]}
              >
                Today's Task
              </Text>
              <Text
                style={[styles.date, { fontFamily: 'Poppins_400Regular' }]}
              >
                {moment(Date.now()).format('dddd, DD MMM')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.newTaskButton}
              onPress={() => setBottomSheetVisible(true)}
              activeOpacity={0.7}
            >
              <Entypo name="plus" size={18} color="blue" />
              <Text
                style={[styles.newTaskText, { fontFamily: 'Poppins_400Regular' }]}
              >
                New Task
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.notificationsContainer}>
            {buttonOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.notificationItem}
                activeOpacity={0.7}
                onPress={() => handleButtonPress(item.buttonText)}
              >
                <Text
                  style={[
                    styles.notificationText,
                    {
                      color:
                        pressedButton === item.buttonText
                          ? 'blue'
                          : 'black',
                    },
                  ]}
                >
                  {item.buttonText}
                </Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>
                    {item.buttonText === 'All'
                      ? notifications.all
                      : item.buttonText === 'Open'
                        ? notifications.open
                        : item.buttonText === 'Close'
                          ? notifications.closed
                          : 0}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <FlatList
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 100 }}
            data={tasksList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard
                setIndiTask={setIndiTask}
                setBottomSheetVisible={setBottomSheetVisible}
                id={item.id}
                taskname={item.title}
                description={item.sTitle}
                taskId={item.id}
                setRefetch={setRefetch}
                date={item.date}
                startTime={item.startTime}
                endTime={item.endTime}
                setNotifications={setNotifications}
                pressedButton={pressedButton}
                handleButtonPress={handleButtonPress}
              />
            )}
            ListEmptyComponent={
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  No tasks available for the selected status
                </Text>
              </View>
            }
          />
        </View>
        {bottomSheetVisible && <Modal
          setBottomSheetVisible={setBottomSheetVisible}
          indiTask={indiTask}
          setRefetch={setRefetch}
          setIndiTask={setIndiTask} // Ensure this is passed
        />}
      </View>
    </>
  );
}
