import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Welcome = () => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    console.log('Hello,', name);
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://tmssl.akamaized.net//images/wappen/head/265.png' }} 
        style={styles.logo} 
      />
      <Text style={styles.title}>Welcome to Panathinaikos News App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#124728',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default Welcome;
