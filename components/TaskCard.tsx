import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';
import moment from 'moment';

const TaskCard = ({ taskname, description, taskId, setRefetch, date, startTime, endTime }: { taskname: string; description: string, taskId: string, setRefetch: Dispatch<SetStateAction<boolean>>, date: Date, startTime: Date, endTime: Date }) => {
  const [completed, setCompleted] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });
  const router = useRouter();

  const handleDelete = async (deleteTaskId: string) => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    const tasksList = storedTasks ? JSON.parse(storedTasks) : [];
    const updatedTasks = tasksList.filter((item: { id: string }) => item.id !== deleteTaskId);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setRefetch((prev) => !prev);
  };

  const handleCompletion = async () => {
    setCompleted(!completed);
    const storedTasks = await AsyncStorage.getItem('tasks');
    const tasksList = storedTasks ? JSON.parse(storedTasks) : [];

    const updatedTasks = tasksList.map((item: {
      completed: any; id: string 
}) => {
      if (item.id === taskId) {
        item.completed = !item.completed;
      }
      return item;
    });
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  useEffect(() => {
    const checkCompleted = async () => {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasksList = storedTasks ? JSON.parse(storedTasks) : [];
      const currentTask = tasksList.find((item: { id: string }) => item.id === taskId);
      if (currentTask) {
        setCompleted(currentTask.completed);
      }
    };
    checkCompleted();
  }, [taskId]);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.content}>
        <View style={{ width: "70%" }}>
          <Text style={[styles.headingText, { fontFamily: 'Poppins_400Regular', textDecorationLine: completed ? 'line-through' : 'none' }]}>{taskname}</Text>
          <Text style={[styles.descriptionText, { fontFamily: 'Poppins_400Regular' }]}>{description}</Text>
        </View>
        <TouchableOpacity style={[styles.content21]} onPress={handleCompletion}>
          <AntDesign name={completed ? "checkcircle" : "checkcircleo"} size={24} color={completed ? "black" : "black"} />
        </TouchableOpacity>
      </View>
      <View style={[styles.content2]}>
        <Text style={{ fontFamily: 'Poppins_400Regular' }}>{moment(date).format("DD") === moment(Date.now()).format("DD") ? "Today" : moment(date).format("Do")}  {moment(startTime).format('LT')}-{moment(endTime).format('LT')}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Entypo name="edit" size={24} color="black" onPress={() => router.replace(`/AddTask?taskname=${taskname}&description=${description}&idOfTask=${taskId}`)} />
          <AntDesign name="delete" size={24} color="black" onPress={() => handleDelete(taskId)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    fontFamily: 'Poppins_400Regular',
    paddingHorizontal: 20,
    paddingTop: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    display: "flex",
    minHeight: 120,
    justifyContent: "space-between"
  },
  headingText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  descriptionText: {
    fontSize: 16,
    color: 'black',
  },
  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: .5,
    minHeight: 60,
    alignItems: "center"
  },
  content2: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  content21: {
    alignItems: "center",
  }
});

export default TaskCard;
