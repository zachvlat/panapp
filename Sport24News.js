import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import xml2js from 'react-native-xml2js';

const Sport24News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the XML data
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(
        'https://www.sport24.gr/newsfeed.xml?profile=public&types=news&version=light&items=600'
      );
      const xmlText = await response.text();
      
      // Parse XML to JSON
      xml2js.parseString(xmlText, (err, result) => {
        if (err) {
          console.error('Failed to parse XML', err);
          return;
        }

        // Extract items and filter by keyword in the title
        const items = result.rss.channel[0].item;
        const filteredItems = items.filter((item) =>
          item.title[0].includes("Παναθην")
        );

        // Map filtered items to a structured format for rendering
        const mappedItems = filteredItems.map((item) => ({
          title: item.title[0],
          description: item.description[0],
          image: item["content:encoded"]
            ? item["content:encoded"][0].match(/src="([^"]+)"/)[1]
            : null,
        }));

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
        <View key={index} style={styles.newsItem}>
          {news.image && <Image source={{ uri: news.image }} style={styles.image} />}
          <Text style={styles.description}>{news.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  description: {
    fontSize: 16,
    color: '#333',
  },
});

export default Sport24News;
