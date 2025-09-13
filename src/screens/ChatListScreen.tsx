import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setActiveContact, loadChatHistory } from '../store/chatSlice';
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

interface ChatListScreenProps {
  navigation: any;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { contacts, chatHistories } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedContacts = await storage.getChatContacts();
      const storedHistory = await storage.getChatHistory();
      
      if (storedContacts.length > 0 || storedHistory.length > 0) {
        dispatch(loadChatHistory({
          contacts: storedContacts.length > 0 ? storedContacts : contacts,
          chatHistories: storedHistory.length > 0 ? storedHistory : chatHistories,
        }));
      }
    } catch (error) {
      console.error('Chat verileri yüklenirken hata:', error);
    }
  };

  const handleContactPress = (contactId: string) => {
    dispatch(setActiveContact(contactId));
    navigation.navigate('ChatDetail', { contactId });
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Bugün - saat göster
      return date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return 'Dün';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('tr-TR', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    }
  };

  const renderContactItem = (contact: any) => {
    const hasUnreadMessages = (contact.unreadCount || 0) > 0;
    
    return (
      <TouchableOpacity
        key={contact.id}
        style={styles.contactItem}
        onPress={() => handleContactPress(contact.id)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {contact.avatar || contact.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.contactInfo}>
          <View style={styles.contactHeader}>
            <Text style={[styles.contactName, hasUnreadMessages && styles.unreadName]}>
              {contact.name}
            </Text>
            <Text style={[styles.timeText, hasUnreadMessages && styles.unreadTime]}>
              {formatTime(contact.lastMessageTime)}
            </Text>
          </View>
          
          <View style={styles.messageRow}>
            <Text
              style={[styles.lastMessage, hasUnreadMessages && styles.unreadMessage]}
              numberOfLines={1}
            >
              {contact.lastMessage || 'Henüz mesaj yok'}
            </Text>
            
            {hasUnreadMessages && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sohbetler</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Text style={styles.newChatIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <ScrollView 
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatListContent}
      >
        {contacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>Henüz sohbet yok</Text>
            <Text style={styles.emptySubtitle}>
              Global GPT ile sohbet etmeye başlayın!
            </Text>
          </View>
        ) : (
          contacts.map(renderContactItem)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 80, // Tab bar için padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  headerTitle: {
    fontSize: wp(6),
    fontWeight: '700',
    color: colors.text,
  },
  newChatButton: {
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatIcon: {
    fontSize: wp(5),
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingTop: hp(1),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.secondary + '40',
  },
  avatarContainer: {
    marginRight: wp(3),
  },
  avatar: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: wp(6),
    fontWeight: '600',
    color: colors.accent,
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  contactName: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  unreadName: {
    color: colors.text,
    fontWeight: '700',
  },
  timeText: {
    fontSize: wp(3.2),
    color: colors.textSecondary,
  },
  unreadTime: {
    color: colors.accent,
    fontWeight: '600',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: wp(3.8),
    color: colors.textSecondary,
    flex: 1,
    marginRight: wp(2),
  },
  unreadMessage: {
    color: colors.text,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: colors.accent,
    borderRadius: wp(2.5),
    minWidth: wp(5),
    height: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(1.5),
  },
  unreadCount: {
    fontSize: wp(3),
    fontWeight: '700',
    color: colors.white,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(15),
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
});

export default ChatListScreen;
