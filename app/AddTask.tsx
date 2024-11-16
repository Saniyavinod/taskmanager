import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { styles } from './styles/HomeScreenStyles';
import { useRouter } from 'expo-router';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type Task = {
  title: string;
  sTitle: string;
};

const AddTask = () => {
  const [title, onChangeTitle] = useState('');
  const [sTitle, onChangeSTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const router = useRouter();

  // Open the bottom sheet when the component loads
  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleFormSubmit = async () => {
    const newTask = {
      title,
      sTitle,
    };

    setTasks((prev) => [...prev, newTask]);
    onChangeTitle('');
    onChangeSTitle('');
    router.push({
      pathname: "/HomeScreen",
      params: { newTask: JSON.stringify(newTask) },
    });
    
  };

  return (
    <GestureHandlerRootView>
    <BottomSheetModalProvider>
      <CustomBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={(index) => console.log('Sheet state:', index)}
      >
        <Text>Add New Task</Text>
        <View style={styles.form}>
          <Text >Title</Text>
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
