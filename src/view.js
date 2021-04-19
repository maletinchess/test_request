import onChange from 'on-change';

const renderFeeds = (state, elements) => {
  const { feeds } = state;
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  elements.posts.append(ul);

  const head = document.createElement('h2');
  head.textContent = 'Feeds';
  elements.feeds.append(head);
  const [dataForHead] = feeds;
  const divForHead = document.createElement('div');
  head.after(divForHead);
  const feedHead = document.createElement('h3');
  divForHead.append(feedHead);
  feedHead.textContent = dataForHead.title;
  const descriptionParagraf = document.createElement('p');
  feedHead.after(descriptionParagraf);
  descriptionParagraf.textContent = dataForHead.description;

  feeds.forEach((item) => {
    const a = document.createElement('a');
    const li = document.createElement('li');
    li.append(a);
    li.classList.add('list-group-item');
    a.textContent = item.title;
    a.setAttribute('href', item.link);
    ul.append(li);
  });
};

const initview = (state, elements) => {
  const mapping = {
    feeds: () => renderFeeds(state, elements),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });
  return watchedState;
};

export default initview;
