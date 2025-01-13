import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet, 
  Pressable, 
  Linking 
} from 'react-native';
import xml2js from 'react-native-xml2js';

const InpaoNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(
        'https://www.inpao.gr/feed/'
      );
      const xmlText = await response.text();

      // Parse XML to JSON
      xml2js.parseString(xmlText, (err, result) => {
        if (err) {
          console.error('Failed to parse XML', err);
          return;
        }

        // Extract and map all items for rendering
        const items = result.rss.channel[0].item;
        const mappedItems = items.map((item) => {
          const imageMatch = item.description[0]
            ? item.description[0].match(/<img.*?src="(.*?)"/)
            : null;
          return {
            title: item.title[0],
            description: item.description[0].replace(/<[^>]*>?/gm, ''), // Remove HTML tags
            link: item.link[0],
            image: imageMatch ? imageMatch[1] : null,
          };
        });

        setNewsItems(mappedItems);
        setLoading(false);
      });
    } catch (error) {
      console.error('Failed to fetch news', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {newsItems.map((news, index) => (
        <Pressable 
          key={index} 
          style={styles.newsItem} 
          onPress={() => Linking.openURL(news.link)}
        >
          {news.image && <Image source={{ uri: news.image }} style={styles.image} />}
          <Text style={styles.title}>{news.title}</Text>
          <Text style={styles.description}>{news.description}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#124728',
  },
  newsItem: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 200,
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
    fontSize: 16,
    color: 'white',
  },
});

export default InpaoNews;
