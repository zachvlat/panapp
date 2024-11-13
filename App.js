import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import Sport24News from './Sport24News';
import SdnaNews from './SdnaNews';
import GazzettaNews from './GazzettaNews';
import Welcome from './Welcome';
import Leoforos1908News from './Leoforos1908News';

enableScreens();

const Drawer = createDrawerNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Welcome" component={Welcome} />
          <Drawer.Screen name="Sport24 News" component={Sport24News} />
          <Drawer.Screen name="SDNA News" component={SdnaNews} />
          <Drawer.Screen name="Gazzetta News" component={GazzettaNews} />
          <Drawer.Screen name="Leoforos1908 News" component={Leoforos1908News} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
