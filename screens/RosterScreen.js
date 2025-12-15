import React, { useState } from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from 'react-native-paper';
import FootballRoster from '../components/FootballRoster';
import BasketballRoster from '../components/BasketballRoster';

const FootballRoute = () => <FootballRoster />;
const BasketballRoute = () => <BasketballRoster />;

const renderScene = SceneMap({
  football: FootballRoute,
  basketball: BasketballRoute,
});

export default function RosterScreen() {
  const { colors } = useTheme();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'football', title: 'Ποδόσφαιρο' },
    { key: 'basketball', title: 'Μπάσκετ' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Rosters
      </Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => <TabBar {...props} style={{backgroundColor: 'darkgreen'}}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
});
