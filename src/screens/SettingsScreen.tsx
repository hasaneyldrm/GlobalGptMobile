import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

const SettingItem = ({ title, onPress, showArrow = true, disabled = false, isDangerous = false }: { 
  title: string; 
  onPress: () => void; 
  showArrow?: boolean; 
  disabled?: boolean;
  isDangerous?: boolean;
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.menuItem, 
        { 
          backgroundColor: colors.surface, 
          borderBottomColor: colors.secondary,
          opacity: disabled ? 0.5 : 1 
        }
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.menuItemText, 
        { 
          color: isDangerous ? '#FF3B30' : colors.text 
        }
      ]}>
        {title}
      </Text>
      {showArrow && (
        <View style={styles.menuItemRight}>
          <Text style={[styles.arrowText, { color: colors.textSecondary }]}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
  );
};

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [tapCount, setTapCount] = useState(0);
  const [isDeveloperModeEnabled, setIsDeveloperModeEnabled] = useState(false);

  // Developer mode'u yükle
  useEffect(() => {
    const loadDeveloperMode = async () => {
      try {
        const isEnabled = await storage.getTheme(); // Geçici olarak theme storage kullanıyoruz
        setIsDeveloperModeEnabled(isEnabled === 'developer');
      } catch (error) {
        console.error('Developer mode yüklenirken hata:', error);
      }
    };
    loadDeveloperMode();
  }, []);
  
  // URL bağlantıları
  const privacyPolicyUrl = 'https://your-privacy-policy-url.com';
  const termsOfUseUrl = 'https://your-terms-of-use-url.com';
  
  // URL'yi açmak için fonksiyon
  const openURL = useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`URL açılamıyor: ${url}`);
    }
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              // Chat verilerini temizle
              await storage.clearChatData();
              
              Alert.alert('Başarılı', 'Çıkış yapıldı');
              
              // Ana ekrana geri git
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'First' }],
              });
            } catch (error) {
              console.error('Çıkış yapılırken hata:', error);
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
            }
          },
        },
      ],
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Hesabı Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              // Tüm verileri temizle
              await storage.clearAll();
              
              Alert.alert('Başarılı', 'Hesabınız silindi');
              
              // Onboarding'e geri git
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'First' }],
              });
            } catch (error) {
              console.error('Hesap silinirken hata:', error);
              Alert.alert('Hata', 'Hesap silinirken bir hata oluştu');
            }
          }
        },
      ]
    );
  };

  // Görünmez buton için tap handler
  const handleInvisibleButtonPress = async () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (newTapCount >= 3) {
      try {
        const newDeveloperMode = !isDeveloperModeEnabled;
        await storage.setTheme(newDeveloperMode ? 'developer' : 'normal');
        setIsDeveloperModeEnabled(newDeveloperMode);
        setTapCount(0);
        
        Alert.alert(
          'Geliştirici Modu',
          newDeveloperMode 
            ? 'Geliştirici modu etkinleştirildi' 
            : 'Geliştirici modu devre dışı bırakıldı'
        );
      } catch (error) {
        console.error('Developer mode ayarlanırken hata:', error);
      }
    } else {
      // 2 saniye sonra tap count'u sıfırla
      setTimeout(() => {
        setTapCount(0);
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header with Back Button */}
      <View style={[styles.header, { 
        backgroundColor: colors.surface, 
        borderBottomColor: colors.secondary 
      }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={[styles.backIcon, { color: colors.accent }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Ayarlar</Text>
        
        {/* Görünmez buton - sağ üst köşe */}
        <TouchableOpacity 
          onPress={handleInvisibleButtonPress}
          style={styles.invisibleButton}
        />
      </View>

      <ScrollView 
        style={[styles.content, { backgroundColor: colors.background }]} 
        contentContainerStyle={{
          paddingBottom: hp(15) // Tab bar + extra space
        }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Developer Resources - sadece developer mode açıkken görünür */}
        {isDeveloperModeEnabled && (
          <View style={[styles.section, { backgroundColor: colors.background, marginTop: hp(4) }]}>
            <View style={styles.sectionHeader}>
              <SectionTitle title="Geliştirici" />
            </View>
            <SettingItem 
              title="Geliştirici Kaynakları" 
              onPress={() => Alert.alert('Geliştirici', 'Bu özellik yakında gelecek')} 
            />
          </View>
        )}
        
        {/* Legal Section */}
        <View style={[styles.section, { backgroundColor: colors.background, marginTop: hp(4) }]}>
          <View style={styles.sectionHeader}>
            <SectionTitle title="Yasal" />
          </View>
          <SettingItem 
            title="Gizlilik Politikası" 
            onPress={() => openURL(privacyPolicyUrl)} 
          />
          <SettingItem 
            title="Kullanım Şartları" 
            onPress={() => openURL(termsOfUseUrl)} 
          />
        </View>
        
        {/* Account Actions Section */}
        <View style={[styles.section, { backgroundColor: colors.background, marginTop: hp(5) }]}>
          <SettingItem
            title="Çıkış Yap"
            onPress={handleLogout}
            showArrow={false}
            isDangerous={false}
          />
          <SettingItem
            title="Hesabı Sil"
            onPress={handleDeleteAccount}
            showArrow={false}
            isDangerous={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
  },
  backButton: {
    padding: wp(2),
  },
  backIcon: {
    fontSize: wp(6),
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    marginLeft: wp(3),
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: wp(5),
    marginBottom: hp(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: wp(5),
    fontWeight: '600',
    marginRight: wp(2),
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderRadius: wp(2),
    marginBottom: hp(1),
  },
  menuItemText: {
    fontSize: wp(4),
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: wp(6),
    fontWeight: '300',
  },
  invisibleButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: wp(15),
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default SettingsScreen;
