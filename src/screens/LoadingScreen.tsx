import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../theme/colors';
import { storage } from '../services/storage';
import { userService } from '../api/userService';
import { generateUUID } from '../utils/uuid';

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

const LoadingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentText, setCurrentText] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const circularProgressAnimation = useRef(new Animated.Value(0)).current;
  
  // Step animations
  const step1Animation = useRef(new Animated.Value(0)).current;
  const step2Animation = useRef(new Animated.Value(0)).current;
  const step3Animation = useRef(new Animated.Value(0)).current;
  const step4Animation = useRef(new Animated.Value(0)).current;

  // Responsive values
  const isTablet = width >= 768;
  const titleFontSize = isTablet ? wp(8) : wp(7);
  const subtitleFontSize = isTablet ? wp(4.5) : wp(4);

  const motivationalTexts = [
    'Profiliniz analiz ediliyor...',
    'Mükemmel plan oluşturuluyor...',
    'En iyi özellikler seçiliyor...',
    'Verileriniz hesaplanıyor...',
    'Neredeyse hazır!',
  ];

  const steps = [
    'Cevaplarınız analiz ediliyor',
    'Gereksinimler belirleniyor', 
    'İlerleme tahmin ediliyor',
    'Son ayarlamalar yapılıyor'
  ];

  // Kullanıcı UUID'sini kontrol et ve gerekirse oluştur
  const initializeUser = async () => {
    try {
      // TEST İÇİN: Storage'ı temizle (sonra bu satırı silin)
      // await storage.setUserUUID('');
      // await storage.setUserName('');
      
      // Mevcut UUID'yi kontrol et
      let userUUID = await storage.getUserUUID();
      let isNewUser = false;
      
      if (!userUUID) {
        // UUID yoksa yeni oluştur
        userUUID = generateUUID();
        await storage.setUserUUID(userUUID);
        isNewUser = true;
        console.log('Yeni UUID oluşturuldu:', userUUID);
      } else {
        console.log('Mevcut UUID bulundu:', userUUID);
      }

      // Kullanıcı adını al
      const userName = await storage.getUserName();
      
      if (userName && userUUID) {
        // API'ye kullanıcı bilgilerini gönder (her durumda)
        const userData = {
          uuid: userUUID,
          name: userName,
          project_id: 5
        };

        console.log('API\'ye gönderilen data:', userData);
        const response = await userService.createUser(userData);
        
        if (response.success) {
          console.log('Kullanıcı başarıyla oluşturuldu/güncellendi:', response.data);
        } else {
          console.error('Kullanıcı oluşturma hatası:', response.message);
        }
      } else {
        console.log('Kullanıcı adı bulunamadı, API çağrısı yapılmadı');
        console.log('userName:', userName, 'userUUID:', userUUID);
      }
    } catch (error) {
      console.error('Kullanıcı başlatma hatası:', error);
    }
  };

  const navigateToNext = () => {
    // Her zaman PaywallScreen'e git
    console.log('Loading completed - going to PaywallScreen');
    navigation?.navigate('Paywall');
  };

  useEffect(() => {
    let textIndex = 0;
    setCurrentText(motivationalTexts[0]);

    // Kullanıcıyı başlat (UUID oluştur ve API çağrısı yap)
    initializeUser();

    // Circular progress animation
    Animated.timing(circularProgressAnimation, {
      toValue: 1,
      duration: 5500,
      useNativeDriver: true,
    }).start();

    // Progress animation
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 5500,
      useNativeDriver: false,
    }).start(() => {
      navigateToNext();
    });

    // Progress percentage update
    let lastUpdate = 0;
    const progressListener = progressAnimation.addListener(({ value }) => {
      const now = Date.now();
      if (now - lastUpdate > 50) {
        setProgressPercentage(Math.round(value * 100));
        lastUpdate = now;
      }
    });

    // Text change
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % motivationalTexts.length;
      setCurrentText(motivationalTexts[textIndex]);
    }, 1200);

    return () => {
      progressAnimation.removeListener(progressListener);
      clearInterval(textInterval);
    };
  }, []);

  // Step animations based on progress
  useEffect(() => {
    const animateStep = (animation: Animated.Value, threshold: number) => {
      if (progressPercentage >= threshold) {
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    };

    animateStep(step1Animation, 25);
    animateStep(step2Animation, 50);
    animateStep(step3Animation, 75);
    animateStep(step4Animation, 100);
  }, [progressPercentage]);

  // Circular progress rotation
  const circularRotation = circularProgressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '180deg'],
  });

  const stepAnimations = [step1Animation, step2Animation, step3Animation, step4Animation];
  const thresholds = [25, 50, 75, 100];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.content}>
        {/* Circular Progress */}
        <View style={styles.circularProgressContainer}>
          <View style={styles.circularProgressBackground}>
            <Animated.View 
              style={[
                styles.circularProgressFill, 
                { 
                  transform: [{ rotate: circularRotation }] 
                }
              ]} 
            />
            <View style={styles.circularProgressInner}>
              <Text style={styles.circularProgressText}>
                {progressPercentage}%
              </Text>
            </View>
          </View>
        </View>

        {/* Main Title */}
        <Text style={styles.mainTitle}>
          Hazırlanıyor...
        </Text>

        {/* Current Status */}
        <Text style={styles.currentStatus}>
          {currentText}
        </Text>

        {/* Analysis Steps */}
        <View style={styles.analysisContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.analysisStep}>
              <Animated.View style={[
                styles.stepIcon, 
                { 
                  backgroundColor: progressPercentage >= thresholds[index] ? colors.accent : colors.secondary,
                  borderColor: progressPercentage >= thresholds[index] ? colors.accent : colors.secondary,
                  transform: [{ scale: stepAnimations[index] }]
                }
              ]}>
                {progressPercentage >= thresholds[index] ? (
                  <Animated.Text style={[
                    styles.checkMark, 
                    { 
                      transform: [{ scale: stepAnimations[index] }]
                    }
                  ]}>✓</Animated.Text>
                ) : (
                  <View style={styles.emptyCircle} />
                )}
              </Animated.View>
              <Text style={[
                styles.stepText, 
                { 
                  color: progressPercentage >= thresholds[index] ? colors.text : colors.textSecondary,
                  fontWeight: progressPercentage >= thresholds[index] ? '600' : '400'
                }
              ]}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        {/* AI Planning Section */}
        <View style={styles.aiPlanningSection}>
          <View style={styles.aiIconContainer}>
            <LottieView
              source={require('../assets/lotties/load.json')}
              autoPlay
              loop
              style={styles.lottieStyle}
              resizeMode="contain"
              speed={0.8}
            />
          </View>
          <Text style={styles.aiPlanningTitle}>
            AI ile Kişiselleştiriliyor
          </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(4),
  },
  circularProgressContainer: {
    marginBottom: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressBackground: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    borderWidth: 8,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circularProgressFill: {
    position: 'absolute',
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: colors.accent,
    transform: [{ rotate: '-90deg' }],
  },
  circularProgressInner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: colors.surface,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  circularProgressText: {
    fontSize: wp(8),
    fontWeight: '900',
    color: colors.accent,
  },
  mainTitle: {
    fontSize: wp(7),
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: hp(2),
    letterSpacing: -0.5,
  },
  currentStatus: {
    fontSize: wp(4.5),
    textAlign: 'center',
    color: colors.accent,
    lineHeight: wp(6),
    fontWeight: '600',
    marginBottom: hp(4),
  },
  analysisContainer: {
    width: '100%',
    marginBottom: hp(4),
  },
  analysisStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5),
    paddingHorizontal: wp(2),
  },
  stepIcon: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
    borderWidth: 2,
  },
  checkMark: {
    fontSize: wp(4),
    fontWeight: '900',
    color: colors.white,
  },
  emptyCircle: {
    width: wp(3),
    height: wp(3),
    borderRadius: wp(1.5),
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  stepText: {
    fontSize: wp(4),
    flex: 1,
    lineHeight: wp(5.5),
  },
  aiPlanningSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: hp(2),
  },
  aiIconContainer: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1.5),
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  lottieStyle: {
    width: wp(20),
    height: wp(20),
  },
  aiPlanningTitle: {
    fontSize: wp(4.5),
    fontWeight: '600',
    textAlign: 'center',
    color: colors.textSecondary,
  },
});

export default LoadingScreen;
