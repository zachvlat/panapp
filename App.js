import React from 'react';
import { useColorScheme, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { expressiveLightTheme, expressiveDarkTheme } from './theme';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import NewsScreen from './screens/NewsScreen';
import RosterScreen from './screens/RosterScreen';
import StandingsScreen from './screens/StandingsScreen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import TopBar from './components/TopBar';

const Tab = createBottomTabNavigator();

function TabNavigator(theme) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: '#fff',
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: theme.colors.surface,
        },
      }}
    >
      <Tab.Screen
        name="Αρχική"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Νέα"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="newspaper" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ρόστερ"
        component={RosterScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="soccer-field" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Βαθμολογίες"
        component={StandingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="table" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? expressiveDarkTheme : expressiveLightTheme;
  const navTheme = colorScheme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;
  const insets = useSafeAreaInsets();

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: theme.colors.background }}>
        <TopBar />
        <NavigationContainer theme={{ ...navTheme, colors: { ...navTheme.colors, background: theme.colors.background } }}>
          {TabNavigator(theme)}
        </NavigationContainer>
      </View>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}