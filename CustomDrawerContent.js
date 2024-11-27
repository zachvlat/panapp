import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LatestNewsMenu from './LatestNewsMenu';

const CustomDrawerContent = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#082112', paddingTop: 50 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Welcome')}
        style={{ padding: 15 }}
      >
        <Text style={{ color: '#eff8ef', fontSize: 16 }}>Welcome</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('FootballRoster')}
        style={{ padding: 15 }}
      >
        <Text style={{ color: '#eff8ef', fontSize: 16 }}>Football Roster</Text>
      </TouchableOpacity>
      
      <LatestNewsMenu navigation={navigation} />
    </View>
  );
};

export default CustomDrawerContent;
