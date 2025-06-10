import {
  MD3LightTheme as DefaultLightTheme,
  MD3DarkTheme as DefaultDarkTheme,
} from 'react-native-paper';

export const expressiveLightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    primary: '#4CAF50', // Green
    secondary: '#A5D6A7', // Light Green
    tertiary: '#C8E6C9', // Light Green
    surface: '#FFFFFF', // White
    background: '#F1F8E9', // Light Green Background
    elevation: {
      level1: '#E8F5E9', // Light Green Elevation
    },
  },
  roundness: 24,
};

export const expressiveDarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    primary: '#4d774f', // Light Green
    secondary: '#A5D6A7', // Light Green
    tertiary: '#C8E6C9', // Light Green
    surface: '#121212', // Dark Background
    background: '#1B1B1B', // Dark Background
    elevation: {
      level1: '#2E7D32', // Dark Green Elevation
    },
  },
  roundness: 24,
};
