import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Dumbbell, TrendingUp, BarChart2, Flame } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Track Your Workouts',
    subtitle: 'Log every set and rep with ease.',
    icon: <Dumbbell color="black" size={80} strokeWidth={2.5} />,
  },
  {
    id: '2',
    title: 'See Your Progress',
    subtitle: 'Visualize your journey and smash your goals.',
    icon: <TrendingUp color="black" size={80} strokeWidth={2.5} />,
  },
  {
    id: '3',
    title: 'Compete & Climb',
    subtitle: 'See how you stack up against others.',
    icon: <BarChart2 color="black" size={80} strokeWidth={2.5} />,
  },
  {
    id: '4',
    title: 'Build Your Streaks',
    subtitle: 'Stay consistent and watch your progress soar.',
    icon: <Flame color="black" size={80} strokeWidth={2.5} />,
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserTouching, setIsUserTouching] = useState(false);
  const flatListRef = useRef(null);

  // Auto-slide functionality
  useEffect(() => {
    if (currentScreen !== 'landing' || isUserTouching) return; // Only auto-slide on landing screen and when user is not touching

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % slides.length;

        // Scroll to next slide
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }

        return nextIndex;
      });
    }, 2000); // 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentScreen, isUserTouching]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <View style={styles.iconCircle}>
          {item.icon}
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  // If on login screen, render LoginScreen
  if (currentScreen === 'login') {
    return (
      <SafeAreaProvider>
        <LoginScreen
          onNavigateBack={() => setCurrentScreen('landing')}
          onNavigateToSignUp={() => setCurrentScreen('signup')}
        />
      </SafeAreaProvider>
    );
  }

  // If on signup screen, render SignUpScreen
  if (currentScreen === 'signup') {
    return (
      <SafeAreaProvider>
        <SignUpScreen
          onNavigateBack={() => setCurrentScreen('landing')}
          onNavigateToLogin={() => setCurrentScreen('login')}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>LOGGER</Text>
        </View>

        {/* Carousel */}
        <FlatList
          data={slides}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef.current}
          ref={flatListRef}
          style={styles.flatList}
          onTouchStart={() => setIsUserTouching(true)}
          onTouchEnd={() => setIsUserTouching(false)}
          onScrollBeginDrag={() => setIsUserTouching(true)}
          onScrollEndDrag={() => setIsUserTouching(false)}
        />

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signUpButton} onPress={() => setCurrentScreen('signup')}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={() => setCurrentScreen('login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000',
    fontFamily: 'System',
  },
  flatList: {
    flexGrow: 0,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  iconCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    backgroundColor: '#000',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
    marginTop: 'auto', // Push to bottom if space allows
  },
  signUpButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
