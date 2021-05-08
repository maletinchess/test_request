/* eslint-disable no-param-reassign */

import axios from 'axios';
import * as yup from 'yup';
import { setLocale } from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import initview from './view2';
import parseXml from './parser';
import resources from './locales';

const getRss = async (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/get';
  const instanceURL = new URL(proxy);
  instanceURL.searchParams.set('url', url);
  instanceURL.searchParams.set('disableCache', true);
  const apiURL = instanceURL.toString();
  const response = await axios.get(apiURL);
  return response.data.contents;
};

const isLinkLoaded = (currentUrls, url) => currentUrls.includes(url);

const addLink = (url, state, id) => {
  const link = {
    url,
    id,
  };
  state.links = [...state.links, link];
};

const updater = (state) => {
  const { links, feeds, posts } = state;
  links.forEach(async (link) => {
    const { id, url } = link;
    const xml = await getRss(url);
    const data = parseXml(xml);
    const filteredFeeds = feeds.filter((feed) => feed.id !== id);
    const newFeed = { ...data.feed, id };
    state.feeds = [newFeed, ...filteredFeeds].sort((a, b) => b.id > a.id);
    const receivedPostsWithId = data.posts.map((post) => ({ ...post, id, read: false }));
    const diff = _.differenceWith(posts, receivedPostsWithId, _.isEqual);
    state.posts = [...receivedPostsWithId, ...diff].sort((a, b) => b.id > a.id);
  });

  setTimeout(() => {
    updater(state);
  }, 5000);
};

const validate = (value) => {
  setLocale({
    string: {
      matches: i18next.t('errors.invalidRSS'),
      url: i18next.t('errors.invalidUrl'),
    },
  });
  const schema = yup
    .string()
    .trim()
    .url()
    .matches(/rss/);
  try {
    schema.validateSync(value);
    return null;
  } catch (err) {
    return err.errors;
  }
};

const app = async () => {
  const defaultLanguage = 'en';
  await i18next.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  });

  const state = {
    form: {
      fields: {
        rssUrl: {
          valid: true,
          error: null,
        },
      },
      status: 'filling',
    },
    feeds: [],
    posts: [],
    links: [],
    linksCount: 0,
    error: null,
    dataProcess: '',
  };

  const elements = {
    body: document.body,
    form: document.querySelector('form'),
    submitBtn: document.querySelector('button'),
    input: document.querySelector('input'),
    example: document.querySelector('p.text-muted'),
    feedback: document.querySelector('div.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modalDiv: document.querySelector('#modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalRef: document.querySelector('.full-article'),
    modalButtons: document.querySelectorAll('button[data-bs-toggle="modal"]'),
  };

  const watchedState = initview(state, elements);

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

    const urls = watchedState.links.map((link) => link.url);
    if (isLinkLoaded(urls, url)) {
      watchedState.form.fields.rssUrl = {
        error: 'errors.existed',
        valid: false,
      };
      return;
    }

    const error = validate(url);
    if (error) {
      watchedState.form.fields.rssUrl = {
        valid: false,
        error,
      };
      return;
    }

    watchedState.linksCount += 1;
    addLink(url, watchedState, watchedState.linksCount);

    watchedState.form.fields.rssUrl = {
      error: null,
      valid: true,
    };
    watchedState.error = null;
    watchedState.dataProcess = 'loading';

    try {
      await updater(watchedState);
      watchedState.dataProcess = 'added';
    } catch (err) {
      watchedState.dataProcess = 'failed';
      watchedState.error = err.message;
    }
  });
  setInterval(() => console.log(elements.modalButtons), 2000);

  const modalButtonsHandler = (button) => button.addEventListener('click', (e) => {
    const buttonElem = e.target.value;
    const id = buttonElem.getAttribute('data-id');
    const readedPost = watchedState.posts.find((post) => post.id === id);
    readedPost.read = true;
  });

  elements.modalButtons.forEach(modalButtonsHandler);
};

export default app;
