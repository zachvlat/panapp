import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import Sport24News from './Sport24News';
import SdnaNews from './SdnaNews';
import GazzettaNews from './GazzettaNews';
import Welcome from './Welcome';
import Leoforos1908News from './Leoforos1908News';

const Drawer = createDrawerNavigator();

// Custom Drawer Content
const CustomDrawerContent = ({ navigation }) => {
  const [isNewsMenuOpen, setIsNewsMenuOpen] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#082112', paddingTop: 50 }}>
      {/* Main Menu Item */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Welcome')}
        style={{ padding: 15 }}
      >
        <Text style={{ color: '#eff8ef', fontSize: 16 }}>Welcome</Text>
      </TouchableOpacity>

      {/* Latest News Menu */}
      <TouchableOpacity
        onPress={() => setIsNewsMenuOpen(!isNewsMenuOpen)}
        style={{ padding: 15 }}
      >
        <Text style={{ color: '#eff8ef', fontSize: 16 }}>
          Latest News {isNewsMenuOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* Submenu Items */}
      {isNewsMenuOpen && (
        <View style={{ paddingLeft: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Sport24 News')}
            style={{ padding: 10 }}
          >
            <Text style={{ color: '#eff8ef', fontSize: 14 }}>Sport24 News</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SDNA News')}
            style={{ padding: 10 }}
          >
            <Text style={{ color: '#eff8ef', fontSize: 14 }}>SDNA News</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Gazzetta News')}
            style={{ padding: 10 }}
          >
            <Text style={{ color: '#eff8ef', fontSize: 14 }}>Gazzetta News</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Leoforos1908 News')}
            style={{ padding: 10 }}
          >
            <Text style={{ color: '#eff8ef', fontSize: 14 }}>Leoforos1908 News</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#082112' }, // Header bar color
        headerTintColor: '#FFFFFF', // Header text color
      }}
    >
      <Drawer.Screen name="Welcome" component={Welcome} />
      <Drawer.Screen name="Sport24 News" component={Sport24News} />
      <Drawer.Screen name="SDNA News" component={SdnaNews} />
      <Drawer.Screen name="Gazzetta News" component={GazzettaNews} />
      <Drawer.Screen name="Leoforos1908 News" component={Leoforos1908News} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
