import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Sport24News from './Sport24News';
import SdnaNews from './SdnaNews';
import GazzettaNews from './GazzettaNews';
import Welcome from './Welcome';


const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Welcome" component={Welcome} />
        <Drawer.Screen name="Sport24 News" component={Sport24News} />
        <Drawer.Screen name="SDNA News" component={SdnaNews} />
        <Drawer.Screen name="Gazzetta News" component={GazzettaNews} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;