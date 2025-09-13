import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import LottieView from 'lottie-react-native';
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
  onNavigateToName?: () => void;
}

const FirstScreen: React.FC<Props> = ({ onNavigateToName }) => {
  const handleContinue = () => {
    onNavigateToName?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.content}>
        {/* Lottie Animation */}
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../assets/lotties/2.json')}
            autoPlay
            loop
            style={styles.lottieStyle}
          />
        </View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Hoş Geldiniz!</Text>
          <Text style={styles.descriptionText}>
            Global GPT ile muhteşem bir deneyime başlamaya hazır mısın?
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Devam Et</Text>
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
    paddingHorizontal: wp(8),
    paddingVertical: hp(8),
  },
  animationContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieStyle: {
    width: wp(80),
    height: wp(80),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
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
  continueButton: {
    backgroundColor: colors.accent,
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(8),
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: wp(4.2),
    fontWeight: '600',
  },
});

export default FirstScreen;

