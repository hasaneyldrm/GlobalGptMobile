import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';

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

const NameScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (name.trim()) {
      // İsim kaydedildi, ana uygulamaya geç
      console.log('Kullanıcı adı:', name);
      // navigation?.navigate('MainApp'); // Ana uygulama ekranı
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.content}>
        {/* Header Text */}
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Merhaba! 👋</Text>
          <Text style={styles.descriptionText}>
            Seni nasıl çağıralım? Adını öğrenmek istiyoruz.
          </Text>
        </View>

        {/* Input Container */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Adınızı yazın..."
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoFocus
              selectionColor={colors.accent}
            />
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            !name.trim() && styles.disabledButton
          ]} 
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={[
            styles.continueButtonText,
            !name.trim() && styles.disabledButtonText
          ]}>
            DEVAM ET
          </Text>
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
  inputSection: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: wp(4),
  },
  inputContainer: {
    marginBottom: hp(4),
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 16,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),
    fontSize: wp(4.8),
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
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
    width: wp(84),
    marginBottom: hp(4),
  },
  continueButtonText: {
    color: colors.white,
    fontSize: wp(4.2),
    fontWeight: '700',
    letterSpacing: 1,
  },
  disabledButton: {
    backgroundColor: colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: colors.background,
    opacity: 0.7,
  },
});

export default NameScreen;
