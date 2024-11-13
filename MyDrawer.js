import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#90EE90',
          },
          drawerActiveTintColor: '#FF0000',
          drawerInactiveTintColor: '#008000',
          drawerLabelStyle: {
            fontSize: 38,
            fontWeight: 'bold',
            color: '#0000FF',
          },
        }}
      >
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default MyDrawer;
