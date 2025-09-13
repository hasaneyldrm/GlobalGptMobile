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
import { colors } from '../theme/colors';

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

// SVG Icons as text (simple fallback)
const getSvgIcon = (type: string) => {
  switch (type) {
    case 'analytics': return '📊';
    case 'unlimited': return '✅';
    case 'heart': return '❤️';
    case 'star': return '⭐';
    case 'score': return '🎯';
    default: return '⭐';
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
  const buzzAnimation = useRef(new Animated.Value(1)).current;

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
      title: 'AI Skor Analizi',
      description: 'Yapay zeka ile kişilik analizinizi keşfedin',
      icon: 'score',
      isAIScore: true
    },
    {
      id: 2,
      title: 'Detaylı Analitik',
      description: 'Gelişiminizi takip edin ve ilerleyin',
      icon: 'analytics'
    },
    {
      id: 3,
      title: 'Sınırsız Erişim',
      description: 'Tüm özelliklerden sınırsız faydalanın',
      icon: 'unlimited'
    },
    {
      id: 4,
      title: 'Kişiselleştirilmiş Deneyim',
      description: 'Size özel AI asistanları',
      icon: 'heart'
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

  // Buzz animation for AI Score
  useEffect(() => {
    const startBuzzAnimation = () => {
      Animated.sequence([
        Animated.timing(buzzAnimation, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(buzzAnimation, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buzzAnimation, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buzzAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(startBuzzAnimation, 2000);
      });
    };

    setTimeout(startBuzzAnimation, 1000);
  }, [buzzAnimation]);

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

  const handleSubscribe = () => {
    // Basit navigation - ana sayfaya git
    console.log('Subscribe tapped');
  };

  const handleClose = () => {
    // LoserPaywallScreen'e git
    console.log('Close tapped');
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
              {slide.isAIScore ? (
                <View style={styles.aiScoreContainer}>
                  <Animated.View 
                    style={[
                      styles.scoreCard, 
                      { 
                        backgroundColor: ourColors.surface,
                        transform: [{ scale: buzzAnimation }]
                      }
                    ]}
                  >
                    <Text style={[styles.scoreNumber, { color: ourColors.primary }]}>86</Text>
                    <View style={styles.scoreBlurOverlay} />
                  </Animated.View>
                </View>
              ) : (
                <View style={styles.slideIconContainer}>
                  <Text style={[styles.slideIcon, { color: ourColors.primary }]}>
                    {getSvgIcon(slide.icon)}
                  </Text>
                </View>
              )}
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
    width: getResponsiveSize(80),
    height: getResponsiveSize(80),
    alignSelf: 'center',
    marginBottom: getResponsivePadding(20),
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
  slideIcon: {
    fontSize: getResponsiveSize(48),
  },
  aiScoreContainer: {
    alignItems: 'center',
    marginBottom: getResponsivePadding(10),
  },
  scoreCard: {
    width: getResponsiveSize(120),
    height: getResponsiveSize(120),
    borderRadius: getResponsiveSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scoreNumber: {
    fontSize: getResponsiveSize(48),
    fontFamily: 'System',
    fontWeight: '700',
    letterSpacing: -1,
  },
  scoreBlurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: getResponsiveSize(20),
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
