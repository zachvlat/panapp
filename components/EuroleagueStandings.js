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
import { SvgUri } from 'react-native-svg';

const EUROLEAGUE_URL = "https://www.gazzetta.gr/gztfeeds/standings/league/151";

export default function EuroleagueStandings() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEuroleagueStandings();
  }, []);

  const fetchEuroleagueStandings = async () => {
    try {
      const response = await fetch(EUROLEAGUE_URL, {
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
      setError('Failed to load Euroleague standings. Please try again later.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getZoneColor = (zoneClass) => {
    switch (zoneClass) {
      case 'play-offs':
        return '#1e2ddc';
      case 'play-in-showdown':
        return '#50e0e0';
      default:
        return 'transparent';
    }
  };

  const renderTeam = (team) => {
    const stats = {};
    team.columns.forEach(col => Object.assign(stats, col));
    const isPanathinaikos = team.team_name.includes("Panathinaikos");

    return (
      <DataTable.Row 
        key={team.rank} 
        style={[styles.row, isPanathinaikos && styles.panathinaikosRow]}>
        <DataTable.Cell numeric style={styles.rankCell}>{team.rank}</DataTable.Cell>
        <DataTable.Cell style={styles.teamCell}>
          <View style={styles.teamContainer}>
            {team.team_logo ? (
              team.team_logo.endsWith('.svg') ? (
                <SvgUri 
                  uri={`https://www.gazzetta.gr${team.team_logo}`} 
                  style={styles.teamLogo}
                />
              ) : (
                <Image 
                  source={{ uri: `https://www.gazzetta.gr${team.team_logo}` }} 
                  style={styles.teamLogo}
                />
              )
            ) : null}
            <Text style={styles.teamName}>{team.team_name}</Text>
          </View>
        </DataTable.Cell>
        <DataTable.Cell numeric>{stats.MP}</DataTable.Cell>
        <DataTable.Cell numeric>{stats.W}</DataTable.Cell>
        <DataTable.Cell numeric>{stats.L}</DataTable.Cell>
        {/* <DataTable.Cell numeric>{stats['Pts S']}</DataTable.Cell>
        <DataTable.Cell numeric>{stats['Pts A']}</DataTable.Cell> */}
        {/* <DataTable.Cell numeric>{stats.PD}</DataTable.Cell> */}
        {/* <DataTable.Cell numeric><Text style={[styles.points, { color: 'orange' }]}>{stats['%']}</Text></DataTable.Cell> */}
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
      <Text style={styles.title}>Euroleague</Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title numeric style={styles.rankCell}>#</DataTable.Title>
          <DataTable.Title style={styles.teamCell}>Ομάδα</DataTable.Title>
          <DataTable.Title numeric>Αγ.</DataTable.Title>
          <DataTable.Title numeric>Ν</DataTable.Title>
          <DataTable.Title numeric>Η</DataTable.Title>
          {/* <DataTable.Title numeric>Περισ</DataTable.Title>
          <DataTable.Title numeric>Συνολ</DataTable.Title>
          <DataTable.Title numeric>Δτ</DataTable.Title> */}
          {/* <DataTable.Title numeric>%</DataTable.Title> */}
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
  panathinaikosText: {
    color: '#00ff00',
    fontWeight: 'bold',
  },
  rankCell: {
    width: 30,
    justifyContent: 'flex-start',
  },
  teamCell: {
    flex: 3,
    minWidth: 190,
  },
  points: {
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  row: {
    backgroundColor: 'transparent',
  },
  panathinaikosRow: {
    backgroundColor: 'darkgreen',
  }
});