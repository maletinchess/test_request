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

export default parseXml;

const url = 'https://ru.wikipedia.org/w/api.php?hidebots=1&hidecategorization=1&hideWikibase=1&urlversion=1&days=7&limit=50&action=feedrecentchanges&feedformat=rss';
