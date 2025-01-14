import React from 'react';
import NewsComponent from './NewsComponent';

const parseItem = (item) => ({
  title: item.title[0],
  description: item.description[0],
  link: item.link[0],
  image: item["content:encoded"]
    ? item["content:encoded"][0].match(/src="([^"]+)"/)[1]
    : null,
});

const Sport24News = () => (
  <NewsComponent rssUrl="https://www.sport24.gr/newsfeed.xml?profile=public&types=news&version=light&items=600" filterKeyword="Παναθην" parseItem={parseItem} />
);

export default Sport24News;