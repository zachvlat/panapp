import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import NewsComponent from '../components/NewsComponent';

const rssFeeds = [
  'https://www.gazzetta.gr/teams/panathinaikos/rss',
  'https://corsproxy.io/?https://www.inpao.gr/feed/',
  'https://corsproxy.io/?https://www.sdna.gr/latest.xml',
  'https://corsproxy.io/?https://leoforos1908.gr/?feed=rss2',
];

export default function NewsScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Τελευταία Νέα Παναθηναϊκού
      </Text>

      <NewsComponent
        rssUrls={rssFeeds}
        filterKeywords={['Παναθηναϊκός', 'ΠΑΟ', 'Παναθηναϊκού', 'Παναθηναϊκό']}
      />
    </ScrollView>
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
});