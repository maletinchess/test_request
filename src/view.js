/* eslint-disable no-param-reassign */

import onChange from 'on-change';

const buildFeedsDiv = (state, elements) => {
  const { feeds } = state;
  const head = document.createElement('h2');
  head.textContent = 'Feeds';
  elements.feeds.append(head);
  const ul = document.createElement('ul');
  head.after(ul);
  const datasForHeads = feeds.filter((item) => item.type === 'head');
  datasForHeads.forEach((data) => {
    const li = document.createElement('li');
    ul.append(li);
    const h = document.createElement('h');
    li.append(h);
    h.textContent = data.title;
    const p = document.createElement('p');
    h.after(p);
    p.textContent = data.description;
  });
};

const renderFeeds = (state, elements) => {
  const { feeds } = state;
  elements.posts.textContent = '';
  elements.posts.textContent = '';
  buildFeedsDiv(state, elements);
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  elements.posts.append(ul);
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
