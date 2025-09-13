/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstScreen from './src/onboarding/FirstScreen';
import NameScreen from './src/onboarding/NameScreen';
import ThemeScreen from './src/screens/ThemeScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import TabNavigator from './src/navigation/TabNavigator';
import { ThemeProvider } from './src/services/ThemeContext';
import { colors } from './src/theme/colors';
import { storage } from './src/services/storage';
import { Provider } from 'react-redux';
import { store } from './src/store';

const Stack = createNativeStackNavigator();

function App() {
  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const isOnboardingCompleted = await storage.getOnboardingCompleted();
        if (isOnboardingCompleted) {
          // Onboarding tamamlandıysa direkt TabNavigator'a git
          setInitialRouteName('MainTabs');
        } else {
          // Onboarding tamamlanmadıysa onboarding'den başla
          setInitialRouteName('First');
        }
      } catch (error) {
        console.error('Onboarding kontrolü sırasında hata:', error);
        // Hata durumunda onboarding'den başla
        setInitialRouteName('First');
      }
    };

    checkOnboardingStatus();
  }, []);

  // Initial route belirlenmeden hiçbir şey render etme
  if (initialRouteName === null) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar 
            barStyle="light-content" 
            backgroundColor={colors.background}
            translucent={false}
          />
          <NavigationContainer>
          <Stack.Navigator 
            initialRouteName={initialRouteName}
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right', // Native iOS slide animasyonu
            }}
          >
            <Stack.Screen name="First" component={FirstScreen} />
            <Stack.Screen name="Name" component={NameScreen} />
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="Paywall" component={PaywallScreen} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Theme" component={ThemeScreen} />
          </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
