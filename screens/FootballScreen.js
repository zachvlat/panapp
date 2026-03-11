import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useTheme, Card } from 'react-native-paper';

export default function FootballScreen({ navigation }) {
  const { colors } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://www.fotmob.com/api/data/teams?id=10200&ccode3=GRC')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error }}>Error: {error}</Text>
      </View>
    );
  }

  const playersIn = data?.transfers?.data?.['Players in'] || [];
  const playersOut = data?.transfers?.data?.['Players out'] || [];
  const trophies = (data?.history?.trophyList || []).filter(t => t.won[0] !== "0");

const titleStyle = { fontSize: 18, fontWeight: 'bold', color: colors.onSurface };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {trophies.length > 0 && (
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Title title="Ιστορία" titleStyle={titleStyle} />
          <Card.Content>
            {trophies.slice(0, 6).map((trophy, index) => (
              <View key={index} style={styles.trophyRow}>
                <Text style={[styles.label, { color: colors.onSurface }]}>{trophy.name[0]}</Text>
                <Text style={[styles.sublabel, { color: colors.secondary }]}> ({trophy.won[0]} τίτλοι)</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {playersIn.length > 0 && (
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Title title="Εισερχόμενοι" titleStyle={titleStyle} />
          <Card.Content>
            {playersIn.map((player, index) => (
              <View key={index} style={styles.transferRow}>
                <Text style={[styles.label, { color: colors.onSurface }]}>→ {player.name}</Text>
                <Text style={[styles.sublabel, { color: colors.secondary }]}> ({player.fromClub})</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {playersOut.length > 0 && (
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Title title="Εξερχόμενοι" titleStyle={titleStyle} />
          <Card.Content>
            {playersOut.map((player, index) => (
              <View key={index} style={styles.transferRow}>
                <Text style={[styles.label, { color: colors.onSurface }]}>← {player.name}</Text>
                <Text style={[styles.sublabel, { color: colors.secondary }]}> ({player.toClub})</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {playersIn.length === 0 && playersOut.length === 0 && (
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.onSurface }}>Δεν υπάρχουν μεταγραφές</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { margin: 10, padding: 5, borderRadius: 0 },
  label: { fontSize: 14, marginBottom: 4 },
  sublabel: { fontSize: 12 },
  transferRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  trophyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
});
