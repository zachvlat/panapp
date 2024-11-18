import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Welcome = () => {

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Panathinaikos_F.C._logo.svg/600px-Panathinaikos_F.C._logo.svg.png' }} 
        style={styles.logo} 
      />
      <Text style={styles.title}>Welcome to Panathinaikos News App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '25px',
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
