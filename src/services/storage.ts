import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  private THEME_KEY = '@GlobalGpt_theme';
  private ONBOARDING_KEY = '@GlobalGpt_onboarding_completed';

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
