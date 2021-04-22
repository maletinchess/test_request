const parseXml = (xmlString) => {
  const parser = new DOMParser();
  const docXml = parser.parseFromString(xmlString, 'text/xml');
  const title = docXml.getElementsByTagName('title')[0].textContent;
  const items = [...docXml.getElementsByTagName('item')];

  const reduceData = (collection) => {
    const filtered = collection.filter((item) => item.nodeName === 'description'
      || item.nodeName === 'title'
      || item.nodeName === 'link');
    const cb = (acc, item) => {
      const key = item.nodeName;
      const value = item.textContent;
      return { ...acc, [key]: value };
    };
    return filtered.reduce(cb, {});
  };

  const feeds = {
    title,
    description: docXml.getElementsByTagName('description')[0].textContent,
  };

  const posts = items
    .map((item) => [...item.children])
    .map((coll) => reduceData(coll));

  return {
    feeds,
    posts,
  };
};

export default parseXml;
