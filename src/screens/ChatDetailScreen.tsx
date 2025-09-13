import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addMessage } from '../store/chatSlice';
import { colors } from '../theme/colors';
import { storage } from '../services/storage';

const { width, height } = Dimensions.get('window');

// Responsive helper functions
const wp = (percentage: number) => {
  return width * (percentage / 100);
};

const hp = (percentage: number) => {
  return height * (percentage / 100);
};

interface ChatDetailScreenProps {
  navigation: any;
  route: any;
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const { contactId } = route.params;
  
  const { contacts, chatHistories, activeContactId } = useSelector((state: RootState) => state.chat);
  
  const [inputText, setInputText] = useState('');
  
  // Aktif contact ve mesajları bul
  const activeContact = contacts.find(c => c.id === contactId);
  const chatHistory = chatHistories.find(ch => ch.contactId === contactId);
  const messages = chatHistory?.messages || [];

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    // Save chat data when messages change
    if (messages.length > 0) {
      saveChatData();
    }
  }, [messages, contacts]);

  const saveChatData = async () => {
    try {
      await storage.setChatContacts(contacts);
      await storage.setChatHistory(chatHistories);
    } catch (error) {
      console.error('Chat verileri kaydedilirken hata:', error);
    }
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage({
      contactId,
      message: userMessage,
    }));

    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        'Bu harika bir soru! Size yardımcı olmaya çalışayım.',
        'Daha spesifik bilgi verebilir misiniz?',
        'Tabii ki! Bu konuda size yardımcı olabilirim.',
        'İlginç bir konu. Detayına inelim.',
        'Başka sorularınız var mı?',
        'Bu konuda daha fazla bilgi istiyorsanız, detaylandırabilirim.',
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      dispatch(addMessage({
        contactId,
        message: aiMessage,
      }));
    }, 1000 + Math.random() * 2000); // 1-3 saniye arası rastgele gecikme
  };

  const renderMessage = (message: any) => {
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            message.isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              message.isUser ? styles.userText : styles.aiText,
            ]}
          >
            {message.text}
          </Text>
          <Text
            style={[
              styles.timestamp,
              message.isUser ? styles.userTimestamp : styles.aiTimestamp,
            ]}
          >
            {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (!activeContact) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Kişi bulunamadı</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>
              {activeContact.avatar || activeContact.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{activeContact.name}</Text>
            <Text style={styles.headerSubtitle}>Çevrimiçi</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>Henüz mesaj yok</Text>
            <Text style={styles.emptySubtitle}>
              {activeContact.name} ile sohbet etmeye başlayın!
            </Text>
          </View>
        ) : (
          messages.map(renderMessage)
        )}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Mesajınızı yazın..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? colors.accent : colors.secondary }
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  backIcon: {
    fontSize: wp(6),
    color: colors.accent,
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiAvatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  aiAvatarText: {
    fontSize: wp(5),
    fontWeight: '600',
    color: colors.accent,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: wp(3.5),
    color: colors.accent,
    marginTop: hp(0.2),
  },
  moreButton: {
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    fontSize: wp(5),
    color: colors.textSecondary,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContent: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: hp(0.5),
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: wp(80),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  messageText: {
    fontSize: wp(4),
    lineHeight: wp(5.5),
  },
  userText: {
    color: colors.white,
  },
  aiText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: wp(3),
    marginTop: hp(0.5),
  },
  userTimestamp: {
    color: colors.white + '80',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: colors.textSecondary,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    gap: wp(2),
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 25,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    fontSize: wp(4),
    color: colors.text,
    maxHeight: hp(12),
  },
  sendButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: wp(5),
    color: colors.white,
    transform: [{ rotate: '0deg' }],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(10),
  },
  emptyIcon: {
    fontSize: wp(20),
    marginBottom: hp(2),
  },
  emptyTitle: {
    fontSize: wp(5),
    fontWeight: '600',
    color: colors.text,
    marginBottom: hp(1),
  },
  emptySubtitle: {
    fontSize: wp(4),
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: wp(8),
    lineHeight: wp(5.5),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: wp(5),
    color: colors.text,
    marginBottom: hp(2),
  },
  backButtonText: {
    fontSize: wp(4),
    color: colors.accent,
    fontWeight: '600',
  },
});

export default ChatDetailScreen;
