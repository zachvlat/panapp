import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

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
    const sources = [
      'https://www.flashscore.com/team/panathinaikos/8k9y/fixtures/',
      'https://www.flashscore.gr/omades/panathinaikos-8k9y/programma/',
      'https://www.sofascore.com/team/football/panathinaikos/8315/fixtures'
    ];

    const proxyUrl = 'https://corsproxy.io/?';

    for (const url of sources) {
      try {
        const response = await fetch(proxyUrl + encodeURIComponent(url));
        const html = await response.text();
        
        if (html.toLowerCase().includes('panathinaikos')) {
          const match = parseMatchData(html);
          if (match) return match;
        }
      } catch (err) {
        continue;
      }
    }
    
    return getManualFootballMatch();
  };

  const fetchBasketballMatch = async () => {
    const sources = [
      'https://www.flashscore.com/team/panathinaikos/0q0a/fixtures/',
      'https://www.flashscore.gr/omades/panathinaikos-0q0a/programma/',
      'https://www.sofascore.com/team/basketball/panathinaikos/9638/fixtures',
      'https://www.euroleague.net/main/results?team=142'
    ];

    const proxyUrl = 'https://corsproxy.io/?';

    for (const url of sources) {
      try {
        const response = await fetch(proxyUrl + encodeURIComponent(url));
        const html = await response.text();
        
        if (html.toLowerCase().includes('panathinaikos')) {
          const match = parseMatchData(html);
          if (match) return { ...match, ...getBasketballDefaults() };
        }
      } catch (err) {
        continue;
      }
    }
    
    return getManualBasketballMatch();
  };

  const parseMatchData = (html) => {
    try {
      const pattern = /Panathinaikos[^<]*<\/[^>]*>[^<]*([^<]+)<\/[^>]*>[^<]*([0-9]{1,2}:[0-9]{2})/gi;
      const matches = [...html.matchAll(pattern)];
      
      if (matches.length > 0) {
        const [opponent, time] = matches[0].slice(1);
        return {
          homeTeam: 'Panathinaikos',
          awayTeam: opponent.trim(),
          time: time.trim(),
          date: '2024-11-28'
        };
      }
    } catch (err) {
      return null;
    }
    return null;
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

  const getManualFootballMatch = () => {
    return {
      homeTeam: 'Panathinaikos',
      awayTeam: 'Sturm Graz',
      date: '2024-11-28',
      time: '19:00',
      competition: 'Europa League',
      venue: 'Olympic Stadium (Athens)',
      isHome: true
    };
  };

  const getManualBasketballMatch = () => {
    return {
      homeTeam: 'Panathinaikos',
      awayTeam: 'Valencia',
      date: '2024-11-29',
      time: '19:30',
      competition: 'EuroLeague',
      venue: 'OAKA Indoor Hall',
      isHome: true
    };
  };

  const getBasketballDefaults = () => {
    return {
      competition: 'EuroLeague',
      venue: 'OAKA Indoor Hall',
      isHome: true
    };
  };

  const formatMatchDate = (dateString, timeString) => {
    const date = new Date(dateString + ' ' + timeString);
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
            
            <Text style={[styles.competition, { color: colors.onSurface }]}>
              {match.competition}
            </Text>
            
            <View style={styles.teamsContainer}>
              <View style={styles.team}>
                <Text style={[styles.teamName, { color: colors.onSurface }]} numberOfLines={2}>
                  {match.homeTeam}
                </Text>
              </View>
              
              <Text style={[styles.vs, { color: colors.primary }]}>VS</Text>
              
              <View style={styles.team}>
                <Text style={[styles.teamName, { color: colors.onSurface }]} numberOfLines={2}>
                  {match.awayTeam}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.date, { color: colors.onSurface }]}>
              {formatMatchDate(match.date, match.time)}
            </Text>
            
            <Text style={[styles.venue, { color: colors.onSurface }]} numberOfLines={1}>
              📍 {match.venue}
            </Text>
            
            <View style={[styles.statusContainer, { backgroundColor: match.sport === 'Μπάσκετ' ? 'rgba(255, 140, 0, 0.1)' : 'rgba(0, 100, 0, 0.1)' }]}>
              <Text style={[styles.status, { color: match.sport === 'Μπάσκετ' ? '#ff8c00' : colors.primary }]}>
                {match.isHome ? 'Εντός έδρας' : 'Εκτός έδρας'}
              </Text>
            </View>
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
  competition: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  team: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 14,
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
  venue: {
    fontSize: 12,
    marginTop: 4,
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