import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';
import moment from 'moment';

type indiTask = {
  id:string
  taskname:string;
  description:string;
  startTime:Date
  endTime:Date
  date:Date
}

const TaskCard = ({handleButtonPress,pressedButton,setNotifications,id,setIndiTask,setBottomSheetVisible,taskname, description, taskId, setRefetch, date, startTime, endTime }:{handleButtonPress: (button: string) => Promise<void>;pressedButton:string|null; setNotifications:Dispatch<SetStateAction<{ all: number; open: number; closed: number; }>>;id:string;setIndiTask:Dispatch<SetStateAction<indiTask | null>>;setBottomSheetVisible:Dispatch<SetStateAction<boolean>>; taskname: string; description: string, taskId: string, setRefetch: Dispatch<SetStateAction<boolean>>, date: Date, startTime: Date, endTime: Date }) => {
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
      status: any; id: string 
}) => {
      if (item.id === taskId) {
        console.log(item.status)
        item.status = item.status === "Close" ? "Open" : "Close";
        const rest = tasksList.length
        ? {
          open: tasksList.filter((task:{status:string}) => task.status === 'Open').length,
          closed: tasksList.filter((task:{status:string}) => task.status === 'Close').length,
        }
        : { open: 0, closed: 0 };

        setNotifications({
          all: tasksList.length,
          open: rest.open,
          closed: rest.closed,
        });
        
      }
      return item;
    });
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    if(pressedButton){
      handleButtonPress(pressedButton)
    }
  };

  

  useEffect(() => {
    const checkCompleted = async () => {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasksList = storedTasks ? JSON.parse(storedTasks) : [];
      const currentTask = tasksList.find((item: { id: string }) => item.id === taskId);
      if (currentTask) {
        setCompleted(currentTask.status==="Close");
      }
    };
    checkCompleted();
  }, [taskId]);

  const handleEditTask = async(taskname: string, description: string, date: Date, startTime: Date, endTime: Date) =>{
    console.log("Here")
    setBottomSheetVisible(true)
    const indiTask = {
      id,
      taskname,
      description,
      startTime,
      endTime,
      date
    }
    setIndiTask(indiTask)
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.content}>
        <View style={{ width: "70%" }}>
          <Text style={[styles.headingText, { fontFamily: 'Poppins_400Regular', textDecorationLine: completed ? 'line-through' : 'none' }]}>{taskname}</Text>
          <Text style={[styles.descriptionText, { fontFamily: 'Poppins_400Regular' }]}>{description}</Text>
        </View>
        <TouchableOpacity style={[styles.content21]} onPress={handleCompletion}>
          <AntDesign name={completed ? "checkcircle" : "checkcircleo"} size={24} color={completed ? "blue" : "black"} />
        </TouchableOpacity>
      </View>
      <View style={[styles.content2]}>
        <Text style={{ fontFamily: 'Poppins_400Regular' }}>{moment(date).format("DD") === moment(Date.now()).format("DD") ? "Today" : moment(date).format("Do")}  {moment(startTime).format('LT')}-{moment(endTime).format('LT')}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Entypo name="edit" size={24} color="black" onPress={()=>handleEditTask(taskname,description,date,startTime,endTime)} />
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
