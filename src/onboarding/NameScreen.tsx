import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Screen'e gelindiğinde klavyeyi otomatik aç
  useFocusEffect(
    React.useCallback(() => {
      // Kısa bir gecikme ile focus yap (animasyon tamamlansın diye)
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );

  const handleContinue = () => {
    if (name.trim()) {
      // İsim kaydedildi, loading ekranına geç
      console.log('Kullanıcı adı:', name);
      navigation?.navigate('Loading');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
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
                ref={inputRef}
                style={[
                  styles.input,
                  isFocused && styles.inputFocused
                ]}
                placeholder="Adınızı yazın..."
                placeholderTextColor="#8A8A8A"
                value={name}
                onChangeText={setName}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoFocus={true}
                selectionColor={colors.accent}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                blurOnSubmit={false}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
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
    backgroundColor: '#262626',
    borderWidth: 2,
    borderColor: '#3A3A3A',
    borderRadius: 16,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),
    fontSize: wp(4.8),
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputFocused: {
    borderColor: colors.accent,
    backgroundColor: '#2A2A2A',
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
