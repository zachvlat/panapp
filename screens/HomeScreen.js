import React, { useRef, useState } from 'react';
import { View, StyleSheet, Image, Text, Pressable, Linking, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import NewsComponent from '../components/NewsComponent';
import NextMatchCarousel from '../components/NextMatchCarousel';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const newsRef = useRef(null);

  const [featured, setFeatured] = useState(null);

  const rssFeeds = [
  'https://www.gazzetta.gr/teams/panathinaikos/rss',
  'https://www.inpao.gr/feed/',
  'https://www.sdna.gr/latest.xml',
  'https://leoforos1908.gr/?feed=rss2',
  'https://www.athletiko.gr/feed',
  'https://www.onlypao.gr/feed/',
  'https://prasinoforos.gr/feed/',
  ];

  const parseItem = (item, source = '') => {
    const html = item['content:encoded'] || item.description || '';

    // better image extraction
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

  const handleNewsLoaded = (newsItems) => {
    const firstWithImage = newsItems.find((item) => item.image);
    setFeatured(firstWithImage || null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NextMatchCarousel />
      
      {featured && (
        <Pressable style={styles.featuredCard} onPress={() => Linking.openURL(featured.link)}>
          <Image source={{ uri: featured.image }} style={styles.featuredImage} />
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredTitle}>{featured.title}</Text>
          </View>
        </Pressable>
      )}
      
      <NewsComponent
        ref={newsRef}
        rssUrls={rssFeeds}
        filterKeywords={["Παναθηναϊκός", "Παναθηναϊκού", "Παναθηναϊκό"]}
        parseItem={parseItem}
        layout="carousel"
        onNewsLoaded={handleNewsLoaded}
        featured={featured}
      />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  featuredCard: {
    width: '90%',
    height: 550,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: '#000',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 100, 0, 0.6)',
    padding: 12,
  },
  featuredTitle: {
    color: '#d4fcdc',
    fontWeight: 'bold',
    fontSize: 30,
  },
});
