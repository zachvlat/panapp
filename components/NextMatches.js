import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import axios from 'axios';

export default function NextMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  const TEAM_ID = '86';
  const API_KEY = '93afa633823b4ef297368870fd4e9779';

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(
          `https://api.football-data.org/v4/teams/${TEAM_ID}/matches?status=SCHEDULED&limit=3`,
          {
            headers: { 'X-Auth-Token': API_KEY },
          }
        );
        setMatches(res.data.matches);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Upcoming Matches
      </Text>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.matchText}>
                {item.homeTeam.name} vs {item.awayTeam.name}
              </Text>
              <Text style={styles.dateText}>
                {new Date(item.utcDate).toLocaleString()}
              </Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    marginBottom: 10,
  },
  matchText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
