import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet } from 'react-native';
import Sport24News from './Sport24News';
import SdnaNews from './SdnaNews';
import GazzettaNews from './GazzettaNews';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerStyle={styles.drawerStyle}
        drawerContentOptions={{
          activeTintColor: 'white', // Active item text color
          inactiveTintColor: 'white', // Inactive item text color
          labelStyle: styles.drawerLabel,
        }}
      >
        <Drawer.Screen name="Sport24 News" component={Sport24News} />
        <Drawer.Screen name="SDNA News" component={SdnaNews} />
        <Drawer.Screen name="Gazzetta News" component={GazzettaNews} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerStyle: {
    backgroundColor: '#90EE90', // Light green background color
  },
  drawerLabel: {
    color: 'white', // White text color
  },
});

export default MyDrawer;
