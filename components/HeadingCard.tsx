import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Dimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance
} from "react-native-reanimated-carousel";
 
const data = [...new Array(6).keys()];
const width = Dimensions.get("window").width;
 
function App() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };


}

const HeadingCard = ({ heading, description,loading }: { heading: string; description: string; loading:boolean }) => {
  if(loading){
    return (
      <Text style={styles.headingText}>Loading Data...</Text>
    )
  }else{
    return (
      <>
      
      
      <View style={styles.cardContainer}>
        
        <Text style={styles.headingText}>{heading}</Text>
        
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
      
      </>
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
