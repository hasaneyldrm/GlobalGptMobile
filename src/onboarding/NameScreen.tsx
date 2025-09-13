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
  onComplete?: () => void;
}

const NameScreen: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (name.trim()) {
      onComplete?.();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Merhaba! 👋</Text>
          <Text style={styles.subtitle}>
            Seni nasıl çağıralım?
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Adınızı yazın"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </View>

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
            Devam Et
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
    paddingHorizontal: wp(5),
    paddingVertical: hp(5),
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: hp(8),
  },
  title: {
    fontSize: wp(8),
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: hp(2),
  },
  subtitle: {
    fontSize: wp(4.5),
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: wp(6),
  },
  inputContainer: {
    marginBottom: hp(6),
  },
  input: {
    borderWidth: 2,
    borderColor: colors.surface,
    borderRadius: 15,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    fontSize: wp(4.5),
    color: colors.text,
    textAlign: 'center',
    backgroundColor: colors.surface,
  },
  continueButton: {
    backgroundColor: colors.accent,
    paddingVertical: hp(2),
    borderRadius: 15,
    alignItems: 'center',
  },
  continueButtonText: {
    color: colors.white,
    fontSize: wp(4.5),
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: colors.textMuted,
  },
  disabledButtonText: {
    color: colors.textSecondary,
  },
});

export default NameScreen;
