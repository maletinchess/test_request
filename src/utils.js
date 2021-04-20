const parseXml = (xmlString) => {
  const parser = new DOMParser();
  const docXml = parser.parseFromString(xmlString, 'application/xml');
  console.log(docXml);
  const itemsNode = docXml.getElementsByTagName('item');
  const channelNode = docXml.getElementsByTagName('channel');
  const channelTitle = channelNode[0].getElementsByTagName('title')[0].textContent;
  const id = channelTitle;
  const items = Object.values(itemsNode);
  const parsedItems = items
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
        type: title === id ? 'head' : 'post',
      };
    });
  return parsedItems;
};

export default parseXml;
