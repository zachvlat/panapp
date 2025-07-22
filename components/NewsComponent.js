import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

// default parsing logic
const defaultParseItem = (item, source = '') => {
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

const NewsComponent = React.forwardRef((
  {
    rssUrls,
    filterKeywords = [],
    parseItem = defaultParseItem,
    layout = 'list',
  },
  ref
) => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllFeeds();
  }, []);

  const fetchAllFeeds = async () => {
    setLoading(true);
    try {
      const allItems = [];

      const getSourceName = (url) => {
        if (url.includes('gazzetta')) return 'Gazzetta';
        if (url.includes('inpao')) return 'InPao';
        if (url.includes('sdna')) return 'SDNA';
        if (url.includes('leoforos')) return 'Leoforos1908';
        return 'Άγνωστη Πηγή';
      };

      for (const url of rssUrls) {
        try {
          const res = await fetch(url);
          const xml = await res.text();
          const json = parser.parse(xml);

          const items = json?.rss?.channel?.item || [];
          const filtered = filterKeywords.length
            ? items.filter((i) =>
                filterKeywords.some((k) =>
                  `${i.title || ''} ${i.description || ''}`
                    .toLowerCase()
                    .includes(k.toLowerCase())
                )
              )
            : items;

          const source = getSourceName(url);

          const parsed = filtered
            .map((item) => parseItem(item, source))
            .filter(
              (item) =>
                item.pubDate instanceof Date && !isNaN(item.pubDate.getTime())
            );

          allItems.push(...parsed);
        } catch (feedErr) {
          console.warn(`Feed failed: ${url}`, feedErr);
        }
      }

      const sorted = allItems.sort((a, b) => b.pubDate - a.pubDate);
      setNewsItems(sorted);
    } catch (err) {
      console.error('Failed to fetch feeds', err);
    } finally {
      setLoading(false);
    }
  };

  React.useImperativeHandle(ref, () => ({
    fetchAllFeeds,
  }));

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00ff88" />
      </View>
    );
  }

  if (layout === 'carousel') {
    const carouselItems = newsItems.filter((item) => item.image).slice(0, 5);

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 12 }}
      >
        {carouselItems.map((news, index) => (
          <Pressable
            key={index}
            style={carouselStyles.card}
            onPress={() => Linking.openURL(news.link)}
          >
            <Image source={{ uri: news.image }} style={carouselStyles.image} />
            <View style={carouselStyles.overlay}>
              <Text numberOfLines={2} style={carouselStyles.title}>
                {news.title}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
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
          <Text style={styles.source}>Πηγή: {news.source}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
});

const carouselStyles = StyleSheet.create({
  card: {
    width: 300,
    height: 160,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 100, 0, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  title: {
    color: '#d4fcdc',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

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
    shadowOffset: { width: 0, height: 2 },
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
  source: {
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NewsComponent;