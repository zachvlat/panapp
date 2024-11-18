import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Sport24News from './Sport24News';
import SdnaNews from './SdnaNews';
import GazzettaNews from './GazzettaNews';
import Welcome from './Welcome';
import Leoforos1908News from './Leoforos1908News';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#082112' }, // Header bar color
      headerTintColor: '#FFFFFF', // Header text color
      drawerStyle: {
        backgroundColor: '#082112', // Drawer background color
      },
      drawerLabelStyle: {
        color: '#eff8ef', // Drawer item text color
      },
      drawerActiveTintColor: '#FFFFFF', // Active item text color
      drawerActiveBackgroundColor: '#388E3C', // Active item background
      drawerInactiveTintColor: '#2E7D32', // Inactive item text color
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