import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatListScreen from '../screens/ChatListScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';

export type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: {
    contactId: string;
  };
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

const ChatStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Tüm ekranlar için varsayılan animasyon
      }}
    >
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          animation: 'fade', // ChatList için fade animasyonu
        }}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{
          animation: 'slide_from_right', // ChatDetail için slide animasyonu
          animationDuration: 300, // Animasyon süresi
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatStackNavigator;
