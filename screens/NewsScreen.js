import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import NewsComponent from '../components/NewsComponent';

const rssFeeds = [
  'https://www.gazzetta.gr/teams/panathinaikos/rss',
  'https://corsproxy.io/?https://www.inpao.gr/feed/',
  'https://corsproxy.io/?https://www.sdna.gr/latest.xml',
  'https://corsproxy.io/?https://leoforos1908.gr/?feed=rss2',
];

const parseItem = (item) => {
  const html = item['content:encoded'] || item.description || '';

  // Match image src
  const imageMatch = html.match(/<img[^>]+src="([^">]+)"/);
  const image = imageMatch ? imageMatch[1] : null;

  // Match first paragraph
  const textMatch = html.match(/<p>(.*?)<\/p>/);
  const description = textMatch ? textMatch[1] : item.description;

  return {
    title: item.title,
    description,
    link: item.link,
    image,
    pubDate: new Date(item.pubDate || item.pubdate || item['dc:date'] || null),
  };
};

export default function DetailScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Panathinaikos Latest News
      </Text>

      <NewsComponent
        rssUrls={rssFeeds}
        filterKeywords={["Παναθηναϊκός", "ΠΑΟ", "Παναθηναϊκού"]}
        parseItem={parseItem}
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
  button: {
    marginBottom: 20,
    borderRadius: 24,
  },
});
