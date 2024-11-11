import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Welcome = () => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    console.log('Hello,', name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Panathinaikos News App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#124728',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
});

export default Welcome;