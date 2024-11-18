import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { styles } from './styles/HomeScreenStyles';
import { useRouter } from 'expo-router';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTask = () => {
  const [title, onChangeTitle] = useState('');
  const [sTitle, onChangeSTitle] = useState('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const router = useRouter();

  const handleFormSubmit = async () => {
    const newTask = { title, sTitle };

    const storedTasks = await AsyncStorage.getItem('tasks');
    const tasksList = storedTasks ? JSON.parse(storedTasks) : [];

    const updatedTasks = [newTask, ...tasksList];
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));

    router.replace({
      pathname: "/HomeScreen",
      params: { taskUpdated: "true" },
    });

    onChangeTitle('');
    onChangeSTitle('');
  };

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <CustomBottomSheet
          bottomSheetModalRef={bottomSheetModalRef}
        >
          <Text>Add New Task</Text>
          <View style={styles.form}>
            <Text>Title</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeTitle}
              value={title}
              placeholder="Enter task title"
            />
            <Text>Description</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeSTitle}
              value={sTitle}
              placeholder="Enter task description"
            />
            <Button onPress={handleFormSubmit} title="Submit" />
          </View>
        </CustomBottomSheet>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default AddTask;
