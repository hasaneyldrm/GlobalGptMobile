import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../services/ThemeContext';

// Responsive boyutlar için yardımcı fonksiyonlar
const { width, height } = Dimensions.get('window');
const wp = (percentage: number) => {
  return width * (percentage / 100);
};

const hp = (percentage: number) => {
  return height * (percentage / 100);
};

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const Content = styled(View)`
  flex: 1;
  padding: ${hp(3)}px ${wp(6)}px;
`;

const Header = styled(View)`
  margin-bottom: ${hp(4)}px;
`;

const Title = styled(Text)`
  font-size: ${wp(7)}px;
  font-weight: 700;
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: ${hp(1)}px;
`;

const Subtitle = styled(Text)`
  font-size: ${wp(4)}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  line-height: ${wp(6)}px;
`;

const ThemeSection = styled(View)`
  margin-bottom: ${hp(4)}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${wp(5)}px;
  font-weight: 600;
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: ${hp(2)}px;
`;

const ThemeOption = styled(TouchableOpacity)<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }: any) => theme.colors.card};
  border: 2px solid ${({ theme, isSelected }: any) => 
    isSelected ? theme.colors.primary : theme.colors.cardBorder};
  border-radius: 16px;
  padding: ${hp(2)}px ${wp(4)}px;
  margin-bottom: ${hp(1.5)}px;
`;

const ThemeOptionLeft = styled(View)`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const ThemeIcon = styled(View)<{ backgroundColor: string }>`
  width: ${wp(8)}px;
  height: ${wp(8)}px;
  border-radius: ${wp(4)}px;
  background-color: ${({ backgroundColor }: any) => backgroundColor};
  margin-right: ${wp(3)}px;
`;

const ThemeOptionText = styled(View)`
  flex: 1;
`;

const ThemeOptionTitle = styled(Text)`
  font-size: ${wp(4.5)}px;
  font-weight: 600;
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: 2px;
`;

const ThemeOptionDescription = styled(Text)`
  font-size: ${wp(3.5)}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
`;

const RadioButton = styled(View)<{ isSelected: boolean }>`
  width: ${wp(5)}px;
  height: ${wp(5)}px;
  border-radius: ${wp(2.5)}px;
  border: 2px solid ${({ theme, isSelected }: any) => 
    isSelected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, isSelected }: any) => 
    isSelected ? theme.colors.primary : 'transparent'};
  align-items: center;
  justify-content: center;
`;

const RadioButtonInner = styled(View)<{ isSelected: boolean }>`
  width: ${wp(2)}px;
  height: ${wp(2)}px;
  border-radius: ${wp(1)}px;
  background-color: ${({ theme, isSelected }: any) => 
    isSelected ? theme.colors.buttonText : 'transparent'};
`;

const ColorPreview = styled(View)`
  margin-bottom: ${hp(3)}px;
`;

const ColorGrid = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ColorCard = styled(View)`
  width: ${wp(20)}px;
  height: ${hp(8)}px;
  border-radius: 12px;
  margin-bottom: ${hp(1)}px;
  align-items: center;
  justify-content: center;
`;

const ColorName = styled(Text)`
  font-size: ${wp(2.5)}px;
  font-weight: 500;
  color: ${({ theme }: any) => theme.colors.buttonText};
  margin-top: 4px;
`;

const ResetButton = styled(TouchableOpacity)`
  background-color: ${({ theme }: any) => theme.colors.error};
  padding: ${hp(1.5)}px ${wp(6)}px;
  border-radius: 12px;
  align-items: center;
  margin-top: ${hp(2)}px;
`;

const ResetButtonText = styled(Text)`
  color: ${({ theme }: any) => theme.colors.buttonText};
  font-size: ${wp(4)}px;
  font-weight: 600;
`;

interface Props {
  navigation?: any;
}

const ThemeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, currentTheme, setTheme, colors } = useTheme();

  const themeOptions = [
    {
      key: 'dark' as const,
      title: 'Koyu Tema',
      description: 'Gözlerinizi korur ve bataryadan tasarruf sağlar',
      icon: '#1C1C1E',
    },
    {
      key: 'light' as const,
      title: 'Açık Tema',
      description: 'Klasik ve temiz görünüm',
      icon: '#FFFFFF',
    },
    {
      key: 'system' as const,
      title: 'Sistem',
      description: 'Cihazınızın tema ayarını takip eder',
      icon: currentTheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
    },
  ];

  const handleThemeChange = (selectedTheme: 'light' | 'dark' | 'system') => {
    setTheme(selectedTheme);
  };

  const handleReset = () => {
    setTheme('dark'); // Varsayılan olarak dark tema
  };

  const colorPreviewItems = [
    { name: 'Primary', color: colors.primary },
    { name: 'Surface', color: colors.surface },
    { name: 'Card', color: colors.card },
    { name: 'Success', color: colors.success },
    { name: 'Error', color: colors.error },
    { name: 'Text', color: colors.text },
  ];

  return (
    <Container theme={{ colors }}>
      <StatusBar 
        barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      <Content>
        <Header>
          <Title theme={{ colors }}>Tema Ayarları</Title>
          <Subtitle theme={{ colors }}>
            Uygulamanın görünümünü kişiselleştirin. Değişiklikler anında uygulanır.
          </Subtitle>
        </Header>

        <ThemeSection>
          <SectionTitle theme={{ colors }}>Tema Seçimi</SectionTitle>
          {themeOptions.map((option) => (
            <ThemeOption
              key={option.key}
              isSelected={theme === option.key}
              onPress={() => handleThemeChange(option.key)}
              theme={{ colors }}
            >
              <ThemeOptionLeft>
                <ThemeIcon backgroundColor={option.icon} />
                <ThemeOptionText>
                  <ThemeOptionTitle theme={{ colors }}>
                    {option.title}
                  </ThemeOptionTitle>
                  <ThemeOptionDescription theme={{ colors }}>
                    {option.description}
                  </ThemeOptionDescription>
                </ThemeOptionText>
              </ThemeOptionLeft>
              <RadioButton isSelected={theme === option.key} theme={{ colors }}>
                <RadioButtonInner isSelected={theme === option.key} theme={{ colors }} />
              </RadioButton>
            </ThemeOption>
          ))}
        </ThemeSection>

        <ColorPreview>
          <SectionTitle theme={{ colors }}>Renk Önizlemesi</SectionTitle>
          <ColorGrid>
            {colorPreviewItems.map((item, index) => (
              <ColorCard key={index} style={{ backgroundColor: item.color }}>
                <ColorName theme={{ colors }}>{item.name}</ColorName>
              </ColorCard>
            ))}
          </ColorGrid>
        </ColorPreview>

        <ResetButton onPress={handleReset} theme={{ colors }}>
          <ResetButtonText theme={{ colors }}>
            Varsayılan Ayarlara Dön
          </ResetButtonText>
        </ResetButton>
      </Content>
    </Container>
  );
};

export default ThemeScreen;
