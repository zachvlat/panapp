import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Sport24News from './Sport24News';
import SdnaNews from './SdnaNews';
import GazzettaNews from './GazzettaNews';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#90EE90',  // Set background color of the drawer
          },
          drawerActiveTintColor: '#FF0000',  // Active label color inline
          drawerInactiveTintColor: '#008000',  // Inactive label color inline
          drawerLabelStyle: {
            fontSize: 18,  // Label font size
            fontWeight: 'bold',  // Font weight for labels
            color: '#0000FF',  // Label font color inline
          },
        }}
      >
        <Drawer.Screen name="Sport24 News" component={Sport24News} />
        <Drawer.Screen name="SDNA News" component={SdnaNews} />
        <Drawer.Screen name="Gazzetta News" component={GazzettaNews} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default MyDrawer;
