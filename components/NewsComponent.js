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
  Dimensions,
} from 'react-native';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

// improved parsing logic with better image extraction
const defaultParseItem = (item, source = '') => {
  const html = item['content:encoded'] || item.description || '';

  let image = null;
  if (item.enclosure?.['@_url']) {
    image = item.enclosure['@_url'];
  } else if (item['media:content']?.['@_url']) {
    image = item['media:content']['@_url'];
  } else {
    const imageMatch = html.match(/<img[^>]+src="([^">]+)"/);
    image = imageMatch ? imageMatch[1] : null;
  }

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
    onNewsLoaded,
    featured, // 🔥 new prop so we can skip the featured article
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
        if (url.includes('prasinoforos')) return 'Prasinoforos';
        if (url.includes('monobala')) return 'Monobala';
        if (url.includes('athletiko')) return 'Athletiko';
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

      if (onNewsLoaded) {
        onNewsLoaded(sorted);
      }
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
    // skip featured article
    const carouselItems = newsItems
      .filter((item) => item.image && (!featured || item.link !== featured.link))
      .slice(0, 5);

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

  // list layout (skip featured here too)
  const listItems = newsItems.filter(
    (item) => !featured || item.link !== featured.link
  );

  // Determine number of columns based on screen width
  const numColumns = screenWidth > 900 ? 3 : screenWidth > 600 ? 2 : 1;
  const isMultiColumn = numColumns > 1;
  
  // Group items into rows for multi-column layout
  const rows = [];
  if (isMultiColumn) {
    for (let i = 0; i < listItems.length; i += numColumns) {
      rows.push(listItems.slice(i, i + numColumns));
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentWrapper}>
        {isMultiColumn ? (
          // Multi-column layout
          rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((news, colIndex) => (
                <View key={colIndex} style={styles.column}>
                  <Pressable
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
                </View>
              ))}
            </View>
          ))
        ) : (
          // Single column layout
          listItems.map((news, index) => (
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
          ))
        )}
      </View>
    </ScrollView>
  );
});

const carouselStyles = StyleSheet.create({
  card: {
    width: 350,
    height: 200,
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

const { width: screenWidth } = Dimensions.get('window');

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
  contentWrapper: {
    alignSelf: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  column: {
    flex: 1,
    marginHorizontal: 6,
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
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  source: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NewsComponent;
