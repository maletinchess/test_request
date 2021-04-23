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

const renderFeeds = (feeds, elements) => {
  elements.feeds.textContent = '';
  const head = document.createElement('h2');
  head.textContent = 'Feeds';
  elements.feeds.append(head);
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  ul.classList.add('mb-5');
  head.after(ul);
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    ul.append(li);
    const h = document.createElement('h3');
    li.append(h);
    h.textContent = feed.title;
    const p = document.createElement('p');
    h.after(p);
    p.textContent = feed.description;
  });
};

const renderPosts = (posts, elements) => {
  elements.posts.textContent = '';
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  elements.posts.append(ul);
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

const renderTest = (state) => {
  const testElement = document.createElement('div');
  testElement.textContent = state.test;
};

const initview = (state, elements) => {
  const mapping = {
    feeds: () => renderFeeds(state.feeds, elements),
    posts: () => renderPosts(state.posts, elements),
    'form.fields.rssUrl': () => renderFormErrors(state.form, elements),
    error: () => renderAppErrors(state.error, elements),
    test: () => renderTest(state),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });
  return watchedState;
};

export default initview;
