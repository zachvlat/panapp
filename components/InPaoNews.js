import React from 'react';
import NewsComponent from './NewsComponent';

const parseItem = (item) => {
  const imageMatch = item.description[0]
    ? item.description[0].match(/<img.*?src="(.*?)"/)
    : null;
  return {
    title: item.title[0],
    description: item.description[0].replace(/<[^>]*>?/gm, ''), // Remove HTML tags
    link: item.link[0],
    image: imageMatch ? imageMatch[1] : null,
  };
};

const InPaoNews = () => (
  <NewsComponent rssUrl="https://www.inpao.gr/feed/" parseItem={parseItem} />
);

export default InPaoNews;