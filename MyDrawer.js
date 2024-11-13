import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import Sport24News from './Sport24News';
// import SdnaNews from './SdnaNews';
// import GazzettaNews from './GazzettaNews';
// import Leoforos1908News from './Leoforos1908News';

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
        {/* <Drawer.Screen name="Sport24 News" component={Sport24News} />
        <Drawer.Screen name="SDNA News" component={SdnaNews} />
        <Drawer.Screen name="Gazzetta News" component={GazzettaNews} />
        <Drawer.Screen name="Leoforos1908 News" component={Leoforos1908News} /> */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default MyDrawer;
