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
import SettingsScreen from './src/screens/SettingsScreen';
import DeveloperResourcesScreen from './src/screens/DeveloperResourcesScreen';
import TabNavigator from './src/navigation/TabNavigator';
import { ThemeProvider } from './src/services/ThemeContext';
import { colors } from './src/theme/colors';
import { storage } from './src/services/storage';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { loadChatHistory } from './src/store/chatSlice';
import { setUserCredit } from './src/store/creditSlice';
import { userService } from './src/api/userService';

const Stack = createNativeStackNavigator();

function App() {
  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Onboarding durumunu kontrol et
        const isOnboardingCompleted = await storage.getOnboardingCompleted();
        
        // Chat verilerini ve krediyi yükle
        const [contacts, chatHistories, userCredit] = await Promise.all([
          storage.getChatContacts(),
          storage.getChatHistory(),
          storage.getUserCredit()
        ]);
        
        // Redux store'a chat verilerini yükle
        store.dispatch(loadChatHistory({ contacts, chatHistories }));
        
        // Redux store'a krediyi yükle
        store.dispatch(setUserCredit(userCredit));
        console.log('Async storage\'dan kredi yüklendi:', userCredit);

        // Kullanıcı bilgilerini API'den senkronize et (sadece onboarding tamamlanmışsa)
        if (isOnboardingCompleted) {
          try {
            const userUUID = await storage.getUserUUID();
            if (userUUID) {
              console.log('Uygulama açılışında kullanıcı bilgileri senkronize ediliyor...');
              const response = await userService.getUserInfo(userUUID);
              
              if (response.success && response.data) {
                const { name, coin } = response.data;
                
                // AsyncStorage'ı güncelle
                await storage.setUserName(name);
                await storage.setUserCredit(coin);
                
                // Redux'ı güncelle
                store.dispatch(setUserCredit(coin));
                
                console.log(`Uygulama açılışında senkronize edildi - İsim: ${name}, Coin: ${coin}`);
              } else {
                console.warn('Kullanıcı bilgileri senkronize edilemedi:', response.message);
              }
            }
          } catch (syncError) {
            console.error('Senkronizasyon hatası:', syncError);
            // Senkronizasyon hatası olsa bile uygulamaya devam et
          }
        }
        
        if (isOnboardingCompleted) {
          // Onboarding tamamlandıysa direkt TabNavigator'a git
          setInitialRouteName('MainTabs');
        } else {
          // Onboarding tamamlanmadıysa onboarding'den başla
          setInitialRouteName('First');
        }
      } catch (error) {
        console.error('Uygulama başlatılırken hata:', error);
        // Hata durumunda onboarding'den başla
        setInitialRouteName('First');
      }
    };

    initializeApp();
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
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="DeveloperResources" component={DeveloperResourcesScreen} />
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
