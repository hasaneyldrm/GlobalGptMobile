import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addContact } from '../store/chatSlice';
import { colors } from '../theme/colors';
import { AI_CHARACTERS } from '../constants/aiCharacters';

type RootStackParamList = {
  MainTabs: undefined;
  Chat: {
    screen: string;
    params?: any;
  };
};

const { width, height } = Dimensions.get('window');

// Responsive helper functions
const wp = (percentage: number) => {
  return width * (percentage / 100);
};

const hp = (percentage: number) => {
  return height * (percentage / 100);
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  
  // Credit from Redux store
  const userCredit = useSelector((state: RootState) => state.credit.userCredit);

  const handleCharacterPress = (characterId: string, characterName: string) => {
    // Kişiyi contact olarak ekle (eğer yoksa)
    dispatch(addContact({
      id: characterId,
      name: characterName,
      avatar: characterId, // Avatar için character id'sini kullan
    }));

    // Önce Chat tab'ına git, sonra ChatDetail'e
    navigation.navigate('Chat', {
      screen: 'ChatList'
    });
    
    // Kısa bir gecikme ile ChatDetail'e geç (animasyon için)
    setTimeout(() => {
      navigation.navigate('Chat', {
        screen: 'ChatDetail',
        params: { contactId: characterId }
      });
    }, 100);
  };

  // AI karakterlerini constants'tan al ve quickActions formatına çevir
  const quickActions = AI_CHARACTERS.map((character, index) => {
    const colors = ['#8B5CF6', '#475569', '#DC2626', '#1E40AF', '#059669', '#7C3AED'];
    return {
      id: character.id,
      title: character.name,
      description: character.description,
      image: character.image,
      color: colors[index % colors.length],
      action: () => handleCharacterPress(character.id, character.name)
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../assets/ggpt.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={styles.headerText}>
              <Text style={styles.welcomeText}>Hoş geldin!</Text>
              <Text style={styles.appName}>Global GPT</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.creditButton} onPress={() => navigation.navigate('Paywall' as any)}>
            <Text style={styles.creditAmount}>{userCredit}</Text>
          </TouchableOpacity>
        </View>


        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>En iyi AI Karakterler</Text>
          
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { borderColor: action.color + '20' }]}
                onPress={action.action}
                activeOpacity={0.7}
              >
                <View style={styles.characterContainer}>
                  <Image
                    source={action.image}
                    style={styles.singleCharacterAvatar}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(10), // Tab bar için extra padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
    marginBottom: hp(2),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: wp(12),
    height: wp(12),
    marginRight: wp(3),
  },
  headerText: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: wp(4),
    color: colors.textSecondary,
    fontWeight: '500',
  },
  appName: {
    fontSize: wp(6),
    color: colors.text,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  creditButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: wp(8),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    borderWidth: 1,
    borderColor: colors.secondary,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: wp(16),
  },
  creditAmount: {
    fontSize: wp(5.5),
    color: colors.accent,
    fontWeight: '700',
  },
  actionsContainer: {
    paddingHorizontal: wp(6),
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: wp(5.5),
    fontWeight: '700',
    color: colors.text,
    marginBottom: hp(2),
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(3),
  },
  actionCard: {
    width: (wp(100) - wp(12) - wp(3)) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: wp(4),
    borderWidth: 1,
    alignItems: 'center',
  },
  actionIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  actionEmoji: {
    fontSize: wp(6),
  },
  actionTitle: {
    fontSize: wp(4),
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  actionDescription: {
    fontSize: wp(3),
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: wp(4.5),
  },
  characterContainer: {
    width: wp(12),
    height: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  singleCharacterAvatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    borderWidth: 2,
    borderColor: colors.surface,
  },
});

export default HomeScreen;
