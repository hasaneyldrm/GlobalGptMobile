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
import { colors } from './src/theme/colors';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'first' | 'name'>('first');

  const handleNavigateToName = () => {
    setCurrentScreen('name');
  };

  const handleComplete = () => {
    // Burada ana uygulamaya yönlendirme yapılabilir
    console.log('Onboarding completed!');
  };

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.background}
        translucent={false}
      />
      {currentScreen === 'first' ? (
        <FirstScreen onNavigateToName={handleNavigateToName} />
      ) : (
        <NameScreen onComplete={handleComplete} />
      )}
    </SafeAreaProvider>
  );
}

export default App;
