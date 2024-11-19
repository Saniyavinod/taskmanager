import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { styles } from './styles/HomeScreenStyles';
import { useRouter } from 'expo-router';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import uuid from 'react-native-uuid';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const AddTask = () => {
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
  const { taskname, description, idOfTask } = useLocalSearchParams();

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
  };

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  useEffect(() => {
    handlePresentModalPress();
  }, []);

  return (
    <GestureHandlerRootView style={styles.bottomSheetContainer}>
      <BottomSheetModalProvider>
        <CustomBottomSheet
          bottomSheetModalRef={bottomSheetModalRef}
          handleSheetChanges={handlePresentModalPress}
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
                value={date ? date.toDateString() : ''}
                placeholder="Select Date"
                editable={false}
              />
            </TouchableOpacity>
            {openDatePicker && (
              <RNDateTimePicker
                mode="date"
                value={date || new Date()}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                    setOpenDatePicker(false);
                  }
                }}
              />
            )}

            <TouchableOpacity onPress={() => setOpenStartTimePicker(true)}>
              <Text>Start Time</Text>
              <TextInput
                style={styles.input}
                value={startTime ? startTime.toLocaleTimeString() : ''}
                placeholder="Select Start Time"
                editable={false}
              />
            </TouchableOpacity>
            {openStartTimePicker && (
              <RNDateTimePicker
                mode="time"
                value={startTime || new Date()}
                onChange={(event, selectedTime) => {
                  if (selectedTime) {
                    setStartTime(selectedTime);
                    setOpenStartTimePicker(false);
                  }
                }}
              />
            )}

            <TouchableOpacity onPress={() => setOpenEndTimePicker(true)}>
              <Text>End Time</Text>
              <TextInput
                style={styles.input}
                value={endTime ? endTime.toLocaleTimeString() : ''}
                placeholder="Select End Time"
                editable={false}
              />
            </TouchableOpacity>
            {openEndTimePicker && (
              <RNDateTimePicker
                mode="time"
                value={endTime || new Date()}
                onChange={(event, selectedTime) => {
                  if (selectedTime) {
                    setEndTime(selectedTime);
                    setOpenEndTimePicker(false);
                  }
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
    </GestureHandlerRootView>
  );
};

export default AddTask;
