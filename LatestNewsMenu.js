import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const LatestNewsMenu = ({ navigation }) => {
  const [isNewsMenuOpen, setIsNewsMenuOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsNewsMenuOpen(!isNewsMenuOpen)}
        style={{ padding: 15 }}
      >
        <Text style={{ color: '#eff8ef', fontSize: 16 }}>
          Latest News {isNewsMenuOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {isNewsMenuOpen && (
        <View style={{ paddingLeft: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Sport24 News')}
            style={{ padding: 10 }}
          >
            <Text style={{ color: '#eff8ef', fontSize: 14 }}>Sport24 News</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SDNA News')}
            style={{ padding: 10 }}
          >
            <Text style={{ color: '#eff8ef', fontSize: 14 }}>SDNA News</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Gazzetta News')}
            style={{ padding: 10 }}
          >
            <Text style={{ color: '#eff8ef', fontSize: 14 }}>Gazzetta News</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Leoforos1908 News')}
            style={{ padding: 10 }}
          >
            <Text style={{ color: '#eff8ef', fontSize: 14 }}>Leoforos1908 News</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default LatestNewsMenu;
