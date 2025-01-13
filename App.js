import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import DrawerNavigator from './components/DrawerNavigator';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

enableScreens();

const drawerTheme = {
  dark: false,
  colors: {
    primary: '#4CAF50',
    background: '#124728', // Match Welcome component background color
    card: '#388E3C',
    text: '#FFFFFF',
    border: '#2E7D32',
    notification: '#A5D6A7',
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
