import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';

const FootballRoster = () => {
  const [rosterData, setRosterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://various-files.vercel.app/footballroster.json')
      .then(response => response.json())
      .then(data => {
        setRosterData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching football roster:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </ScrollView>
    );
  }

  const data = rosterData.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {});

  const calculateStats = () => {
    const allPlayers = Object.values(data).flat();
    const greekPlayers = allPlayers.filter(player => {
      const c = player.country || '';
      return c === 'Greece' || c === '🇬🇷 Greece' || c.includes('🇬🇷') || c.includes('Greece');
    });
    const greekPercentage = allPlayers.length
      ? ((greekPlayers.length / allPlayers.length) * 100).toFixed(1)
      : '0.0';

    const ages = allPlayers.map(player => parseInt(player.age)).filter(Number.isFinite).sort((a, b) => a - b);
    const medianAge = ages.length % 2 === 0
      ? ((ages[ages.length / 2 - 1] + ages[ages.length / 2]) / 2).toFixed(1)
      : ages[Math.floor(ages.length / 2)];
    
    return { greekPercentage, medianAge, totalPlayers: allPlayers.length };
  };

  const stats = calculateStats();

  const dash = (v) => (v === null || v === undefined || v === '' || v === '-' ? null : v);

  const renderPlayer = ({ item }) => {
    const height = dash(item.height);
    const foot = dash(item.foot);
    const value = dash(item.value);
    const country = dash(item.country);
    const age = dash(item.age);

    return (
      <View style={styles.playerItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.playerImage} resizeMode="contain" />
        <View style={styles.playerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.playerName} numberOfLines={1}>{item.name}</Text>
            {value && <Text style={styles.playerValue}>{value}</Text>}
          </View>

          <View style={styles.tagRow}>
            {dash(item.position) && <Text style={styles.tag}>{item.position}</Text>}
            {height && <Text style={styles.tag}>{height}</Text>}
            {age && <Text style={styles.tag}>{age} ετ.</Text>}
            {foot && <Text style={styles.tag}>{foot === 'left' ? 'Αριστερό' : 'Δεξιό'}</Text>}
          </View>

          {(country || item.contractEnds) && (
            <Text style={styles.playerDetail} numberOfLines={1}>
              {country ? `${country} · ` : ''}
              {item.contractEnds ? `Συμβόλαιο έως ${item.contractEnds}` : ''}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalPlayers}</Text>
          <Text style={styles.statLabel}>Σύνολο παικτών</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.greekPercentage}%</Text>
          <Text style={styles.statLabel}>Ποσοστό Ελλήνων</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.medianAge}</Text>
          <Text style={styles.statLabel}>Μέση Ηλικία</Text>
        </View>
      </View>
      {Object.keys(data).map((position) =>
        data[position].map((player, i) => (
          <View key={`${position}-${i}`}>
            {i === 0 && <Text style={styles.positionHeader}>{position}</Text>}
            {renderPlayer({ item: player })}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1E3A18',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2E5A26',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8BC34A',
  },
  statLabel: {
    fontSize: 11,
    color: '#A5C99A',
    marginTop: 2,
  },
  positionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8BC34A',
    marginTop: 14,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  playerItem: {
    flexDirection: 'row',
    padding: 8,
    marginBottom: 6,
    backgroundColor: '#1E3A18',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  playerImage: {
    width: 56,
    height: 56,
    marginRight: 10,
    backgroundColor: '#16300F',
    borderRadius: 8,
  },
  playerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  playerValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8BC34A',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 3,
  },
  tag: {
    fontSize: 11,
    color: '#C8E6C9',
    backgroundColor: '#2E5A26',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 5,
    marginTop: 2,
    overflow: 'hidden',
  },
  playerDetail: {
    fontSize: 12,
    color: '#A5C99A',
  },
  });

export default FootballRoster;
