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
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstScreen from './src/onboarding/FirstScreen';
import NameScreen from './src/onboarding/NameScreen';
import ThemeScreen from './src/screens/ThemeScreen';
import { ThemeProvider } from './src/services/ThemeContext';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={colors.background}
          translucent={false}
        />
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="First"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right', // Native iOS slide animasyonu
            }}
          >
            <Stack.Screen name="First" component={FirstScreen} />
            <Stack.Screen name="Name" component={NameScreen} />
            <Stack.Screen name="Theme" component={ThemeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
