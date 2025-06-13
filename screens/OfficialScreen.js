import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import OfficialPaoNews from '../components/OfficialPaoNews'

export default function OfficialScreen() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Τελευταία Νέα ΠΑΕ Παναθηναϊκού
      </Text>
      <OfficialPaoNews></OfficialPaoNews>
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
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
});
