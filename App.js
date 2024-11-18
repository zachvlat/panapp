import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import DrawerNavigator from './DrawerNavigator';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

enableScreens();

const drawerTheme = {
  dark: false,
  colors: {
    primary: '#4CAF50', // Green primary
    background: '#F1F8E9', // Light green background
    card: '#388E3C', // Darker green for headers or cards
    text: '#FFFFFF', // White text
    border: '#2E7D32', // Border color
    notification: '#A5D6A7', // Accent green
  },
  fonts: DefaultTheme.fonts || undefined,
};


function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={drawerTheme}>
        <DrawerNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
