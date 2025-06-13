import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text,  useTheme } from 'react-native-paper';
import NextMatches from '../components/NextMatches';
import Logo from '../assets/pao.svg';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Logo width={150} height={150} />
      <Text style={[styles.title, { color: colors.primary }]}>
        Green Portal
      </Text>
      <NextMatches />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
});
