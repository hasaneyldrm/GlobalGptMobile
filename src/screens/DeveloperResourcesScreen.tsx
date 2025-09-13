import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  RefreshControl,
  TextInput,
  Alert,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

// Responsive helper functions
const wp = (percentage: number) => {
  return width * (percentage / 100);
};

const hp = (percentage: number) => {
  return height * (percentage / 100);
};

// Back Icon SVG Component
const BackIcon = ({ size = 24, color = colors.text }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Arrow Right Icon SVG Component
const ArrowRightIcon = ({ size = 24, color = colors.text }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 6L15 12L9 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

interface StorageData {
  title: string;
  key: string;
  data: any;
  isEditable: boolean;
}

// JSON görüntüleyici bileşeni
const JSONViewer = ({ data, indentLevel = 0 }: { data: any; indentLevel?: number }) => {
  const indent = '  '.repeat(indentLevel);
  
  if (data === null) {
    return <Text style={[styles.jsonNull, { color: '#FF3B30' }]}>{indent}null</Text>;
  }
  
  if (typeof data === 'undefined') {
    return <Text style={[styles.jsonUndefined, { color: '#FF3B30' }]}>{indent}undefined</Text>;
  }
  
  if (typeof data === 'string') {
    return <Text style={[styles.jsonString, { color: '#16A34A' }]}>{indent}"{data}"</Text>;
  }
  
  if (typeof data === 'number') {
    return <Text style={[styles.jsonNumber, { color: '#3B82F6' }]}>{indent}{data}</Text>;
  }
  
  if (typeof data === 'boolean') {
    return <Text style={[styles.jsonBoolean, { color: '#9333EA' }]}>{indent}{data ? 'true' : 'false'}</Text>;
  }
  
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <Text style={{ color: colors.textSecondary }}>{indent}[]</Text>;
    }
    
    return (
      <View>
        <Text style={{ color: colors.textSecondary }}>{indent}[</Text>
        {data.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row' }}>
            <JSONViewer data={item} indentLevel={indentLevel + 1} />
            {index < data.length - 1 && <Text style={{ color: colors.textSecondary }}>,</Text>}
          </View>
        ))}
        <Text style={{ color: colors.textSecondary }}>{indent}]</Text>
      </View>
    );
  }
  
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    
    if (keys.length === 0) {
      return <Text style={{ color: colors.textSecondary }}>{indent}{'{}'}</Text>;
    }
    
    return (
      <View>
        <Text style={{ color: colors.textSecondary }}>{indent}{'{'}</Text>
        {keys.map((key, index) => (
          <View key={key} style={{ flexDirection: 'row' }}>
            <Text style={[styles.jsonKey, { color: '#E11D48' }]}>{indent}  "{key}"</Text>
            <Text style={{ color: colors.textSecondary }}>: </Text>
            <View style={{ flex: 1 }}>
              <JSONViewer data={data[key]} indentLevel={0} />
            </View>
            {index < keys.length - 1 && <Text style={{ color: colors.textSecondary }}>,</Text>}
          </View>
        ))}
        <Text style={{ color: colors.textSecondary }}>{indent}{'}'}</Text>
      </View>
    );
  }
  
  return <Text style={{ color: colors.textSecondary }}>{indent}{String(data)}</Text>;
};

