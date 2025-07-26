import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';

const BasketballRoster = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://zvcheats.netlify.app/basketballRoster.json')
      .then((response) => {
        const groupedByPosition = response.data.reduce((acc, player) => {
          if (!acc[player.position]) {
            acc[player.position] = [];
          }
          acc[player.position].push(player);
          return acc;
        }, {});
        setData(groupedByPosition);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{`Error: ${error}`}</Text>
      </View>
    );
  }

  const renderPlayer = ({ item }) => (
    <View style={styles.playerItem}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name} (#{item.number})</Text>
        <Text style={styles.playerDetail}>Position: {item.position}</Text>
        <Text style={styles.playerDetail}>Height: {item.height.cm} cm</Text>
        <Text style={styles.playerDetail}>Age: {item.age}</Text>
        <Text style={styles.playerDetail}>Nationality: {item.nationality}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {Object.keys(data).map((position) => (
        <View key={position}>
          <Text style={styles.positionHeader}>{position}</Text>
          <FlatList
            data={data[position]}
            renderItem={renderPlayer}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  positionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'darkgreen',
    marginVertical: 10,
  },
  playerItem: {
    flexDirection: 'row',
    padding: 5,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 5,
    borderColor: 'darkgreen',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  playerDetail: {
    fontSize: 14,
    marginBottom: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerInfo: {
    flex: 1,
  },
});

export default BasketballRoster;
