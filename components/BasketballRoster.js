import React from 'react';
import { ScrollView, StyleSheet, View, Text, FlatList } from 'react-native';

const basketballRosterData = [
  {
    {
    "number": "-",
    "name": "Nigel Hayes-Davis",
    "height": {
      "cm": "201",
      "inches": "6'7''"
    },
    "position": "PF",
    "age": "31",
    "nationality": "🇺🇸",
    "fromYear": "2026",
    "toYear": "2029",
    "formerTeam": {
      "name": "Phoenix Suns",
      "country": "🇺🇸"
    },
    "agent": "-"
  },
    "number": "0",
    "name": "TJ Shorts",
    "height": {
      "cm": "175",
      "inches": "5'9''"
    },
    "position": "PG",
    "age": "27",
    "nationality": "🇺🇸",
    "fromYear": "2025",
    "toYear": "2026",
    "formerTeam": {
      "name": "Paris",
      "country": "🇫🇷"
    },
    "agent": "N.Spanos"
  },
  {
    "number": "16",
    "name": "Cedi Osman",
    "height": {
      "cm": "203",
      "inches": "6'8''"
    },
    "position": "F",
    "age": "30",
    "nationality": "🇹🇷",
    "fromYear": "2024",
    "toYear": "2026",
    "formerTeam": {
      "name": "San Antonio S.",
      "country": "🇺🇸"
    },
    "agent": "IstBasket"
  },
  {
    "number": "44",
    "name": "Kostas Mitoglou",
    "height": {
      "cm": "210",
      "inches": "6'11''"
    },
    "position": "F/C",
    "age": "29",
    "nationality": "🇬🇷",
    "fromYear": "2023",
    "toYear": "2026",
    "formerTeam": {
      "name": "Milano",
      "country": "🇮🇹"
    },
    "agent": "J.Ranne"
  },
  {
    "number": "27",
    "name": "Vasileios Toliopoulos",
    "height": {
      "cm": "188",
      "inches": "6'2''"
    },
    "position": "PG",
    "age": "29",
    "nationality": "🇬🇷",
    "fromYear": "2025",
    "toYear": "2026",
    "formerTeam": {
      "name": "Aris Midea",
      "country": ""
    },
    "agent": "M.Olympios"
  },
  {
    "number": "25",
    "name": "Kendrick Nunn",
    "height": {
      "cm": "194",
      "inches": "6'5''"
    },
    "position": "SG",
    "age": "30",
    "nationality": "🇺🇸",
    "fromYear": "2023",
    "toYear": "2026",
    "formerTeam": {
      "name": "Washington W.",
      "country": "🇺🇸"
    },
    "agent": "S.Galijasevic"
  },
  {
    "number": "22",
    "name": "Jerian Grant",
    "height": {
      "cm": "196",
      "inches": "6'5''"
    },
    "position": "G",
    "age": "32",
    "nationality": "🇺🇸",
    "fromYear": "2023",
    "toYear": "2026",
    "formerTeam": {
      "name": "Turk Telekom",
      "country": "🇹🇷"
    },
    "agent": "J.Ranne"
  },
  {
    "number": "10",
    "name": "Kostas Sloukas",
    "height": {
      "cm": "190",
      "inches": "6'3''"
    },
    "position": "PG",
    "age": "35",
    "nationality": "🇬🇷",
    "fromYear": "2023",
    "toYear": "2026",
    "formerTeam": {
      "name": "Fenerbahce",
      "country": "🇹🇷"
    },
    "agent": "P.Kapazoglou"
  },
  {
    "number": "26",
    "name": "Mathias Lessort",
    "height": {
      "cm": "206",
      "inches": "6'9''"
    },
    "position": "C",
    "age": "29",
    "nationality": "🇫🇷",
    "fromYear": "2023",
    "toYear": "2026",
    "formerTeam": {
      "name": "Partizan",
      "country": "🇷🇸"
    },
    "agent": "D.Carro"
  },
  {
    "number": "41",
    "name": "Juancho Hernangomez",
    "height": {
      "cm": "206",
      "inches": "6'9''"
    },
    "position": "PF",
    "age": "29",
    "nationality": "🇪🇸",
    "fromYear": "2023",
    "toYear": "2026",
    "formerTeam": {
      "name": "Toronto R.",
      "country": "🇺🇸"
    },
    "agent": "I.Crespo"
  },
  {
    "number": "23",
    "name": "Ioannis Kouzeloglou",
    "height": {
      "cm": "206",
      "inches": "6'9''"
    },
    "position": "PF",
    "age": "30",
    "nationality": "🇬🇷",
    "fromYear": "2025",
    "toYear": "2026",
    "formerTeam": {
      "name": "Burgos SP",
      "country": "🇪🇸"
    },
    "agent": "A.Papasiopis"
  },
  {
    "number": "20",
    "name": "Alexandros Samodurov",
    "height": {
      "cm": "211",
      "inches": "6'11''"
    },
    "position": "F/C",
    "age": "20",
    "nationality": "🇬🇷",
    "fromYear": "2023",
    "toYear": "2026",
    "formerTeam": {
      "name": "Panerythraikos",
      "country": ""
    },
    "agent": "N.Lotsos"
  },
  {
    "number": "0",
    "name": "Panagiotis Kalaitzakis",
    "height": {
      "cm": "200",
      "inches": "6'7''"
    },
    "position": "G/F",
    "age": "26",
    "nationality": "🇬🇷",
    "fromYear": "2022",
    "toYear": "2026",
    "formerTeam": {
      "name": "Lietkabelis",
      "country": "🇱🇹"
    },
    "agent": "M.Rutkauskas"
  },
  {
    "number": "77",
    "name": "Omer Yurtseven",
    "height": {
      "cm": "213",
      "inches": "7'0''"
    },
    "position": "C",
    "age": "27",
    "nationality": "🇹🇷",
    "fromYear": "2024",
    "toYear": "2025",
    "formerTeam": {
      "name": "Utah Jazz",
      "country": "🇺🇸"
    },
    "agent": "K.Glass"
  },
  {
    "number": "40",
    "name": "Marius Grigonis",
    "height": {
      "cm": "198",
      "inches": "6'6''"
    },
    "position": "F/G",
    "age": "31",
    "nationality": "🇱🇹",
    "fromYear": "2022",
    "toYear": "2025",
    "formerTeam": {
      "name": "CSKA",
      "country": ""
    },
    "agent": "D.Baziukas"
  },
  {
    "number": "17",
    "name": "Nikolaos Rogkavopoulos",
    "height": {
      "cm": "200",
      "inches": "6'7''"
    },
    "position": "SF",
    "age": "24",
    "nationality": "🇬🇷",
    "fromYear": "2025",
    "toYear": "2025",
    "formerTeam": {
      "name": "Baskonia",
      "country": "🇪🇸"
    },
    "agent": ""
  },
    {
    "number": "8",
    "name": "Richaun Holmes",
    "height": {
      "cm": "208",
      "inches": "6'8''"
    },
    "position": "C",
    "age": "31",
    "nationality": "🇺🇸",
    "fromYear": "2025",
    "toYear": "2025",
    "formerTeam": {
      "name": "Washington Wizards",
      "country": "🇺🇸"
    },
    "agent": "R.Beda"
  },
  {
    "number": "35",
    "name": "Kenneth Faried",
    "height": {
      "cm": "203",
      "inches": "6'8''"
    },
    "position": "C",
    "age": "36",
    "nationality": "🇺🇸",
    "fromYear": "2025",
    "toYear": "2026",
    "formerTeam": {
      "name": "Ghosthawks",
      "country": "🇹🇼"
    },
    "agent": "M.Frankel"
  }
];

const BasketballRoster = () => {
  // Group players by position
  const data = basketballRosterData.reduce((acc, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player);
    return acc;
  }, {});

  // Calculate stats
  const calculateStats = () => {
    const allPlayers = Object.values(data).flat();
    const greekPlayers = allPlayers.filter(player => 
      player.nationality === 'Greece' || player.nationality === '🇬🇷 Greece' || player.nationality.includes('🇬🇷')
    );
    const greekPercentage = ((greekPlayers.length / allPlayers.length) * 100).toFixed(1);
    
    const ages = allPlayers.map(player => parseInt(player.age)).sort((a, b) => a - b);
    const medianAge = ages.length % 2 === 0
      ? ((ages[ages.length / 2 - 1] + ages[ages.length / 2]) / 2).toFixed(1)
      : ages[Math.floor(ages.length / 2)];
    
    return { greekPercentage, medianAge, totalPlayers: allPlayers.length };
  };

  const stats = calculateStats();

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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'darkgreen',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'darkgreen',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
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

  playerInfo: {
    flex: 1,
  },
});

export default BasketballRoster;
