import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { NavigationProp } from '@react-navigation/native';
import { colors } from '../theme/colors';

interface TabRoute {
  key: string;
  name: string;
}

interface TabBarState {
  index: number;
  routes: TabRoute[];
}

interface CustomTabBarProps {
  state: TabBarState;
  navigation: NavigationProp<any>;
}

// SVG Icons
const homeIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const chatIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 9H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 13H12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const getIcon = (routeName: string, isFocused: boolean) => {
  const color = isFocused ? colors.accent : colors.textMuted;
  
  switch (routeName) {
    case 'Home':
      return homeIcon.replace(/currentColor/g, color);
    case 'Chat':
      return chatIcon.replace(/currentColor/g, color);
    default:
      return homeIcon.replace(/currentColor/g, color);
  }
};

const getTabLabel = (routeName: string) => {
  switch (routeName) {
    case 'Home':
      return 'Ana Sayfa';
    case 'Chat':
      return 'Sohbet';
    default:
      return routeName;
  }
};

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  const renderTab = (route: TabRoute, index: number) => {
    const isFocused = state.index === index;
    const icon = getIcon(route.name, isFocused);

    const onPress = () => {
      if (!isFocused) {
        navigation.navigate(route.name as never);
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        style={styles.tab}
        activeOpacity={0.7}
      >
        <SvgXml xml={icon} width={24} height={24} />
        <Text style={[
          styles.label, 
          { color: colors.textMuted },
          isFocused && { color: colors.accent, fontWeight: '600' }
        ]}>
          {getTabLabel(route.name)}
        </Text>
        {isFocused && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[
      styles.container,
      {
        paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 25 : 15),
      }
    ]}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => renderTab(route, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -12,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
});

export default CustomTabBar;
