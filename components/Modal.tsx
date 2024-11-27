import React, { useRef, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { styles } from '../app/styles/HomeScreenStyles'
import { useRouter } from 'expo-router';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import uuid from 'react-native-uuid';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';




interface IndiTask {
  taskName: string;
}[]

type indiTask = {
  id:string;
  taskname: string;
  description: string;
  startTime: Date
  endTime: Date
  date: Date
}

export default function Modal({ setRefetch, setBottomSheetVisible, indiTask,setIndiTask }: {
  setRefetch: Dispatch<SetStateAction<boolean>>
  setBottomSheetVisible: Dispatch<SetStateAction<boolean>>
  indiTask: indiTask | null
  setIndiTask:Dispatch<SetStateAction<indiTask | null>>
}) {
  const [title, onChangeTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [sTitleError, setsTitleError] = useState('');
  const [sTitle, onChangeSTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [openStartTimePicker, setOpenStartTimePicker] = useState(false);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [openEndTimePicker, setOpenEndTimePicker] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const router = useRouter();
  const { taskname, description } = useLocalSearchParams();
  const [idOfTask,setIdOfTask] = useState("")

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (idOfTask) {
        const storedTasks = await AsyncStorage.getItem('tasks');
        const tasksList = storedTasks ? JSON.parse(storedTasks) : [];
        const existingTask = tasksList.find((item: { id: string }) => item.id === idOfTask);

        if (existingTask) {
          onChangeTitle(existingTask.title);
          onChangeSTitle(existingTask.sTitle);
          setDate(existingTask.date ? new Date(existingTask.date) : null);
          console.log(existingTask)
          setStartTime(existingTask.startTime ? new Date(existingTask.startTime) : null);
          setEndTime(existingTask.endTime ? new Date(existingTask.endTime) : null);
        }
      }
    };

    fetchTaskDetails();
  }, [idOfTask]);

  const handleTaskSubmission = async () => {
    if (!title || !sTitle) {
      Alert.alert("All fields are required");
      return;
    }

    const newTask = {
      id: idOfTask || uuid.v4(),
      title,
      sTitle,
      date,
      startTime,
      endTime,
      status:"Open"
    };

    const storedTasks = await AsyncStorage.getItem('tasks');
    const tasksList = storedTasks ? JSON.parse(storedTasks) : [];

    if (idOfTask) {
      // Edit existing task
      const itemIndex = tasksList.findIndex((item: { id: string }) => item.id === idOfTask);
      if (itemIndex !== -1) {
        tasksList[itemIndex] = newTask;
      } else {
        console.log("Item not found");
        return;
      }
    } else {
      // Add new task
      tasksList.unshift(newTask);
    }

    await AsyncStorage.setItem('tasks', JSON.stringify(tasksList));
    router.replace({
      pathname: "/HomeScreen",
      params: { taskUpdated: "true" },
    });

    // Reset form fields
    onChangeTitle('');
    onChangeSTitle('');
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    setIndiTask(null)
  };

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };


  useEffect(() => {
    const getIndiTaskData = async () => {
      const indiTask = await AsyncStorage.getItem('indiTask')
      if (indiTask) {
        const data = await JSON.parse(indiTask)
      }
    }
    getIndiTaskData()
    handlePresentModalPress();
    if (indiTask) {
      onChangeTitle(indiTask.taskname)
      onChangeSTitle(indiTask.description)
      setDate(indiTask.date?new Date(indiTask.date):null)
      setStartTime(indiTask.startTime?new Date(indiTask.startTime):null)
      setEndTime(indiTask.endTime?new Date(indiTask.endTime):null)
      setIdOfTask(indiTask.id)
    }

  }, []);

  return (

    <BottomSheetModalProvider>
      <CustomBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={handlePresentModalPress}
        setBottomSheetVisible={setBottomSheetVisible}
        setIndiTask={setIndiTask}
      >
        <Text>{taskname ? "Edit Task" : "Add New Task"}</Text>
        <View style={styles.form}>
          <Text>Title</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeTitle}
            value={title}
            placeholder="Enter task title"
          />
          {titleError.length > 0 ? <Text style={{ color: "red" }}>{titleError}</Text> : null}
          <Text>Description</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeSTitle}
            value={sTitle}
            placeholder="Enter task description"
          />
          {sTitleError.length > 0 ? <Text style={{ color: "red" }}>{sTitleError}</Text> : null}

          <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
            <Text>Date</Text>
            <TextInput
              style={styles.input}
              value={moment(date).format('LL') || moment().format("MMM Do YY")}
              placeholder="Select Date"
              editable={false}
            />
          </TouchableOpacity>
          {openDatePicker && (
            <RNDateTimePicker
              mode="date"
              value={date || new Date()}
              onChange={(event, selectedDate) => {
                if (event.type === "set" && selectedDate) { // Check if user confirmed the selection
                  setDate(selectedDate); // Update state with the selected date
                }
                setOpenDatePicker(false);
              }}
            />
          )}

          <TouchableOpacity onPress={() => setOpenStartTimePicker(true)}>
            <Text>Start Time</Text>
            <TextInput
              style={styles.input}
              value={moment(startTime).format('LT') || moment().format('LT')}
              placeholder="Select Start Time"
              editable={false}
            />
          </TouchableOpacity>
          {openStartTimePicker && (
            <RNDateTimePicker
              mode="time"
              value={startTime || new Date()}
              onChange={(event, selectedTime) => {
                if (event.type === "set" && selectedTime) { // Check if user confirmed the selection
                  setStartTime(selectedTime);
                  console.log(event.type) // Update state with the selected date
                }
                setOpenStartTimePicker(false);
                
              }}
            />
          )}

          <TouchableOpacity onPress={() => setOpenEndTimePicker(true)}>
            <Text>End Time</Text>
            <TextInput
              style={styles.input}
              value={moment(endTime).format('LT') || ''}
              placeholder="Select End Time"
              editable={false}
            />
          </TouchableOpacity>
          {openEndTimePicker && (
            <RNDateTimePicker
              mode="time"
              value={endTime || new Date()}
              onChange={(event, selectedTime) => {
                if (event.type === "set" && selectedTime) { // Check if user confirmed the selection
                  setEndTime(selectedTime); // Update state with the selected date
                  console.log(event.type)
                }
                setOpenEndTimePicker(false);
              }}
            />
          )}

          <Button
            onPress={handleTaskSubmission}
            title="Submit"
          />
        </View>
      </CustomBottomSheet>
    </BottomSheetModalProvider>
  );
};


