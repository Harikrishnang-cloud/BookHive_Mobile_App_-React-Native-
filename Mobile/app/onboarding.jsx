import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const TEAL = '#0f7f75';

const ONBOARDING_DATA = [
  {
    id: '1',
    image: require('../assets/images/logo_splash.png'),
    title: 'BookHive',
    subtitle: '',
    imageStyle: { width: width * 0.5, height: width * 0.5, resizeMode: 'contain' }
  },
  {
    id: '2',
    image: require('../assets/images/onboarding_reading.png'),
    title: 'BookHive',
    subtitle: 'Unlock the power of reading',
    imageStyle: { width: width * 0.8, height: width * 0.8, resizeMode: 'contain' }
  },
  {
    id: '3',
    image: require('../assets/images/onboarding_globe.png'),
    title: 'Find Your Next Great Read',
    subtitle: 'Unlock Your Potential with BookHive',
    imageStyle: { width: width * 0.9, height: width * 0.7, resizeMode: 'contain' }
  }
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const router = useRouter();

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== currentIndex) {
      setCurrentIndex(roundIndex);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={item.imageStyle} />
        </View>
        <View style={styles.textContainer}>
          {index === 0 && (
            <Text style={[styles.title, { color: TEAL, fontSize: 28 }]}>{item.title}</Text>
          )}
          
          {index === 1 && (
            <>
              <Text style={[styles.title, { color: TEAL, fontSize: 28 }]}>{item.title}</Text>
              <Text style={styles.subtitle}>
                Unlock the power of reading
              </Text>
            </>
          )}

          {index === 2 && (
            <>
              <Text style={[styles.title, { color: TEAL, fontSize: 26 }]}>{item.title}</Text>
              <Text style={styles.subtitle}>
                Unlock Your Potential with <Text style={{ color: TEAL, fontWeight: 'bold' }}>BookHive</Text>
              </Text>
              
              <Pressable 
                style={styles.button}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.buttonText}>Log In</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      />
      
      <View style={styles.paginationContainer}>
        {ONBOARDING_DATA.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentIndex === i ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    flex: 1,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleUppercase: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: TEAL,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: TEAL,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#e0e0e0',
  }
});
