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
  const [selectedProduct, setSelectedProduct] = useState('3_monthly');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  
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

  // Mock products data
  const products = [
    {
      id: 'monthly',
      title: 'Aylık Plan',
      price: '₺49,99',
      period: 'aylık',
      description: 'Aylık abonelik'
    },
    {
      id: '3_monthly',
      title: '3 Aylık Plan',
      price: '₺99,99', 
      period: '3 aylık',
      description: '3 aylık abonelik',
      isBestChoice: true
    },
    {
      id: 'yearly',
      title: 'Yıllık Plan',
      price: '₺199,99',
      period: 'yıllık',
      description: 'Yıllık abonelik'
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

        {/* Pricing Options */}
        <View style={styles.pricingContainer}>
          {products.map((product) => {
            const isSelected = selectedProduct === product.id;
            
            return (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.priceCard,
                  { 
                    backgroundColor: ourColors.surface,
                    borderColor: isSelected ? ourColors.primary : ourColors.border,
                    borderWidth: isSelected ? 2 : 1,
                  }
                ]}
                onPress={() => setSelectedProduct(product.id)}
              >
                {product.isBestChoice && (
                  <View style={[styles.discountBadge, { backgroundColor: ourColors.primary }]}>
                    <Text style={[styles.discountText, { color: ourColors.buttonText }]}>
                      En Popüler
                    </Text>
                  </View>
                )}
                
                <Text style={[styles.priceCardTitle, { color: ourColors.primary }]}>
                  {product.title}
                </Text>
                
                <Text style={[styles.priceCardPrice, { color: ourColors.text }]}>
                  {product.price}
                </Text>
                
                <Text style={[styles.priceCardPeriod, { color: ourColors.textSecondary }]}>
                  {product.period}
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
            Aboneliği Başlat
          </Text>
        </TouchableOpacity>

        {/* Testimonials */}
        <View style={styles.testimonialsSection}>
          <View style={styles.starRatingContainer}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={styles.starIcon}>
                <Text style={styles.starText}>⭐</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.sectionTitle, { color: ourColors.text, marginTop: 12 }]}>
            Kullanıcı Yorumları
          </Text>
          <Text style={[styles.sectionSubtitle, { color: ourColors.textSecondary }]}>
            Binlerce memnun kullanıcı
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.testimonialsScrollView}
            contentContainerStyle={{ paddingHorizontal: getResponsivePadding(20) }}
          >
            {[{
              id: '1',
              stars: 5,
              title: 'Harika Uygulama!',
              text: 'AI özellikler gerçekten çok kullanışlı. Özellikle analiz kısmı çok detaylı.',
              author: 'Ahmet K.',
            },
            {
              id: '2',
              stars: 5,
              title: 'Çok Memnunum',
              text: 'Premium özellikler sayesinde çok daha verimli çalışabiliyorum.',
              author: 'Elif Y.',
            }].map(item => (
              <View key={item.id} style={[styles.testimonialCard, { backgroundColor: ourColors.surface, borderColor: ourColors.border }]}>
                 <Text style={[styles.testimonialTitle, { color: ourColors.text }]}>{item.title}</Text>
                 <View style={styles.starRatingContainerSmall}>
                    {[...Array(item.stars)].map((_, i) => (
                      <View key={i} style={styles.starIconSmall}>
                        <Text style={styles.starTextSmall}>⭐</Text>
                      </View>
                    ))}
                 </View>
                 <Text style={[styles.testimonialText, { color: ourColors.textSecondary }]}>{item.text}</Text>
                 <Text style={[styles.testimonialAuthor, { color: ourColors.text }]}>{item.author}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Comparison Section */}
        <View style={styles.comparisonSection}>
          <Text style={[styles.sectionTitle, { color: ourColors.text, marginBottom: getResponsivePadding(20) }]}>
            Ücretsiz vs Premium
          </Text>
          <View style={styles.comparisonHeader}>
            <Text style={[styles.comparisonHeaderText, { flex: 2 }]}></Text>
            <Text style={[styles.comparisonHeaderText, { color: ourColors.textSecondary, textAlign: 'center' }]}>
              Ücretsiz
            </Text>
            <Text style={[styles.comparisonHeaderText, { color: ourColors.primary, textAlign: 'center' }]}>
              Premium
            </Text>
          </View>
          {[
            { feature: 'Temel AI Chat', free: '✓', pro: '✓' },
            { feature: 'Günlük Mesaj Limiti', free: '10 mesaj', pro: '✓' },
            { feature: 'AI Analiz Raporları', free: 'Sınırlı', pro: '✓' },
            { feature: 'Premium Karakterler', free: '✗', pro: '✓' },
          ].map((item, index) => (
            <View key={index} style={[styles.comparisonRow, { borderBottomColor: ourColors.border }]}>
              <Text style={[styles.comparisonFeature, { color: ourColors.text }]}>{item.feature}</Text>
              <Text style={[styles.comparisonValue, { color: ourColors.textSecondary }]}>{item.free}</Text>
              <Text style={[styles.comparisonValue, { color: ourColors.primary }]}>{item.pro}</Text>
            </View>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: ourColors.text, marginBottom: getResponsivePadding(20) }]}>
            Sıkça Sorulan Sorular
          </Text>
          {[
            { q: 'Premium aboneliği iptal edebilir miyim?', a: 'Evet, istediğiniz zaman iptal edebilirsiniz.' },
            { q: 'Hangi ödeme yöntemleri kabul ediliyor?', a: 'Kredi kartı, banka kartı ve mobil ödeme seçenekleri mevcuttur.' },
            { q: 'Premium özellikler nelerdir?', a: 'Sınırsız mesaj, AI analiz, premium karakterler ve daha fazlası.' },
          ].map((item, index) => (
            <View key={index} style={[styles.faqItem, { backgroundColor: ourColors.surface }]}>
              <TouchableOpacity 
                style={styles.faqQuestion}
                onPress={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
              >
                <Text style={[styles.faqQuestionText, { color: ourColors.text }]}>{item.q}</Text>
                <Text style={[styles.faqChevron, { color: ourColors.textSecondary }]}>
                  {expandedFAQ === index ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {expandedFAQ === index && (
                <View style={styles.faqAnswer}>
                  <Text style={[styles.faqAnswerText, { color: ourColors.textSecondary }]}>{item.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Support Contact */}
        <View style={styles.supportSection}>
          <Text style={[styles.supportQuestion, { color: ourColors.textSecondary }]}>
            Başka sorunuz mu var?
          </Text>
          <Text style={[styles.supportEmail, { color: ourColors.primary }]}>
            destek@globalgpt.com
          </Text>
        </View>

        {/* Footer Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={[styles.footerLink, { color: ourColors.primary }]}>
              Gizlilik Politikası
            </Text>
          </TouchableOpacity>
          <Text style={[styles.footerSeparator, { color: ourColors.textSecondary }]}>
            {' • '}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.footerLink, { color: ourColors.primary }]}>
              Kullanım Şartları
            </Text>
          </TouchableOpacity>
        </View>
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
    width: getResponsiveSize(50),
    height: getResponsiveSize(50),
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
  testimonialsSection: {
    marginTop: getResponsivePadding(40),
    alignItems: 'center',
  },
  starRatingContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginHorizontal: getResponsivePadding(2),
  },
  starText: {
    fontSize: getResponsiveSize(28),
  },
  testimonialsScrollView: {
    marginTop: getResponsivePadding(20),
    marginHorizontal: -getResponsivePadding(20),
  },
  testimonialCard: {
    width: getResponsiveSize(280),
    padding: getResponsivePadding(20),
    borderRadius: getResponsiveSize(16),
    marginRight: getResponsivePadding(12),
    borderWidth: 1,
  },
  testimonialTitle: {
    fontSize: getResponsiveSize(16),
    fontFamily: 'System',
    fontWeight: '700',
  },
  starRatingContainerSmall: {
    flexDirection: 'row',
    marginVertical: getResponsivePadding(8),
  },
  starIconSmall: {
    marginRight: getResponsivePadding(2),
  },
  starTextSmall: {
    fontSize: getResponsiveSize(18),
  },
  testimonialText: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    lineHeight: getResponsiveSize(20),
    flex: 1,
  },
  testimonialAuthor: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    fontWeight: '600',
    marginTop: getResponsivePadding(12),
    textAlign: 'right',
  },
  comparisonSection: {
    marginBottom: getResponsivePadding(40),
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: getResponsivePadding(10),
  },
  comparisonHeaderText: {
    flex: 1,
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    fontWeight: '600',
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getResponsivePadding(12),
    borderBottomWidth: 1,
  },
  comparisonFeature: {
    flex: 2,
    fontSize: getResponsiveSize(15),
    fontFamily: 'System',
  },
  comparisonValue: {
    flex: 1,
    fontSize: getResponsiveSize(16),
    fontFamily: 'System',
    fontWeight: '700',
    textAlign: 'center',
  },
  faqSection: {
    marginBottom: getResponsivePadding(40),
  },
  faqItem: {
    borderRadius: getResponsiveSize(16),
    marginBottom: getResponsivePadding(12),
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: getResponsivePadding(20),
  },
  faqQuestionText: {
    flex: 1,
    fontSize: getResponsiveSize(15),
    fontFamily: 'System',
    fontWeight: '600',
    paddingRight: getResponsivePadding(12),
  },
  faqChevron: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    fontWeight: '600',
  },
  faqAnswer: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    lineHeight: getResponsiveSize(20),
  },
  supportSection: {
    alignItems: 'center',
    marginBottom: getResponsivePadding(20),
  },
  supportQuestion: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: getResponsivePadding(4),
  },
  supportEmail: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    fontWeight: '600',
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    fontWeight: '500',
  },
  footerSeparator: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
  },
});

export default PaywallScreen;
