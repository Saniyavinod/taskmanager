import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'; // Import shimmer

const HeadingCard = ({
  heading,
  description,
  loading,
}: {
  heading: string;
  description: string;
  loading: boolean;
}) => {
  const opacity = useSharedValue(0); // Shared value for opacity animation
  const translateX = useSharedValue(200); // Start off-screen to the right

  // Start animations whenever heading/description changes
  useEffect(() => {
    if (!loading) {
      opacity.value = 0; // Reset opacity when loading finishes
      translateX.value = 200; // Start position (off-screen to the right)
    
      opacity.value = withTiming(1, { duration: 400 }); // Fade in
      translateX.value = withTiming(0, { duration: 400 }); // Slide in from right to left
    }
  }, [heading, description, loading]);

  // Define animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }], // Slide in from right
    };
  });

  // Only show shimmer effect when loading
  if (loading) {
    return (
      <ShimmerPlaceholder
        style={styles.shimmer}
        shimmerColors={['#E0E0E0', '#F8F8F8', '#E0E0E0']}
      />
    );
  }

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <Text style={styles.headingText}>{heading}</Text>
      <Text style={styles.descriptionText}>{description}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 40,
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
  shimmer: {
    height: 120, // Adjust this based on the size of the card
    width: '100%',
    borderRadius: 8,
  },
});

export default HeadingCard;
