import React from 'react';
import NewsComponent from './NewsComponent';

const parseItem = (item) => ({
  title: item.title[0],
  description: item.description[0],
  link: item.link[0],
  image: item["media:content"]
    ? item["media:content"][0].$.url
    : null,
});

const SdnaNews = () => (
  <NewsComponent rssUrl="https://www.sdna.gr/latest.xml" filterKeyword="Παναθην" parseItem={parseItem} />
);

export default SdnaNews;