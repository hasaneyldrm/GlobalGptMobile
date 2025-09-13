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
      }}
    >
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatStackNavigator;
