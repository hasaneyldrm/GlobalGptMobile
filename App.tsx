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
import FirstScreen from './src/onboarding/FirstScreen';
import { colors } from './src/theme/colors';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.background}
        translucent={false}
      />
      <FirstScreen />
    </SafeAreaProvider>
  );
}

export default App;
