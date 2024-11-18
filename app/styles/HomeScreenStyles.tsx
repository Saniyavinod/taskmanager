import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
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
      fontSize: 24, // Decreased from 24
      fontWeight: 'bold',
      marginBottom: 4,
    },
    date: {
      fontSize: 16, // Decreased from 18
      color: '#555',
    },
    newTaskButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#d3e4f1',
      padding: 10,
      borderRadius: 15,
    },
    newTaskText: {
      marginLeft: 10,
      color: 'blue',
      fontSize: 16, // Decreased from 18
    },
    newTaskContent: {
      marginTop: 20,
      fontSize: 18,
      color: '#333',
    },
    notificationsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 20,
      marginBottom: 20,
    },
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    notificationText: {
      fontSize: 16, // Optional: Decrease if needed
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
      width:"100%",
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