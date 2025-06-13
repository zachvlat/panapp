import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { parseString } from 'react-native-xml2js';

const OfficialPaoNews = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const response = await axios.get('https://corsproxy.io/?https://www.pao.gr/post-sitemap11.xml');
        parseString(response.data, (err, result) => {
          if (err) {
            console.error('XML Parse Error:', err);
            setLoading(false);
            return;
          }
          const urls = result.urlset.url.map(entry => entry.loc[0]);
          const latestTen = urls.reverse().slice(0, 10);
          setLinks(latestTen);
        });
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  const formatSlugAsTitle = (url) => {
    const slug = url.split('/').filter(Boolean).pop();
    const words = slug.replace(/-/g, ' ');
    return words.charAt(0).toUpperCase() + words.slice(1);
  };

  const handlePress = (url) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        links.map((url, index) => (
          <TouchableOpacity key={index} onPress={() => handlePress(url)} style={styles.linkContainer}>
            <Text style={styles.linkText}>{formatSlugAsTitle(url)}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'rgb(29, 94, 56)',
    minHeight: '100%',
    borderRadius: 8,
  },
  linkContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  linkText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 16,
  },
});

export default OfficialPaoNews;
