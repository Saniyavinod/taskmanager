import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const HeadingCard = ({ heading, description,loading }: { heading: string; description: string; loading:boolean }) => {
  if(loading){
    return (
      <Text style={styles.headingText}>Loading Data...</Text>
    )
  }else{
    return (
      <View style={styles.cardContainer}>
        
        <Text style={styles.headingText}>{heading}</Text>
        
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    marginTop:40, 
    // width: '90%', 
    marginHorizontal: 0, 
    alignSelf: 'stretch', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,  
  },
  headingText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: 'black',
  },
});

export default HeadingCard;
