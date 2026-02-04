import React from 'react';
import { ScrollView, StyleSheet, View, Text, FlatList, Image } from 'react-native';

const footballRosterData = [
  {
    "number": "40",
    "name": "Alban Lafont",
    "position": "Goalkeeper",
    "country": "Cote d'Ivoire",
    "height": "1,96m",
    "foot": "right",
    "contractStarted": "17/07/2025",
    "contractEnds": "30/06/2026",
    "age": "27",
    "value": "€3.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/357117-1756042679.png?lm=1"
  },
  {
    "number": "12",
    "name": "Lucas Chaves",
    "position": "Goalkeeper",
    "country": "🇦🇷 Argentina",
    "height": "1,82m",
    "foot": "right",
    "contractStarted": "06/01/2026",
    "contractEnds": "30/06/2026",
    "age": "30",
    "value": "€1.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/360791-1770038886.png?lm=1"
  },
  {
    "number": "70",
    "name": "Konstantinos Kotsaris",
    "position": "Goalkeeper",
    "country": "🇬🇷 Greece",
    "height": "1,85m",
    "foot": "right",
    "contractStarted": "21/07/2025",
    "contractEnds": "30/06/2027",
    "age": "29",
    "value": "€450k",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/242637-1756042756.png?lm=1"
  },
  {
    "number": "5",
    "name": "Ahmed Touba",
    "position": "Centre-Back",
    "country": "🇩🇿 Algeria",
    "height": "1,90m",
    "foot": "left",
    "contractStarted": "01/07/2025",
    "contractEnds": "30/06/2028",
    "age": "27",
    "value": "€2.50m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/325924-1756042877.png?lm=1"
  },
  {
    "number": "21",
    "name": "Tin Jedvaj",
    "position": "Centre-Back",
    "country": "🇭🇷 Croatia",
    "height": "1,85m",
    "foot": "right",
    "contractStarted": "01/07/2024",
    "contractEnds": "30/06/2027",
    "age": "30",
    "value": "€2.50m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/206386-1756042829.png?lm=1"
  },
  {
    "number": "15",
    "name": "Sverrir Ingi Ingason",
    "position": "Centre-Back",
    "country": "🇮🇸 Iceland",
    "height": "1,88m",
    "foot": "right",
    "contractStarted": "15/07/2024",
    "contractEnds": "30/06/2028",
    "age": "32",
    "value": "€2.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/137648-1756042923.png?lm=1"
  },
  {
    "number": "14",
    "name": "Erik Palmer-Brown",
    "position": "Centre-Back",
    "country": "🇺🇸 United States",
    "height": "1,86m",
    "foot": "right",
    "contractStarted": "02/08/2023",
    "contractEnds": "30/06/2027",
    "age": "28",
    "value": "€1.50m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/282199-1756042965.png?lm=1"
  },
  {
    "number": "3",
    "name": "Georgios Katris",
    "position": "Centre-Back",
    "country": "🇬🇷 Greece",
    "height": "-",
    "foot": "right",
    "contractStarted": "01/07/2024",
    "contractEnds": "30/06/2028",
    "age": "20",
    "value": "€400k",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/1047109-1757720330.jpg?lm=1"
  },
  {
    "number": "26",
    "name": "Javi Hernández",
    "position": "Left-Back",
    "country": "🇪🇸 Spain",
    "height": "1,80m",
    "foot": "left",
    "contractStarted": "02/02/2026",
    "contractEnds": "30/06/2026",
    "age": "27",
    "value": "€2.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/422466-1770126002.png?lm=1"
  },
  {
    "number": "77",
    "name": "Georgios Kyriakopoulos",
    "position": "Left-Back",
    "country": "🇬🇷 Greece",
    "height": "1,86m",
    "foot": "left",
    "contractStarted": "01/07/2025",
    "contractEnds": "30/06/2029",
    "age": "29",
    "value": "€2.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/311178-1756043034.png?lm=1"
  },
  {
    "number": "25",
    "name": "Filip Mladenovic",
    "position": "Left-Back",
    "country": "🇷🇸 Serbia",
    "height": "1,80m",
    "foot": "left",
    "contractStarted": "01/07/2023",
    "contractEnds": "30/06/2026",
    "age": "34",
    "value": "€600k",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/168063-1756043070.png?lm=1"
  },
  {
    "number": "2",
    "name": "Davide Calabria",
    "position": "Right-Back",
    "country": "🇮🇹 Italy",
    "height": "1,76m",
    "foot": "right",
    "contractStarted": "17/08/2025",
    "contractEnds": "30/06/2028",
    "age": "29",
    "value": "€4.50m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/262523-1756043138.png?lm=1"
  },
  {
    "number": "27",
    "name": "Giannis Kotsiras",
    "position": "Right-Back",
    "country": "🇬🇷 Greece",
    "height": "1,83m",
    "foot": "right",
    "contractStarted": "01/07/2021",
    "contractEnds": "30/06/2026",
    "age": "33",
    "value": "€500k",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/436916-1756043172.png?lm=1"
  },
  {
    "number": "4",
    "name": "Pedro Chirivella",
    "position": "Defensive Midfield",
    "country": "🇪🇸 Spain",
    "height": "1,78m",
    "foot": "right",
    "contractStarted": "01/07/2025",
    "contractEnds": "30/06/2027",
    "age": "28",
    "value": "€5.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/242273-1756043210.png?lm=1"
  },
  {
    "number": "6",
    "name": "Manolis Siopis",
    "position": "Defensive Midfield",
    "country": "🇬🇷 Greece",
    "height": "1,68m",
    "foot": "right",
    "contractStarted": "31/01/2025",
    "contractEnds": "30/06/2027",
    "age": "31",
    "value": "€1.50m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/182688-1756043242.png?lm=1"
  },
  {
    "number": "16",
    "name": "Adam Gnezda Cerin",
    "position": "Central Midfield",
    "country": "🇸🇮 Slovenia",
    "height": "1,80m",
    "foot": "right",
    "contractStarted": "02/07/2022",
    "contractEnds": "30/06/2028",
    "age": "26",
    "value": "€4.50m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/401394-1756043274.png?lm=1"
  },
  {
    "number": "8",
    "name": "Renato Sanches",
    "position": "Central Midfield",
    "country": "🇵🇹 Portugal",
    "height": "1,76m",
    "foot": "right",
    "contractStarted": "24/08/2025",
    "contractEnds": "30/06/2026",
    "age": "28",
    "value": "€2.50m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/258027-1756943455.png?lm=1"
  },
  {
    "number": "52",
    "name": "Tonny Vilhena",
    "position": "Central Midfield",
    "country": "🇳🇱 Netherlands",
    "height": "1,75m",
    "foot": "left",
    "contractStarted": "07/07/2023",
    "contractEnds": "30/06/2027",
    "age": "31",
    "value": "€800k",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/182581-1756043310.png?lm=1"
  },
  {
    "number": "18",
    "name": "Sotiris Kontouris",
    "position": "Central Midfield",
    "country": "🇬🇷 Greece",
    "height": "1,83m",
    "foot": "right",
    "contractStarted": "02/01/2026",
    "contractEnds": "30/06/2029",
    "age": "20",
    "value": "€400k",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/1031590-1770038842.png?lm=1"
  },
  {
    "number": "17",
    "name": "Moussa Sissoko",
    "position": "Central Midfield",
    "country": "🇫🇷 France",
    "height": "1,87m",
    "foot": "right",
    "contractStarted": "02/02/2026",
    "contractEnds": "30/06/2027",
    "age": "36",
    "value": "€300k",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/46001-1770126068.png?lm=1"
  },
  {
    "number": "11",
    "name": "Anastasios Bakasetas",
    "position": "Attacking Midfield",
    "country": "🇬🇷 Greece",
    "height": "1,81m",
    "foot": "left",
    "contractStarted": "22/01/2024",
    "contractEnds": "30/06/2027",
    "age": "32",
    "value": "€3.50m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/162571-1756043448.png?lm=1"
  },
  {
    "number": "20",
    "name": "Vicente Taborda",
    "position": "Attacking Midfield",
    "country": "🇦🇷 Argentina",
    "height": "1,78m",
    "foot": "right",
    "contractStarted": "02/09/2025",
    "contractEnds": "30/06/2029",
    "age": "24",
    "value": "€3.50m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/906748-1762874532.png?lm=1"
  },
  {
    "number": "31",
    "name": "Filip Djuricic",
    "position": "Attacking Midfield",
    "country": "🇷🇸 Serbia",
    "height": "1,81m",
    "foot": "right",
    "contractStarted": "01/07/2023",
    "contractEnds": "30/06/2026",
    "age": "34",
    "value": "€1.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/94307-1756043480.png?lm=1"
  },
  {
    "number": "9",
    "name": "Anass Zaroury",
    "position": "Left Winger",
    "country": "🇲🇦 Morocco",
    "height": "1,76m",
    "foot": "right",
    "contractStarted": "03/08/2025",
    "contractEnds": "30/06/2026",
    "age": "25",
    "value": "€8.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/491296-1756043546.png?lm=1"
  },
  {
    "number": "10",
    "name": "Santino Andino",
    "position": "Left Winger",
    "country": "🇦🇷 Argentina",
    "height": "1,74m",
    "foot": "right",
    "contractStarted": "22/01/2026",
    "contractEnds": "30/06/2030",
    "age": "20",
    "value": "€5.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/1305935-1770126109.png?lm=1"
  },
  {
    "number": "28",
    "name": "Facundo Pellistri",
    "position": "Right Winger",
    "country": "🇺🇾 Uruguay",
    "height": "1,75m",
    "foot": "right",
    "contractStarted": "21/08/2024",
    "contractEnds": "30/06/2028",
    "age": "24",
    "value": "€7.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/676318-1756043624.png?lm=1"
  },
  {
    "number": "23",
    "name": "Pavlos Pantelidis",
    "position": "Right Winger",
    "country": "🇬🇷 Greece",
    "height": "-",
    "foot": "right",
    "contractStarted": "02/01/2026",
    "contractEnds": "30/06/2029",
    "age": "23",
    "value": "€1.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/905189-1770038792.png?lm=1"
  },
  {
    "number": "22",
    "name": "Georgios Kyriopoulos",
    "position": "Right Winger",
    "country": "🇬🇷 Greece",
    "height": "1,79m",
    "foot": "left",
    "contractStarted": "01/07/2024",
    "contractEnds": "30/06/2028",
    "age": "21",
    "value": "€350k",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/898021-1756043694.png?lm=1"
  },
  {
    "number": "39",
    "name": "Giannis Bokos",
    "position": "Right Winger",
    "country": "🇬🇷 Greece",
    "height": "-",
    "foot": null,
    "contractStarted": "01/07/2025",
    "contractEnds": "30/06/2027",
    "age": "19",
    "value": "€100k",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/1077461-1756043725.png?lm=1"
  },
  {
    "number": "19",
    "name": "Karol Świderski",
    "position": "Centre-Forward",
    "country": "🇵🇱 Poland",
    "height": "1,84m",
    "foot": "left",
    "contractStarted": "23/01/2025",
    "contractEnds": "30/06/2028",
    "age": "29",
    "value": "€5.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/330126-1756043790.png?lm=1"
  },
  {
    "number": "33",
    "name": "Cyriel Dessers",
    "position": "Centre-Forward",
    "country": "Nigeria",
    "height": "1,85m",
    "foot": "right",
    "contractStarted": "01/09/2025",
    "contractEnds": "30/06/2028",
    "age": "31",
    "value": "€3.50m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/317806-1757717180.png?lm=1"
  },
  {
    "number": "72",
    "name": "Milos Pantovic",
    "position": "Centre-Forward",
    "country": "🇷🇸 Serbia",
    "height": "1,85m",
    "foot": "right",
    "contractStarted": "31/08/2025",
    "contractEnds": "30/06/2029",
    "age": "23",
    "value": "€3.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/615639-1757717216.png?lm=1"
  },
  {
    "number": "7",
    "name": "Andreas Tetteh",
    "position": "Centre-Forward",
    "country": "🇬🇷 Greece",
    "height": "1,88m",
    "foot": "right",
    "contractStarted": "02/01/2026",
    "contractEnds": "30/06/2029",
    "age": "24",
    "value": "€2.00m",
    "imageUrl": "https://img.a.transfermarkt.technology/portrait/medium/905184-1770038735.png?lm=1"
  }
];

const FootballRoster = () => {
  // Group players by position
  const data = footballRosterData.reduce((acc, player) => {
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
      player.country === 'Greece' || player.country === '🇬🇷 Greece' || player.country.includes('🇬🇷')
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
      <Image source={{ uri: item.imageUrl }} style={styles.playerImage} resizeMode="contain" />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerDetail}>Position: {item.position}</Text>
        <Text style={styles.playerDetail}>Height: {item.height}</Text>
        <Text style={styles.playerDetail}>Foot: {item.foot}</Text>
        <Text style={styles.playerDetail}>Contract Started: {item.contractStarted}</Text>
        <Text style={styles.playerDetail}>Contract Ends: {item.contractEnds}</Text>
        <Text style={styles.playerDetail}>Age: {item.age}</Text>
        <Text style={styles.playerDetail}>Country: {item.country}</Text>
        <Text style={styles.playerDetail}>Value: {item.value}</Text>
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

  playerImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  playerInfo: {
    flex: 1,
  },
});

export default FootballRoster;
