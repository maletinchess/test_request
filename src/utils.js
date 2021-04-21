const parseXml = (xmlString) => {
  const parser = new DOMParser();
  const docXml = parser.parseFromString(xmlString, 'text/xml');
  const itemsNode = docXml.getElementsByTagName('item');
  console.log(
    [...itemsNode].map((item) => [...item.children]),
  );
  const feedTitle = docXml.getElementsByTagName('title')[0].textContent;
  const feedDescription = docXml.getElementsByTagName('description')[0].textContent;
  console.log([feedTitle, feedDescription]);
  const id = feedTitle;
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
  console.log(parsedItems);
  return parsedItems;
};

export default parseXml;
