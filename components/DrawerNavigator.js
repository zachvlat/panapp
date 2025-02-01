import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import Sport24News from './Sport24News';
import SdnaNews from './SdnaNews';
import GazzettaNews from './GazzettaNews';
import Welcome from './Welcome';
import Leoforos1908News from './Leoforos1908News';
import FootballRoster from './FootballRoster'
import InPaoNews from './InPaoNews';

const Drawer = createDrawerNavigator();

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
      <Drawer.Screen name="Football Team" component={FootballRoster} />
      <Drawer.Screen name="Leoforos1908 News" component={Leoforos1908News} />
      <Drawer.Screen name="InPao News" component={InPaoNews} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
