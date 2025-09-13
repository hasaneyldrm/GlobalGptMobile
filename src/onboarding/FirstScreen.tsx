import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { colors } from '../theme/colors';

// Responsive boyutlar için yardımcı fonksiyonlar
const { width, height } = Dimensions.get('window');
const wp = (percentage: number) => {
  return width * (percentage / 100);
};

const hp = (percentage: number) => {
  return height * (percentage / 100);
};

interface Props {
  navigation?: any;
}

const FirstScreen: React.FC<Props> = ({ navigation }) => {
  const handleContinue = () => {
    navigation?.navigate('Name');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.content}>
        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Global GPT'ye Hoş Geldiniz!</Text>
          <Text style={styles.descriptionText}>
            Yapay zeka ile sohbet etmeye ve sorularınıza anında cevap almaya hazır mısınız?
          </Text>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/ggpt.png')}
            style={styles.logoStyle}
            resizeMode="contain"
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>DEVAM ET</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(6),
    paddingVertical: hp(4),
  },
  textContainer: {
    marginTop: hp(8),
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: wp(8),
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: hp(3),
  },
  descriptionText: {
    fontSize: wp(4.5),
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: wp(6),
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(4),
  },
  logoStyle: {
    width: wp(60),
    height: wp(60),
  },
  continueButton: {
    backgroundColor: colors.accent,
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    width: wp(84), // Yatayda daha uzun buton
    marginBottom: hp(4),
  },
  continueButtonText: {
    color: colors.white,
    fontSize: wp(4.2),
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default FirstScreen;

