import {
  MD3LightTheme as DefaultLightTheme,
  MD3DarkTheme as DefaultDarkTheme,
} from 'react-native-paper';

export const expressiveLightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    primary: '#66BB6A',
    secondary: '#A5D6A7',
    tertiary: '#C8E6C9',
    surface: '#1E2F1A',
    background: '#162211',
    onSurface: '#FFFFFF',
    elevation: {
      level1: '#E8F5E9',
    },
  },
  roundness: 24,
};

export const expressiveDarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    primary: '#66BB6A',
    secondary: '#A5D6A7',
    tertiary: '#C8E6C9',
    surface: '#1E2F1A',
    background: '#162211',
    onSurface: '#FFFFFF',
    elevation: {
      level1: '#2E7D32',
    },
  },
  roundness: 24,
};
