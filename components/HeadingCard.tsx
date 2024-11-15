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
        {/* Use the passed heading prop */}
        <Text style={styles.headingText}>{heading}</Text>
        {/* Use the passed description prop */}
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
    marginBottom: 15,  // Space between cards
    // width: '90%', 
    marginHorizontal: 0,  // Adjust width as a percentage of screen width
    alignSelf: 'stretch',  // Centers the card horizontally
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,  // For Android shadow
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
