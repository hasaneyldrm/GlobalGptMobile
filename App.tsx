/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { useState } from 'react';
import FirstScreen from './src/onboarding/FirstScreen';
import NameScreen from './src/onboarding/NameScreen';
import ThemeScreen from './src/screens/ThemeScreen';
import { ThemeProvider } from './src/services/ThemeContext';
import { colors } from './src/theme/colors';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'first' | 'name' | 'theme'>('first');

  const handleNavigateToName = () => {
    setCurrentScreen('name');
  };

  const handleComplete = () => {
    // Burada ana uygulamaya yönlendirme yapılabilir
    console.log('Onboarding completed!');
  };

  const handleNavigateToTheme = () => {
    setCurrentScreen('theme');
  };

  const handleBackFromTheme = () => {
    setCurrentScreen('first');
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={colors.background}
          translucent={false}
        />
        {currentScreen === 'first' ? (
          <FirstScreen onNavigateToName={handleNavigateToName} />
        ) : currentScreen === 'name' ? (
          <NameScreen onComplete={handleComplete} />
        ) : (
          <ThemeScreen onBack={handleBackFromTheme} />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
