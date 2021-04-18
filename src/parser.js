import fs from 'fs';
import axios from 'axios';

import xmldom from 'xmldom';

const reminderUrl = 'https://reminder.media/rss';
const hexletUrl = 'https://ru.hexlet.io/lessons.rss';

const xmlString = fs.readFileSync('/home/maletinchess/test_request/test_request/tests/__fixtures__/exampleXML.xml', 'utf-8');
const parser = new xmldom.DOMParser();
const doc = parser.parseFromString(xmlString);
const itemsNode = doc.getElementsByTagName('item');
const channelNode = doc.getElementsByTagName('channel');
const channelTitle = channelNode[0].getElementsByTagName('title')[0].textContent;
const id = channelTitle;

const items = Object.values(itemsNode);
const texts = items
  .filter((item) => typeof (item) === 'object')
  .map((item) => {
    const title = item.getElementsByTagName('title')[0].textContent;
    const link = item.getElementsByTagName('link')[0].textContent;
    const description = item.getElementsByTagName('description')[0].textContent;
    return {
      title,
      link,
      description,
      id,
    };
  });

console.log(texts);

const parseXml = (xml) => {
  const parseItem = (itemStr) => {
    const title = itemStr.split('</title>')[0].split('<title>')[1].trim();
    const link = itemStr.split('</link>')[0].split('<link>')[1];
    const description = itemStr.split('</description>')[0].split('<description>')[1];
    return {
      title,
      link,
      description,
    };
  };

  const channelData = xml.split('<item>').map((item) => parseItem(item));
  return channelData;
};

const outputRssData = (xml) => {
  const data = parseXml(xml);
  const [channel, ...rest] = data;
  console.log(channel);
  console.log('\n');
  console.log(rest);
};

export default parseXml;
