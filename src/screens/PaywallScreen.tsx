import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Animated,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { colors } from '../theme/colors';
import { storage } from '../services/storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive design helpers
const isTablet = SCREEN_WIDTH >= 768;
const isSmallScreen = SCREEN_WIDTH < 375;
const getResponsiveSize = (size: number) => {
  if (isTablet) return size * 1.3;
  if (isSmallScreen) return size * 0.9;
  return size;
};
const getResponsivePadding = (padding: number) => {
  if (isTablet) return padding * 1.5;
  if (isSmallScreen) return padding * 0.8;
  return padding;
};

// SVG Icons
const unlimitedIconSvg = (color: string) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="${color}" stroke-width="2"/>
<path d="M8 12L11 15L16 9" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const heartIconSvg = (color: string) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const starSvg = (color: string) => `
<svg height="24px" viewBox="0 0 24 24" width="24px" fill="${color}">
<path d="M0 0h24v24H0V0z" fill="none"/>
<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
</svg>
`;

const getSvgIcon = (type: string, color: string) => {
  switch (type) {
    case 'unlimited': return unlimitedIconSvg(color);
    case 'heart': return heartIconSvg(color);
    case 'star': return starSvg(color);
    default: return starSvg(color);
  }
};

interface SlideData {
  id: number;
  title: string;
  description: string;
  icon: string;
  isAIScore?: boolean;
}