const DeveloperResourcesScreen = () => {
  const navigation = useNavigation();
  const [storageData, setStorageData] = useState<StorageData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStorageData();
  }, []);

  const fetchStorageData = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allData: StorageData[] = [];

      for (const key of allKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          let parsedValue = value;
          
          // JSON parse etmeye çalış
          try {
            if (value) {
              parsedValue = JSON.parse(value);
            }
          } catch {
            // JSON değilse string olarak bırak
            parsedValue = value;
          }
          
          const displayName = getDisplayName(key);
          
          allData.push({
            title: displayName,
            key,
            data: parsedValue,
            isEditable: isEditableKey(key),
          });
        } catch (error) {
          console.error(`Error fetching ${key}:`, error);
          allData.push({
            title: getDisplayName(key),
            key,
            data: 'Error loading data',
            isEditable: false,
          });
        }
      }

      // Show message if no data found
      if (allData.length === 0) {
        console.log('No storage data found');
      }

      setStorageData(allData);
    } catch (error) {
      console.error('Storage verilerini alırken hata:', error);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu');
    }
  };

  const getDisplayName = (key: string): string => {
    const displayNames: Record<string, string> = {
      // App related
      '@GlobalGpt_theme': 'Uygulama Teması',
      '@GlobalGpt_onboarding_completed': 'Onboarding Tamamlandı',
      '@GlobalGpt_chat_contacts': 'Chat Kişileri',
      '@GlobalGpt_chat_history': 'Chat Geçmişi',
      
      // User related
      'user_token': 'Kullanıcı Token',
      'user_profile': 'Kullanıcı Profili',
      'user_settings': 'Kullanıcı Ayarları',
      'user_preferences': 'Kullanıcı Tercihleri',
      
      // Cache related
      'cache_timestamp': 'Cache Zaman Damgası',
      'cache_data': 'Cache Verileri',
      
      // Form data
      'form_drafts': 'Form Taslakları',
      'search_history': 'Arama Geçmişi',
      
      // Developer mode
      'developer_mode_enabled': 'Developer Mode',
    };

    return displayNames[key] || key;
  };

  const isEditableKey = (key: string): boolean => {
    const nonEditableKeys = [
      'cache_timestamp',
      'app_version',
      'app_first_launch',
    ];
    return !nonEditableKeys.includes(key);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStorageData();
    setRefreshing(false);
  };

  const copyToClipboard = async (data: any, title: string) => {
    try {
      await Clipboard.setString(JSON.stringify(data, null, 2));
      Alert.alert('Başarılı', `${title} kopyalandı`);
    } catch (error) {
      Alert.alert('Hata', 'Kopyalama başarısız oldu');
    }
  };

  const clearAllStorage = async () => {
    Alert.alert(
      'Tüm Verileri Temizle',
      'Bu işlem tüm saklanan verileri silecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Başarılı', 'Tüm veriler temizlendi');
              await fetchStorageData();
            } catch (error) {
              Alert.alert('Hata', 'Veriler temizlenirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const StorageCard = ({ item }: { item: StorageData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState('');
    const [viewMode, setViewMode] = useState<'text' | 'json'>('text');

    const handleEdit = () => {
      setEditedData(JSON.stringify(item.data, null, 2));
      setIsEditing(true);
    };

    const handleSave = async () => {
      try {
        let parsedData;
        try {
          parsedData = JSON.parse(editedData);
        } catch {
          // Try as string if JSON parse fails
          parsedData = editedData;
        }

        await AsyncStorage.setItem(item.key, JSON.stringify(parsedData));
        Alert.alert('Başarılı', 'Veriler başarıyla güncellendi');
        setIsEditing(false);
        await fetchStorageData();
      } catch (error) {
        Alert.alert('Hata', 'Veriler güncellenirken bir hata oluştu');
      }
    };

    const handleDelete = async () => {
      Alert.alert(
        'Veriyi Sil',
        `${item.title} verisini silmek istediğinizden emin misiniz?`,
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: async () => {
              try {
                await AsyncStorage.removeItem(item.key);
                Alert.alert('Başarılı', 'Veri başarıyla silindi');
                await fetchStorageData();
              } catch (error) {
                Alert.alert('Hata', 'Veri silinirken bir hata oluştu');
              }
            },
          },
        ]
      );
    };

    const formatJSON = (data: any): string => {
      if (typeof data !== 'object' || data === null) {
        return String(data);
      }
      
      try {
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return String(data);
      }
    };

    const toggleViewMode = () => {
      setViewMode(viewMode === 'text' ? 'json' : 'text');
    };

    return (
      <View style={[styles.storageCard, { 
        backgroundColor: colors.surface,
        borderColor: colors.secondary,
      }]}>
        <View style={styles.storageCardHeader}>
          <Text style={[styles.storageTitle, { color: colors.text }]}>{item.title}</Text>
          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity 
                  onPress={handleSave}
                  style={[styles.button, { backgroundColor: '#16A34A' }]}
                >
                  <Text style={styles.buttonText}>Kaydet</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setIsEditing(false)}
                  style={[styles.button, { backgroundColor: colors.textSecondary }]}
                >
                  <Text style={styles.buttonText}>İptal</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  onPress={toggleViewMode}
                  style={[styles.button, { backgroundColor: '#6366F1' }]}
                >
                  <Text style={styles.buttonText}>
                    {viewMode === 'text' ? 'JSON' : 'Text'}
                  </Text>
                </TouchableOpacity>
                {item.isEditable && (
                  <TouchableOpacity 
                    onPress={handleEdit}
                    style={[styles.button, { backgroundColor: '#F59E0B' }]}
                  >
                    <Text style={styles.buttonText}>Düzenle</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  onPress={() => copyToClipboard(item.data, item.title)}
                  style={[styles.button, { backgroundColor: colors.accent }]}
                >
                  <Text style={styles.buttonText}>Kopyala</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleDelete}
                  style={[styles.button, { backgroundColor: '#FF3B30' }]}
                >
                  <Text style={styles.buttonText}>Sil</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <ScrollView 
          style={[styles.dataContainer, { backgroundColor: colors.background }]}
          nestedScrollEnabled={true}
        >
          {isEditing ? (
            <TextInput
              style={[styles.dataInput, { color: colors.text }]}
              multiline
              value={editedData}
              onChangeText={setEditedData}
              placeholder="JSON formatında veri girin..."
              placeholderTextColor={colors.textSecondary}
            />
          ) : viewMode === 'text' ? (
            <Text style={[styles.dataText, { color: colors.textSecondary }]}>
              {formatJSON(item.data)}
            </Text>
          ) : (
            <View style={styles.jsonViewerContainer}>
              <JSONViewer data={item.data} />
            </View>
          )}
        </ScrollView>
      </View>
    );
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
          <BackIcon size={wp(6)} color={colors.accent} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Developer Resources</Text>
      </View>

      <ScrollView 
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={{
          paddingBottom: hp(15) // Tab bar + extra space
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {/* Storage Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Storage Verileri</Text>
          </View>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            AsyncStorage'da gerçekten saklanan veriler aşağıda listelenmiştir.
          </Text>
          
          {storageData.length === 0 ? (
            <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.secondary }]}>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                Henüz hiç veri kaydedilmemiş.
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Onboarding sürecini tamamlayın veya uygulamayı kullanmaya başlayın.
              </Text>
            </View>
          ) : (
            storageData.map((item, index) => (
              <StorageCard key={index} item={item} />
            ))
          )}
        </View>

        {/* Tools Section */}
        <View style={[styles.section, { backgroundColor: colors.background, marginTop: hp(4) }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Araçlar</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: colors.surface, borderBottomColor: colors.secondary }]}
            onPress={onRefresh}
          >
            <Text style={[styles.menuItemText, { color: colors.text }]}>Verileri Yenile</Text>
            <View style={styles.menuItemRight}>
              <ArrowRightIcon size={wp(6)} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: colors.surface, borderBottomColor: colors.secondary }]}
            onPress={clearAllStorage}
          >
            <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>Tüm Verileri Temizle</Text>
            <View style={styles.menuItemRight}>
              <ArrowRightIcon size={wp(6)} color="#FF3B30" />
            </View>
          </TouchableOpacity>
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
  description: {
    fontSize: wp(4),
    lineHeight: wp(6),
    marginBottom: hp(3),
  },
  storageCard: {
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
  },
  storageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
    flexWrap: 'wrap',
  },
  storageTitle: {
    fontSize: wp(4),
    fontWeight: '600',
    flex: 1,
    marginRight: wp(2),
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  button: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(1.5),
  },
  buttonText: {
    fontSize: wp(3),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dataContainer: {
    maxHeight: hp(25),
    borderRadius: wp(2),
    padding: wp(3),
    marginTop: hp(1),
  },
  dataText: {
    fontSize: wp(3.5),
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    lineHeight: wp(5),
  },
  dataInput: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: wp(3.5),
    lineHeight: wp(5),
    padding: 0,
    textAlignVertical: 'top',
    minHeight: hp(12),
  },
  jsonViewerContainer: {
    padding: wp(1),
  },
  jsonKey: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: '600',
  },
  jsonString: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  jsonNumber: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  jsonBoolean: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: '600',
  },
  jsonNull: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontStyle: 'italic',
  },
  jsonUndefined: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontStyle: 'italic',
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
  emptyContainer: {
    padding: hp(3),
    borderRadius: wp(3),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  emptyText: {
    fontSize: wp(4),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  emptySubtext: {
    fontSize: wp(3.5),
    textAlign: 'center',
    lineHeight: wp(5),
  },
});

export default DeveloperResourcesScreen;
