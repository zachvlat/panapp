import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Text,
  Button,
  Card,
  Dialog,
  Portal,
  useTheme,
} from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Panathinaikos Portal
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    marginBottom: 24,
    borderRadius: 24,
  },
  button: {
    marginVertical: 8,
    borderRadius: 24,
  },
});
