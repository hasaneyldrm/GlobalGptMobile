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
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

// Responsive helper functions
const wp = (percentage: number) => {
  return width * (percentage / 100);
};

const hp = (percentage: number) => {
  return height * (percentage / 100);
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleChatPress = () => {
    console.log('Chat başlatıldı');
    // Chat ekranına yönlendir
    // navigation.navigate('ChatScreen');
  };

  const handleSettingsPress = () => {
    console.log('Ayarlar açıldı');
    // Ayarlar ekranına yönlendir
    // navigation.navigate('SettingsScreen');
  };

  const handleProfilePress = () => {
    console.log('Profil açıldı');
    // Profil ekranına yönlendir
    // navigation.navigate('ProfileScreen');
  };

  const quickActions = [
    {
      id: '1',
      title: 'Yeni Sohbet',
      description: 'AI ile yeni bir sohbet başlat',
      icon: '💬',
      color: colors.accent,
      action: handleChatPress
    },
    {
      id: '2',
      title: 'Geçmiş Sohbetler',
      description: 'Önceki konuşmalarını görüntüle',
      icon: '📚',
      color: '#8B5CF6',
      action: () => console.log('Geçmiş sohbetler')
    },
    {
      id: '3',
      title: 'AI Karakterler',
      description: 'Farklı AI kişilikleri keşfet',
      icon: '🎭',
      color: '#10B981',
      action: () => console.log('AI karakterler')
    },
    {
      id: '4',
      title: 'Premium',
      description: 'Premium özellikleri keşfet',
      icon: '⭐',
      color: '#F59E0B',
      action: () => console.log('Premium')
    }
  ];

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
          
          <View style={styles.creditDisplay}>
            <Text style={styles.creditLabel}>Kalan</Text>
            <Text style={styles.creditAmount}>∞</Text>
          </View>
        </View>


        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { borderColor: action.color + '20' }]}
                onPress={action.action}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                  <Text style={styles.actionEmoji}>{action.icon}</Text>
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
  creditDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditLabel: {
    fontSize: wp(3),
    color: colors.textSecondary,
    fontWeight: '500',
  },
  creditAmount: {
    fontSize: wp(6),
    color: colors.accent,
    fontWeight: '700',
    marginTop: hp(0.2),
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(6),
    marginBottom: hp(3),
    gap: wp(3),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: wp(4),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  statNumber: {
    fontSize: wp(8),
    fontWeight: '700',
    color: colors.accent,
    marginBottom: hp(0.5),
  },
  statLabel: {
    fontSize: wp(3.5),
    color: colors.textSecondary,
    textAlign: 'center',
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
  recentContainer: {
    paddingHorizontal: wp(6),
    marginBottom: hp(3),
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: wp(6),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  emptyIcon: {
    fontSize: wp(12),
    marginBottom: hp(2),
  },
  emptyTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: colors.text,
    marginBottom: hp(1),
  },
  emptyDescription: {
    fontSize: wp(3.5),
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: wp(5),
  },
  bottomActions: {
    paddingHorizontal: wp(6),
    gap: hp(1.5),
  },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: hp(2),
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: wp(4.5),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    paddingVertical: hp(1.5),
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: wp(4),
    fontWeight: '500',
  },
});

export default HomeScreen;
