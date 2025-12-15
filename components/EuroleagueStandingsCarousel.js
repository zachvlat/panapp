import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SvgUri } from 'react-native-svg';

const { width } = Dimensions.get('window');

const EUROLEAGUE_URL = "https://www.gazzetta.gr/gztfeeds/standings/league/151";

export default function EuroleagueStandingsCarousel() {
  const { colors } = useTheme();
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

  const renderStandingCard = (team) => {
    const stats = {};
    team.columns.forEach(col => Object.assign(stats, col));
    const isPanathinaikos = team.team_name.includes("Panathinaikos");

    return (
      <View key={team.rank} style={[styles.standingCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={[styles.rankContainer, { backgroundColor: getZoneColor(team.zone_class) }]}>
          <Text style={styles.rankText}>{team.rank}</Text>
        </View>
        
        <View style={styles.teamContainer}>
          {team.team_logo ? (
            team.team_logo.endsWith('.svg') ? (
              <SvgUri 
                uri={`https://www.gazzetta.gr${team.team_logo}`} 
                style={isPanathinaikos ? styles.panathinaikosLogo : styles.teamLogo}
              />
            ) : (
              <Image 
                source={{ uri: `https://www.gazzetta.gr${team.team_logo}` }} 
                style={styles.teamLogo}
                resizeMode="contain"
              />
            )
          ) : null}
          <Text style={[styles.teamName, { color: colors.onSurface }, isPanathinaikos && styles.panathinaikosText]} numberOfLines={2}>
            {team.team_name}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.onSurface }]}>Αγ</Text>
              <Text style={[styles.statValue, { color: colors.onSurface }]}>{stats.MP}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.onSurface }]}>Ν</Text>
              <Text style={[styles.statValue, { color: 'green' }]}>{stats.W}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.onSurface }]}>Η</Text>
              <Text style={[styles.statValue, { color: 'red' }]}>{stats.L}</Text>
            </View>
          </View>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.onSurface }]}>Περισ</Text>
              <Text style={[styles.statValue, { color: colors.onSurface }]}>{stats['Pts S']}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.onSurface }]}>Συνολ</Text>
              <Text style={[styles.statValue, { color: colors.onSurface }]}>{stats['Pts A']}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.onSurface }]}>Δτ</Text>
              <Text style={[styles.statValue, { color: colors.onSurface }]}>{stats.PD}</Text>
            </View>
          </View>

          <View style={styles.percentageContainer}>
            <Text style={[styles.percentageLabel, { color: colors.onSurface }]}>%</Text>
            <Text style={[styles.percentageValue, { color: colors.primary, fontWeight: 'bold' }]}>
              {stats['%']}
            </Text>
          </View>
        </View>

        {team.zone_name && (
          <View style={[styles.zoneBadge, { backgroundColor: getZoneColor(team.zone_class) }]}>
            <Text style={styles.zoneText}>{team.zone_name}</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  if (standings.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Euroleague Κατάταξη
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      >
        {standings.slice(0, 10).map(renderStandingCard)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  carouselContainer: {
    paddingHorizontal: 8,
  },
  standingCard: {
    width: width * 0.65,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  panathinaikosLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
  },
  panathinaikosText: {
    color: 'darkgreen',
    fontWeight: 'bold',
  },
  statsContainer: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  percentageLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  percentageValue: {
    fontSize: 16,
  },
  zoneBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'center',
  },
  zoneText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  error: {
    textAlign: 'center',
    fontSize: 16,
  },
});