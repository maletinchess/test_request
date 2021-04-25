/* eslint-disable no-param-reassign */

import onChange from 'on-change';

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
  console.log(elements.posts);
  elements.posts.innerHTML = '';
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

const renderForm = (dataProcess, elements) => {
  switch (dataProcess) {
    case 'filling':
      elements.submitBtn.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      elements.input.value = '';
      break;
    case 'loading':
      elements.submitBtn.setAttribute('disabled', true);
      elements.input.setAttribute('disabled', true);
      break;
    case 'failed':
      elements.submitBtn.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      elements.input.select();
      break;
    case 'added':
      elements.submitBtn.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      elements.input.value = '';
      elements.feedback.classList.add('text-success');
      elements.textContent = 'RSS loaded';
      break;
    default:
      throw new Error(`Unknown process ${dataProcess}`);
  }
};

const dataProcessHandler = (state, elements) => {
  switch (state.dataProcess) {
    case 'filling':
      renderForm('filling', elements);
      break;
    case 'loading':
      renderForm('loading', elements);
      break;
    case 'failed':
      renderForm('failed', elements);
      break;
    case 'added':
      console.log(elements.feeds);
      renderFeeds(state.feeds, elements);
      renderPosts(state.posts, elements);
      renderForm('added', elements);
      break;
    case 'updated':
      renderFeeds(state.feeds, elements);
      renderPosts(state.posts, elements);
      break;
    default:
      throw new Error(`Unknown process state ${state.dataProcess}`);
  }
};

const renderFormError = (form, elements) => {
  const url = form.fields.rssUrl;
  if (url.valid) {
    elements.input.classList.remove('danger-text');
    elements.input.classList.remove('is-invalid');
  } else {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.add('danger-text');
    elements.feedback.textContent = url.error;
  }
};

const renderAppError = (error, elements) => {
  if (!error) {
    elements.feedback.textContent = '';
    elements.classList.remove('danger-text');
  } else {
    elements.feedback.textContent = error;
    elements.feedback.classList.add('danger-text');
  }
};

const initview = (state, elements) => {
  const mapping = {
    dataProcess: () => dataProcessHandler(state, elements),
    error: () => renderAppError(state.error, elements),
    'form.fields.rssUrl': () => renderFormError(state.form, elements),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });
  return watchedState;
};

export default initview;
