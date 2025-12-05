import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SvgUri } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function NextMatchCarousel() {
  const { colors } = useTheme();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMatches();
  }, []);

  const fetchAllMatches = async () => {
    try {
      setLoading(true);
      
      // Fetch football match
      const footballMatch = await fetchFootballMatch();
      
      // Fetch basketball match
      const basketballMatch = await fetchBasketballMatch();
      
      const allMatches = [];
      if (footballMatch) allMatches.push({ ...footballMatch, sport: 'Ποδόσφαιρο' });
      if (basketballMatch) allMatches.push({ ...basketballMatch, sport: 'Μπάσκετ' });
      
      setMatches(allMatches);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setMatches(getManualMatches());
    } finally {
      setLoading(false);
    }
  };

  const fetchFootballMatch = async () => {
    try {
      const response = await fetch('https://www.gazzetta.gr/gztfeeds/program/team/557/sport/4');
      const data = await response.json();
      
      if (data.match_1) {
        const match = data.match_1;
        return {
          homeTeam: match.home_team_name,
          awayTeam: match.away_team_name,
          homeTeamLogo: 'https://www.gazzetta.gr' + match.home_team_logo,
          awayTeamLogo: 'https://www.gazzetta.gr' + match.away_team_logo,
          date: match.match_date,
          time: match.match_time,
          competition: match.league.name,
          competitionLogo: 'https://www.gazzetta.gr' + match.league.logo,
          matchUrl: 'https://www.gazzetta.gr' + match.match_url,
          isHome: match.away_team_name === 'Παναθηναϊκός'
        };
      }
    } catch (err) {
      console.error('Error fetching football match:', err);
    }
    
    return getManualFootballMatch();
  };





  const fetchBasketballMatch = async () => {
    try {
      const response = await fetch('https://www.gazzetta.gr/gztfeeds/program/team/557/sport/6');
      const data = await response.json();
      
      if (data.match_1) {
        const match = data.match_1;
        return {
          homeTeam: match.home_team_name,
          awayTeam: match.away_team_name,
          homeTeamLogo: 'https://www.gazzetta.gr' + match.home_team_logo,
          awayTeamLogo: 'https://www.gazzetta.gr' + match.away_team_logo,
          date: match.match_date,
          time: match.match_time,
          competition: match.league.name,
          competitionLogo: 'https://www.gazzetta.gr' + match.league.logo,
          matchUrl: 'https://www.gazzetta.gr' + match.match_url,
          isHome: match.away_team_name === 'Παναθηναϊκός'
        };
      }
    } catch (err) {
      console.error('Error fetching basketball match:', err);
    }
    
    return getManualBasketballMatch();
  };

  const getManualMatches = () => {
    return [
      {
        ...getManualFootballMatch(),
        sport: 'Ποδόσφαιρο'
      },
      {
        ...getManualBasketballMatch(),
        sport: 'Μπάσκετ'
      }
    ];
  };

  const formatMatchDate = (dateString, timeString) => {
    // Convert DD-MM-YYYY to YYYY-MM-DD for proper date parsing
    const [day, month, year] = dateString.split('-');
    const cleanTime = timeString.replace(' : ', ':').trim();
    const isoDate = `${year}-${month}-${day} ${cleanTime}`;
    
    const date = new Date(isoDate);
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('el-GR', options);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (matches.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Επόμενοι Αγώνες
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      >
        {matches.map((match, index) => (
          <View key={index} style={[styles.matchCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={[styles.sportHeader, { backgroundColor: match.sport === 'Μπάσκετ' ? 'rgba(255, 140, 0, 0.1)' : 'rgba(0, 100, 0, 0.1)' }]}>
              <Text style={[styles.sportText, { color: match.sport === 'Μπάσκετ' ? '#ff8c00' : colors.primary }]}>
                {match.sport}
              </Text>
            </View>
            
            <View style={styles.competitionContainer}>
              {match.competitionLogo && match.competitionLogo.endsWith('.svg') ? (
                <SvgUri 
                  uri={match.competitionLogo} 
                  style={styles.competitionLogo}
                />
              ) : match.competitionLogo ? (
                <Image 
                  source={{ uri: match.competitionLogo }} 
                  style={styles.competitionLogo}
                  resizeMode="contain"
                />
              ) : null}
              <Text style={[styles.competition, { color: colors.onSurface }]}>
                {match.competition}
              </Text>
            </View>
            
            <View style={styles.teamsContainer}>
              <View style={styles.team}>
                {match.homeTeamLogo && match.homeTeamLogo.endsWith('.svg') ? (
                  <SvgUri 
                    uri={match.homeTeamLogo} 
                    style={match.homeTeamLogo.includes('panathinaikos') ? styles.panathinaikosLogo : styles.teamLogo}
                  />
                ) : match.homeTeamLogo ? (
                  <Image 
                    source={{ uri: match.homeTeamLogo }} 
                    style={styles.teamLogo}
                    resizeMode="contain"
                    onError={(e) => console.log('Home team logo error:', e.nativeEvent.error)}
                  />
                ) : null}
                <Text style={[styles.teamName, { color: colors.onSurface }]} numberOfLines={2}>
                  {match.homeTeam}
                </Text>
              </View>
              
              <Text style={[styles.vs, { color: colors.primary }]}>VS</Text>
              
              <View style={styles.team}>
                {match.awayTeamLogo && match.awayTeamLogo.endsWith('.svg') ? (
                  <SvgUri 
                    uri={match.awayTeamLogo} 
                    style={match.awayTeamLogo.includes('panathinaikos') ? styles.panathinaikosLogo : styles.teamLogo}
                  />
                ) : match.awayTeamLogo ? (
                  <Image 
                    source={{ uri: match.awayTeamLogo }} 
                    style={styles.teamLogo}
                    resizeMode="contain"
                    onError={(e) => console.log('Away team logo error:', e.nativeEvent.error)}
                  />
                ) : null}
                <Text style={[styles.teamName, { color: colors.onSurface }]} numberOfLines={2}>
                  {match.awayTeam}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.date, { color: colors.onSurface }]}>
              {formatMatchDate(match.date, match.time)}
            </Text>
          </View>
        ))}
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
  matchCard: {
    width: width * 0.7,
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
  sportHeader: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  sportText: {
    fontSize: 12,
    fontWeight: '600',
  },
  competitionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  competitionLogo: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  competition: {
    fontSize: 14,
    fontStyle: 'italic',
    flex: 1,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  team: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 70,
    height: 70,
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  panathinaikosLogo: {
    width: 70,
    height: 70,
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  teamName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },

  statusContainer: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
});