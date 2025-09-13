import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatContact, ChatHistory } from '../store/chatSlice';

class StorageService {
  private THEME_KEY = '@GlobalGpt_theme';
  private ONBOARDING_KEY = '@GlobalGpt_onboarding_completed';
  private CHAT_CONTACTS_KEY = '@GlobalGpt_chat_contacts';
  private CHAT_HISTORY_KEY = '@GlobalGpt_chat_history';
  private USER_UUID_KEY = '@GlobalGpt_user_uuid';
  private USER_NAME_KEY = '@GlobalGpt_user_name';

  // Theme Storage
  async getTheme(): Promise<string | null> {
    try {
      const theme = await AsyncStorage.getItem(this.THEME_KEY);
      return theme;
    } catch (error) {
      console.error('Tema yüklenirken hata:', error);
      return null;
    }
  }

  async setTheme(theme: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.THEME_KEY, theme);
    } catch (error) {
      console.error('Tema kaydedilirken hata:', error);
      throw error;
    }
  }

  async removeTheme(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.THEME_KEY);
    } catch (error) {
      console.error('Tema silinirken hata:', error);
      throw error;
    }
  }

  // Onboarding Storage
  async getOnboardingCompleted(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(this.ONBOARDING_KEY);
      return completed === 'true';
    } catch (error) {
      console.error('Onboarding durumu yüklenirken hata:', error);
      return false;
    }
  }

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(this.ONBOARDING_KEY, completed.toString());
    } catch (error) {
      console.error('Onboarding durumu kaydedilirken hata:', error);
      throw error;
    }
  }

  async removeOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.ONBOARDING_KEY);
    } catch (error) {
      console.error('Onboarding durumu silinirken hata:', error);
      throw error;
    }
  }

  // Chat Contacts Storage
  async getChatContacts(): Promise<ChatContact[]> {
    try {
      const contacts = await AsyncStorage.getItem(this.CHAT_CONTACTS_KEY);
      return contacts ? JSON.parse(contacts) : [];
    } catch (error) {
      console.error('Chat kişileri yüklenirken hata:', error);
      return [];
    }
  }

  async setChatContacts(contacts: ChatContact[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CHAT_CONTACTS_KEY, JSON.stringify(contacts));
    } catch (error) {
      console.error('Chat kişileri kaydedilirken hata:', error);
      throw error;
    }
  }

  // Chat History Storage
  async getChatHistory(): Promise<ChatHistory[]> {
    try {
      const history = await AsyncStorage.getItem(this.CHAT_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Chat geçmişi yüklenirken hata:', error);
      return [];
    }
  }

  async setChatHistory(history: ChatHistory[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CHAT_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Chat geçmişi kaydedilirken hata:', error);
      throw error;
    }
  }

  async clearChatData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.CHAT_CONTACTS_KEY, this.CHAT_HISTORY_KEY]);
    } catch (error) {
      console.error('Chat verileri silinirken hata:', error);
      throw error;
    }
  }

  // User UUID Storage
  async getUserUUID(): Promise<string | null> {
    try {
      const uuid = await AsyncStorage.getItem(this.USER_UUID_KEY);
      return uuid;
    } catch (error) {
      console.error('Kullanıcı UUID yüklenirken hata:', error);
      return null;
    }
  }

  async setUserUUID(uuid: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_UUID_KEY, uuid);
    } catch (error) {
      console.error('Kullanıcı UUID kaydedilirken hata:', error);
      throw error;
    }
  }

  // User Name Storage
  async getUserName(): Promise<string | null> {
    try {
      const name = await AsyncStorage.getItem(this.USER_NAME_KEY);
      return name;
    } catch (error) {
      console.error('Kullanıcı adı yüklenirken hata:', error);
      return null;
    }
  }

  async setUserName(name: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_NAME_KEY, name);
    } catch (error) {
      console.error('Kullanıcı adı kaydedilirken hata:', error);
      throw error;
    }
  }

  // Genel storage temizleme
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage temizlenirken hata:', error);
      throw error;
    }
  }
}

export const storage = new StorageService();
