import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import axios from 'axios';
import { Card, Text, List, ActivityIndicator, useTheme } from 'react-native-paper';

const FootballRoster = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { colors } = useTheme();

  useEffect(() => {
    // Fetch data from the JSON URL
    axios.get('https://raw.githubusercontent.com/zachvlat/various-files/refs/heads/master/footballroster.json')
      .then((response) => {
        setData(response.data);
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
        <ActivityIndicator size="large" color={colors.primary} />
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

  return (
    <ScrollView style={styles.container}>
      {data?.players?.map((player, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Text style={styles.playerName}>{player.name}</Text>
            <List.Item
              title="Position"
              description={player.position}
              left={() => <List.Icon icon="account" />}
            />
            <List.Item
              title="Age"
              description={player.age}
              left={() => <List.Icon icon="calendar" />}
            />
            <List.Item
              title="Team"
              description={player.team}
              left={() => <List.Icon icon="football" />}
            />
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
});

export default FootballRoster;
