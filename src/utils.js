import xmldom from 'xmldom';

const reminderUrl = 'https://reminder.media/rss';
const hexletUrl = 'https://ru.hexlet.io/lessons.rss';

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
