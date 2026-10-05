import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

const BasketballRoster = () => {
  const [rosterData, setRosterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://various-files.vercel.app/basketballRoster.json')
      .then(response => response.json())
      .then(data => {
        setRosterData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching basketball roster:', error);
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
      const n = player.nationality || '';
      return n === 'Greece' || n === '🇬🇷 Greece' || n.includes('🇬🇷') || n.includes('Greece');
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
    const height = dash(item.height?.cm);
    const age = dash(item.age);
    const nationality = dash(item.nationality);

    return (
      <View style={styles.playerItem}>
        {dash(item.number) && (
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{item.number}</Text>
          </View>
        )}
        <View style={styles.playerInfo}>
          <Text style={styles.playerName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.tagRow}>
            {dash(item.position) && <Text style={styles.tag}>{item.position}</Text>}
            {height && <Text style={styles.tag}>{height} cm</Text>}
            {age && <Text style={styles.tag}>{age} ετ.</Text>}
            {nationality && <Text style={styles.tag}>{nationality}</Text>}
          </View>
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
    alignItems: 'center',
    padding: 8,
    marginBottom: 6,
    backgroundColor: '#1E3A18',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  numberBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2E5A26',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  numberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFCC80',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
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
});

export default BasketballRoster;
