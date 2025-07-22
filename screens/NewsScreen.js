import React, { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme, FAB } from 'react-native-paper';
import NewsComponent from '../components/NewsComponent';

const rssFeeds = [
  'https://www.gazzetta.gr/teams/panathinaikos/rss',
  'https://corsproxy.io/?https://www.inpao.gr/feed/',
  'https://corsproxy.io/?https://www.sdna.gr/latest.xml',
  'https://corsproxy.io/?https://leoforos1908.gr/?feed=rss2',
];

export default function NewsScreen() {
  const { colors } = useTheme();
  const newsComponentRef = useRef(null);

  const handleRefresh = () => {
    if (newsComponentRef.current) {
      newsComponentRef.current.fetchAllFeeds();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Τελευταία Νέα Παναθηναϊκού
      </Text>

      <NewsComponent
        ref={newsComponentRef}
        rssUrls={rssFeeds}
        filterKeywords={['Παναθηναϊκός', 'ΠΑΟ', 'Παναθηναϊκού', 'Παναθηναϊκό']}
      />

      <FAB
        style={[styles.fab, { backgroundColor: 'lightgreen' }]}
        icon="refresh"
        color="darkgreen"
        onPress={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});