const PaywallScreen = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('medium');
  
  const sliderRef = useRef<ScrollView>(null);

  // Onboarding kontrolü - component mount olduğunda
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const isOnboardingCompleted = await storage.getOnboardingCompleted();
        if (isOnboardingCompleted) {
          // Onboarding tamamlandıysa direkt HomeScreen'e git
          console.log('Onboarding already completed - redirecting to HomeScreen');
          (navigation as any).reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
          });
        }
      } catch (error) {
        console.error('Onboarding kontrolü sırasında hata:', error);
      }
    };

    checkOnboardingStatus();
  }, [navigation]);

  // Colors - mevcut proje renklerini kullan
  const ourColors = {
    background: colors.background || '#FFFFFF',
    text: colors.text || '#000000',
    textSecondary: colors.textSecondary || '#666666',
    primary: colors.accent || '#1EB7A7',
    surface: colors.surface || '#F8F9FA',
    border: colors.secondary || '#E0E0E0',
    buttonText: colors.white || '#FFFFFF',
    error: '#FF6B6B',
  };

  // Slider verileri
  const slides: SlideData[] = [
    {
      id: 1,
      title: 'Sınırsız Erişim',
      description: 'Tüm özelliklerden sınırsız faydalanın',
      icon: 'unlimited'
    },
    {
      id: 2,
      title: 'Kişiselleştirilmiş Deneyim',
      description: 'Size özel AI asistanları',
      icon: 'heart'
    },
    {
      id: 3,
      title: 'Developer Besliyoruz',
      description: 'Bu kredilerle geliştiricileri mutlu ediyorsunuz! 🍕',
      icon: 'heart'
    },
    {
      id: 4,
      title: 'Çok Mutlu Olurum 😊',
      description: 'Satın alımınız beni gerçekten çok mutlu ediyor!',
      icon: 'star'
    }
  ];

  // Credit packages data
  const creditPackages = [
    {
      id: 'small',
      title: '100 Kredi',
      price: '₺19,99',
      credits: '100',
      description: 'Küçük paket'
    },
    {
      id: 'medium',
      title: '500 Kredi',
      price: '₺79,99', 
      credits: '500',
      description: 'Orta paket',
      isBestChoice: true
    },
    {
      id: 'large',
      title: '1000 Kredi',
      price: '₺149,99',
      credits: '1000',
      description: 'Büyük paket'
    }
  ];

  // Auto slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % slides.length;
        sliderRef.current?.scrollTo({ 
          x: nextSlide * SCREEN_WIDTH,
          y: 0, 
          animated: true 
        });
        return nextSlide;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length]);


  const onSlideChange = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const slideIndex = Math.round(contentOffset.x / SCREEN_WIDTH);
    if (slideIndex >= 0 && slideIndex < slides.length) {
      setCurrentSlide(slideIndex);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    sliderRef.current?.scrollTo({ 
      x: index * SCREEN_WIDTH, 
      y: 0,
      animated: true 
    });
  };

  const handleSubscribe = async () => {
    try {
      // Onboarding'i tamamlandı olarak işaretle
      await storage.setOnboardingCompleted(true);
      console.log('Subscribe tapped - Onboarding completed');
      
      // HomeScreen'e git
      (navigation as any).reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    } catch (error) {
      console.error('Subscribe işlemi sırasında hata:', error);
    }
  };

  const handleClose = async () => {
    try {
      // Onboarding'i tamamlandı olarak işaretle (kapatsa da tamamlanmış sayılsın)
      await storage.setOnboardingCompleted(true);
      console.log('Close tapped - Onboarding completed');
      
      // HomeScreen'e git
      (navigation as any).reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    } catch (error) {
      console.error('Close işlemi sırasında hata:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: ourColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={ourColors.background} />
      
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
      >
        <Text style={[styles.closeButtonText, { color: ourColors.text }]}>✕</Text>
      </TouchableOpacity>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Logo */}
        <Image 
          source={require('../assets/ggpt.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: ourColors.text }]}>
          Premium <Text style={[styles.premiumText, { color: ourColors.primary }]}>Özellikleri</Text> Keşfedin
        </Text>

        {/* Feature Slider */}
        <ScrollView
          ref={sliderRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onSlideChange}
          style={styles.slider}
        >
          {slides.map((slide) => (
            <View key={slide.id} style={styles.slide}>
              <View style={styles.slideIconContainer}>
                <SvgXml 
                  xml={getSvgIcon(slide.icon, ourColors.primary)} 
                  width={getResponsiveSize(48)} 
                  height={getResponsiveSize(48)} 
                />
              </View>
              <Text style={[styles.slideTitle, { color: ourColors.text }]}>
                {slide.title}
              </Text>
              <Text style={[styles.slideDescription, { color: ourColors.textSecondary }]}>
                {slide.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Slide Indicator */}
        <View style={styles.slideIndicator}>
          {slides.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                index === currentSlide 
                  ? [styles.activeDot, { backgroundColor: ourColors.primary }]
                  : [styles.inactiveDot, { backgroundColor: ourColors.border }]
              ]}
              onPress={() => goToSlide(index)}
            />
          ))}
        </View>

        {/* Credit Packages */}
        <View style={styles.pricingContainer}>
          {creditPackages.map((creditPackage) => {
            const isSelected = selectedProduct === creditPackage.id;
            
            return (
              <TouchableOpacity
                key={creditPackage.id}
                style={[
                  styles.priceCard,
                  { 
                    backgroundColor: ourColors.surface,
                    borderColor: isSelected ? ourColors.primary : ourColors.border,
                    borderWidth: isSelected ? 2 : 1,
                  }
                ]}
                onPress={() => setSelectedProduct(creditPackage.id)}
              >
                {creditPackage.isBestChoice && (
                  <View style={[styles.discountBadge, { backgroundColor: ourColors.primary }]}>
                    <Text style={[styles.discountText, { color: ourColors.buttonText }]}>
                      En Popüler
                    </Text>
                  </View>
                )}
                
                <Text style={[styles.priceCardTitle, { color: ourColors.primary }]}>
                  {creditPackage.title}
                </Text>
                
                <Text style={[styles.priceCardPrice, { color: ourColors.text }]}>
                  {creditPackage.price}
                </Text>
                
                <Text style={[styles.priceCardPeriod, { color: ourColors.textSecondary }]}>
                  {creditPackage.credits} kredi
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: ourColors.primary }]}
          onPress={handleSubscribe}
        >
          <Text style={[styles.subscribeButtonText, { color: ourColors.buttonText }]}>
            Kredi Satın Al
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: getResponsivePadding(60),
    right: getResponsivePadding(20),
    zIndex: 10,
    width: getResponsiveSize(32),
    height: getResponsiveSize(32),
    justifyContent: 'center',
    alignItems: 'center',
  },  
  closeButtonText: {
    fontSize: getResponsiveSize(18),
    fontFamily: 'System',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: getResponsivePadding(80),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(40),
  },
  logoImage: {
    width: getResponsiveSize(120),
    height: getResponsiveSize(120),
    alignSelf: 'center',
    marginBottom: getResponsivePadding(30),
  },
  subtitle: {
    fontSize: getResponsiveSize(32),
    fontFamily: 'System',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: getResponsivePadding(16),
    marginTop: getResponsivePadding(20),
  },
  premiumText: {
    fontSize: getResponsiveSize(32),
    fontFamily: 'System',
    fontWeight: '700',
  },
  slider: {
    height: getResponsiveSize(200),
    marginBottom: getResponsivePadding(30),
    marginLeft: -getResponsivePadding(20),
    marginRight: -getResponsivePadding(20),
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsivePadding(16),
  },
  slideTitle: {
    fontSize: getResponsiveSize(20),
    fontFamily: 'System',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: getResponsivePadding(8),
    width: SCREEN_WIDTH,
    paddingHorizontal: getResponsivePadding(20),
  },
  slideDescription: {
    fontSize: getResponsiveSize(15),
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: getResponsiveSize(22),
    width: SCREEN_WIDTH,
    paddingHorizontal: getResponsivePadding(20),
  },
  slideIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsivePadding(50),
  },
  dot: {
    marginHorizontal: getResponsivePadding(4),
  },
  activeDot: {
    width: getResponsiveSize(8),
    height: getResponsiveSize(8),
    borderRadius: getResponsiveSize(4),
  },
  inactiveDot: {
    width: getResponsiveSize(6),
    height: getResponsiveSize(6),
    borderRadius: getResponsiveSize(3),
  },
  pricingContainer: {
    flexDirection: 'row',
    marginBottom: getResponsivePadding(32),
    gap: getResponsivePadding(12),
  },
  priceCard: {
    flex: 1,
    padding: getResponsivePadding(16),
    borderRadius: getResponsiveSize(16),
    position: 'relative',
    alignItems: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: getResponsiveSize(-15),
    alignSelf: 'center',
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountText: {
    fontSize: getResponsiveSize(10),
    fontFamily: 'System',
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  priceCardTitle: {
    fontSize: getResponsiveSize(16),
    fontFamily: 'System',
    fontWeight: '700',
    marginBottom: getResponsivePadding(2),
    marginTop: getResponsivePadding(10),
  },
  priceCardPrice: {
    fontSize: getResponsiveSize(18),
    fontFamily: 'System',
    fontWeight: '800',
    marginBottom: getResponsivePadding(2),
  },
  priceCardPeriod: {
    fontSize: getResponsiveSize(12),
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: getResponsiveSize(16),
  },
  subscribeButton: {
    paddingVertical: getResponsivePadding(16),
    borderRadius: getResponsiveSize(16),
    alignItems: 'center',
    marginBottom: getResponsivePadding(20),
  },
  subscribeButtonText: {
    fontSize: getResponsiveSize(18),
    fontFamily: 'System',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: getResponsiveSize(22),
    fontFamily: 'System',
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: getResponsiveSize(15),
    fontFamily: 'System',
    textAlign: 'center',
    marginTop: getResponsivePadding(4),
  },
});

export default PaywallScreen;
