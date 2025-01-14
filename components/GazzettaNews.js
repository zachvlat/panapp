import React from 'react';
import NewsComponent from './NewsComponent';

const parseItem = (item) => ({
  title: item.title[0],
  description: item.description[0],
  link: item.link[0],
  image: item['media:content'] ? item['media:content'][0].$.url : null,
});

const GazzettaNews = () => (
  <NewsComponent rssUrl="https://www.gazzetta.gr/teams/panathinaikos/rss" filterKeyword="Παναθηναϊκός" parseItem={parseItem} />
);

export default GazzettaNews;