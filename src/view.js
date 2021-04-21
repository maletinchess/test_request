/* eslint-disable no-param-reassign */

import onChange from 'on-change';

const buildErrorElement = (error) => {
  const el = document.createElement('div');
  el.classList.add('text-danger');
  el.textContent = error;
  return el;
};

const renderFormErrors = (form, elements) => {
  const error = elements.example.nextSibling;
  if (error) {
    error.remove();
  }

  const url = form.fields.rssUrl;
  if (!url.valid) {
    const errorElement = buildErrorElement(url.error);
    elements.example.after(errorElement);
  }
};

const renderAppErrors = (error, elements) => {
  if (!error) return;
  const appErrorElement = document.createElement('p');
  elements.example.after(appErrorElement);
  appErrorElement.textContent = error;
};

const buildFeedsDiv = (state, elements) => {
  const { feeds } = state;
  const head = document.createElement('h2');
  head.textContent = 'Feeds';
  elements.feeds.append(head);
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  ul.classList.add('mb-5');
  head.after(ul);
  const datasForHeads = feeds.filter((item) => item.type === 'head');
  datasForHeads.forEach((data) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    ul.append(li);
    const h = document.createElement('h3');
    li.append(h);
    h.textContent = data.title;
    const p = document.createElement('p');
    h.after(p);
    p.textContent = data.description;
  });
};

const renderFeeds = (state, elements) => {
  const { feeds } = state;
  elements.feeds.textContent = '';
  elements.posts.textContent = '';
  buildFeedsDiv(state, elements);
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  elements.posts.append(ul);
  const posts = feeds.filter((item) => item.type !== 'head');
  posts.forEach((item) => {
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
    'form.fields.rssUrl': () => renderFormErrors(state.form, elements),
    error: () => renderAppErrors(state.error, elements),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });
  return watchedState;
};

export default initview;
