import React from 'react';
import NewsComponent from './NewsComponent';

const parseItem = (item) => {
  const imageMatch = item["content:encoded"]
    ? item["content:encoded"][0].match(/<img.*?src="(.*?)"/)
    : null;
  return {
    title: item.title[0],
    description: item.description[0],
    link: item.link[0],
    image: imageMatch ? imageMatch[1] : null,
  };
};

const Leoforos1908News = () => (
  <NewsComponent rssUrl="https://leoforos1908.gr/?feed=rss2" parseItem={parseItem} />
);

export default Leoforos1908News;