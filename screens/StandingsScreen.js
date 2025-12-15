import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { DataTable } from 'react-native-paper';

const STANDINGS_URL = "https://www.gazzetta.gr/gztfeeds/standings/league/2186";

export default function StandingsScreen() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      const response = await fetch(STANDINGS_URL, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const participants = data[0].body.participant;
      setStandings(participants);
    } catch (err) {
      setError('Failed to load standings. Please try again later.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderTeam = (team) => {
    const stats = {};
    team.columns.forEach(col => Object.assign(stats, col));

    return (
      <DataTable.Row key={team.rank}>
        <DataTable.Cell numeric style={styles.rankCell}>{team.rank}</DataTable.Cell>
        <DataTable.Cell style={styles.teamCell}>
          <View style={styles.teamContainer}>
            <Image 
              source={{ uri: `https://www.gazzetta.gr${team.team_logo}` }} 
              style={styles.teamLogo}
            />
            <Text style={styles.teamName}>{team.team_name}</Text>
          </View>
        </DataTable.Cell>
        <DataTable.Cell numeric>{stats.MP}</DataTable.Cell>
        <DataTable.Cell numeric>{stats.W}</DataTable.Cell>
        <DataTable.Cell numeric>{stats.D}</DataTable.Cell>
        <DataTable.Cell numeric>{stats.L}</DataTable.Cell>
        <DataTable.Cell numeric>{stats.GS}</DataTable.Cell>
        <DataTable.Cell numeric>{stats.GA}</DataTable.Cell>
        <DataTable.Cell numeric>{stats.GD}</DataTable.Cell>
        <DataTable.Cell numeric><Text style={styles.points}>{stats.Pts}</Text></DataTable.Cell>
      </DataTable.Row>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Super League</Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title numeric style={styles.rankCell}>#</DataTable.Title>
          <DataTable.Title style={styles.teamCell}>Ομάδα</DataTable.Title>
          <DataTable.Title numeric>Αγ.</DataTable.Title>
          <DataTable.Title numeric>Ν</DataTable.Title>
          <DataTable.Title numeric>Ι</DataTable.Title>
          <DataTable.Title numeric>Η</DataTable.Title>
          <DataTable.Title numeric>ΓΥ</DataTable.Title>
          <DataTable.Title numeric>ΓΚ</DataTable.Title>
          <DataTable.Title numeric>Δτ</DataTable.Title>
          <DataTable.Title numeric>Β</DataTable.Title>
        </DataTable.Header>
        {standings.map(renderTeam)}
      </DataTable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: 'white',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamLogo: {
    width: 22,
    height: 22,
  },
  teamName: {
    fontSize: 12,
    color: 'white',
    flex: 1,
    flexWrap: 'wrap',
  },
  rankCell: {
    width: 30,
    justifyContent: 'flex-start',
  },
  teamCell: {
    flex: 3,
    minWidth: 120,
  },
  points: {
    fontWeight: 'bold',
    color: 'white',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});