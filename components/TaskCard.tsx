import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';



const TaskCard= ({ taskname,description }: { taskname: string; description: string }) => {
  
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  return (
    
    <View style={styles.cardContainer}>
      {/* Use the passed heading prop */}
      <View style={styles.content}>
        <View style={{width:"70%"}}>
        <Text style={[styles.headingText, { fontFamily: 'Poppins_400Regular' }]}>{taskname}</Text>
      <Text style={[styles.descriptionText, { fontFamily: 'Poppins_400Regular' }]}>{description}</Text>
      </View>
      <View style={styles.content21}>
      <AntDesign name="checkcircle" size={24} color="black" />
      </View>
      </View>
      <View style={[styles.content2]}>
        <Text style={{ fontFamily: 'Poppins_400Regular' }}>Today  10:00 PM-11:45PM</Text>
      </View>
      
      {/* Use the passed description prop */}
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
     fontFamily: 'Poppins_400Regular',
    paddingHorizontal:20,
    paddingTop:10,
    borderRadius: 10,
    marginBottom: 15, 
    width: '100%',  // Adjust width as a percentage of screen width
    alignSelf: 'center',  // Centers the card horizontally
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,  // For Android shadow
    display:"flex",
    minHeight:120,
    justifyContent:"space-between"
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
  content:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    borderBottomWidth:.5,
    minHeight:60,
    alignItems:"center"
  },
  content2:{
    flex:1,
    justifyContent:"space-evenly",
  },
  content21:{
    alignItems:"center",
  }
});

export default TaskCard;