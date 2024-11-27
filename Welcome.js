import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import logo from './assets/Web-IconKitchen-Output/web/icon-512.png';

const Welcome = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={logo} 
        style={styles.logo} 
      />
      <View style={styles.webviewContainer}>
        <WebView 
          source={{ uri: 'https://zachinvalidation.netlify.app/panapp' }} 
          style={styles.webview} 
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          textZoom={100}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    alignItems: 'center',
    backgroundColor: '#124728',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  webviewContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#124728',
  },
  webview: {
    flex: 1,
    backgroundColor: '#124728',
  },
});


export default Welcome;
