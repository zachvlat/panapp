import {
  MD3LightTheme as DefaultLightTheme,
  MD3DarkTheme as DefaultDarkTheme,
} from 'react-native-paper';

export const expressiveLightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    primary: '#4CAF50',
    secondary: '#A5D6A7',
    tertiary: '#C8E6C9',
    surface: '#FFFFFF',
    background: '#F1F8E9',
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
    primary: '#4d774f',
    secondary: '#A5D6A7',
    tertiary: '#C8E6C9',
    surface: '#121212',
    background: '#1B1B1B',
    elevation: {
      level1: '#2E7D32',
    },
  },
  roundness: 24,
};
