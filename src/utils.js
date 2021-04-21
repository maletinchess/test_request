const parseXml = (xmlString, parseTo) => {
  const parser = new DOMParser();
  const docXml = parser.parseFromString(xmlString, 'text/xml');
  const id = docXml.getElementsByTagName('title')[0].textContent;
  const items = [...docXml.getElementsByTagName('item')];

  const reduceData = (collection) => {
    const cb = (acc, item) => {
      const key = item.nodeName;
      const value = item.textContent;
      return { ...acc, [key]: value, id };
    };
    return collection.reduce(cb, {});
  };

  switch (parseTo) {
    case 'feeds':
      return {
        title: id,
        description: docXml.getElementsByTagName('description')[0].textContent,
        id,
      };
    case 'posts':
      return items
        .map((item) => [...item.children])
        .map((coll) => reduceData(coll));
    default:
      throw new Error(`Unknown type of parsing ${parseTo}`);
  }
};

export default parseXml;
