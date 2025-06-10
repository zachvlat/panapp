import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import FootballRoster from '../components/FootballRoster'

export default function SettingsScreen() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <FootballRoster></FootballRoster>
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
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
});
