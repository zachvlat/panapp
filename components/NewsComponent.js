import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, Pressable, Linking } from 'react-native';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

const NewsComponent = ({ rssUrls, filterKeyword, parseItem }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllFeeds();
  }, []);

const fetchAllFeeds = async () => {
  try {
    const allItems = [];

    for (const url of rssUrls) {
      try {
        const res = await fetch(url);
        const xml = await res.text();
        const json = parser.parse(xml);

        const items = json?.rss?.channel?.item || [];
        const filtered = filterKeyword
          ? items.filter((i) =>
              i.title?.toLowerCase().includes(filterKeyword.toLowerCase())
            )
          : items;

        const parsed = filtered
          .map(parseItem)
          .filter(item => item.pubDate instanceof Date && !isNaN(item.pubDate)); // Ensure valid dates

        allItems.push(...parsed);
      } catch (feedErr) {
        console.warn(`Feed failed: ${url}`, feedErr);
      }
    }

    // ✅ Sort all items by pubDate descending (latest first)
    const sorted = allItems.sort((a, b) => b.pubDate - a.pubDate);
    setNewsItems(sorted);
  } catch (err) {
    console.error('Failed to fetch feeds', err);
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00ff88" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {newsItems.map((news, index) => (
        <Pressable
          key={index}
          style={styles.newsItem}
          onPress={() => Linking.openURL(news.link)}
        >
          {news.image && (
            <Image source={{ uri: news.image }} style={styles.image} />
          )}
          <Text style={styles.title}>{news.title}</Text>
          <Text style={styles.description}>{news.description}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    padding: 16,
  },
  newsItem: {
    marginBottom: 24,
    backgroundColor: '#1d5e38',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#a8e6cf',
    shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.5,
  shadowRadius: 4,
  elevation: 5,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: 'white',
  },
});

export default NewsComponent;
