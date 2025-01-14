import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, Pressable, Linking } from 'react-native';
import xml2js from 'react-native-xml2js';

const NewsComponent = ({ rssUrl, filterKeyword, parseItem }) => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(rssUrl);
      const xmlText = await response.text();
      
      xml2js.parseString(xmlText, (err, result) => {
        if (err) {
          console.error('Failed to parse XML', err);
          return;
        }

        const items = result.rss.channel[0].item;
        const filteredItems = filterKeyword
          ? items.filter((item) => item.title[0].includes(filterKeyword))
          : items;

        const mappedItems = filteredItems.map(parseItem);

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
        <Pressable key={index} style={styles.newsItem} onPress={() => Linking.openURL(news.link)}>
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

export default NewsComponent;