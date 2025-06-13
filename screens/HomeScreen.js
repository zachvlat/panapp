import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import NextMatches from '../components/NextMatches';
import NewsComponent from '../components/NewsComponent';
import Logo from '../assets/pao.svg';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();

  const rssFeeds = [
  'https://www.gazzetta.gr/teams/panathinaikos/rss',
  'https://corsproxy.io/?https://www.inpao.gr/feed/',
  'https://corsproxy.io/?https://www.sdna.gr/latest.xml',
  'https://corsproxy.io/?https://leoforos1908.gr/?feed=rss2',
];

const parseItem = (item, source = '') => {
  const html = item['content:encoded'] || item.description || '';

  const imageMatch = html.match(/<img[^>]+src="([^">]+)"/);
  const image = imageMatch ? imageMatch[1] : null;

  const textMatch = html.match(/<p>(.*?)<\/p>/);
  const description = textMatch ? textMatch[1] : item.description;

  return {
    title: item.title,
    description,
    link: item.link,
    image,
    source,
    pubDate: new Date(item.pubDate || item.pubdate || item['dc:date'] || null),
  };
};

  return (
    <View style={styles.container}>
      <Logo width={150} height={150} />
      <Text style={[styles.title, { color: colors.primary }]}>
        Green Portal
      </Text>
      {/* <NextMatches /> */}
      <NewsComponent
        rssUrls={rssFeeds}
        filterKeywords={["Παναθηναϊκός", "ΠΑΟ", "Παναθηναϊκού", "Παναθηναϊκό"]}
        parseItem={parseItem}
        layout="carousel"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
});
