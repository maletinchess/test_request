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
