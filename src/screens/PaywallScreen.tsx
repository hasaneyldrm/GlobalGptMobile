import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

// Responsive helper functions
const wp = (percentage: number) => {
  return width * (percentage / 100);
};

const hp = (percentage: number) => {
  return height * (percentage / 100);
};

interface Props {
  navigation?: any;
}

const PaywallScreen: React.FC<Props> = ({ navigation }) => {
  const handleBuyCredits = () => {
    console.log('Buy credits tapped');
    // Handle credit purchase
  };

  const handleNoThanks = () => {
    console.log('No thanks tapped');
    // Continue to main app
    // navigation?.navigate('MainApp');
  };

  const features = [
    {
      icon: '🤖',
      title: 'AI Avatar Sohbetleri',
      description: 'Farklı karakterlerle sohbet edin!',
      color: '#3B82F6'
    },
    {
      icon: '💬',
      title: 'Sınırsız Mesaj',
      description: 'İstediğiniz kadar soru sorun!',
      color: '#10B981'
    },
    {
      icon: '🎭',
      title: 'Özel Karakterler',
      description: 'Benzersiz AI kişilikleri keşfedin',
      color: '#8B5CF6'
    },
    {
      icon: '⚡',
      title: 'Hızlı Yanıtlar',
      description: 'Anında cevap alın, beklemeden!',
      color: '#F59E0B'
    },
    {
      icon: '🎯',
      title: 'Kişiselleştirilmiş Deneyim',
      description: 'Size özel AI asistanları!',
      color: '#EF4444',
      badge: 'Popüler!'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/ggpt.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Ekstra Kredi Paketi</Text>
            <Text style={styles.subtitle}>
              AI avatarlarla sınırsız sohbet için kredi satın alın!
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureLeft}>
                  <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                    <Text style={styles.featureEmoji}>{feature.icon}</Text>
                  </View>
                  <View style={styles.featureText}>
                    <View style={styles.featureTitleRow}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      {feature.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{feature.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* CTA Buttons */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity style={styles.upgradeButton} onPress={handleBuyCredits}>
              <Text style={styles.upgradeButtonText}>
                Kredi Satın Al 🚀
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.noThanksButton} onPress={handleNoThanks}>
              <Text style={styles.noThanksText}>Hayır teşekkürler!</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Global GPT</Text>
            <Text style={styles.footerSubtext}>powered by AI</Text>
          </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: hp(4),
    paddingTop: hp(2),
  },
  logoContainer: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(5),
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: wp(12),
    height: wp(12),
  },
  title: {
    fontSize: wp(8),
    fontWeight: '700',
    color: colors.accent,
    textAlign: 'center',
    marginBottom: hp(1),
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: wp(4),
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: wp(5.5),
    paddingHorizontal: wp(4),
  },
  featuresContainer: {
    flex: 1,
    marginBottom: hp(2),
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: colors.secondary,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  featureEmoji: {
    fontSize: wp(6),
  },
  featureText: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  featureTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: colors.text,
    marginRight: wp(2),
  },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: 8,
  },
  badgeText: {
    fontSize: wp(2.8),
    fontWeight: '600',
    color: colors.white,
  },
  featureDescription: {
    fontSize: wp(3.8),
    color: colors.textSecondary,
    lineHeight: wp(5),
  },
  ctaContainer: {
    marginBottom: hp(3),
  },
  upgradeButton: {
    backgroundColor: colors.accent,
    paddingVertical: hp(2.2),
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  upgradeButtonText: {
    color: colors.white,
    fontSize: wp(4.5),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  noThanksButton: {
    paddingVertical: hp(1.5),
    alignItems: 'center',
  },
  noThanksText: {
    color: colors.textSecondary,
    fontSize: wp(4),
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
  },
  footerText: {
    fontSize: wp(4),
    fontWeight: '600',
    color: colors.text,
    marginBottom: hp(0.5),
  },
  footerSubtext: {
    fontSize: wp(3.2),
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default PaywallScreen;
