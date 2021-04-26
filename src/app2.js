/* eslint-disable no-param-reassign */

import axios from 'axios';
import * as yup from 'yup';
import initview from './view2';
import parseXml from './parser';

const getRss = async (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/get';
  const instanceURL = new URL(proxy);
  instanceURL.searchParams.set('url', url);
  instanceURL.searchParams.set('disableCache', true);
  const apiURL = instanceURL.toString();
  const response = await axios.get(apiURL);
  console.log(response);
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
    const filteredPosts = posts.filter((post) => post.id !== id);
    const filteredFeeds = feeds.filter((feed) => feed.id !== id);
    const data = parseXml(xml);
    const newFeed = { ...data.feed, id };
    state.feeds = [...filteredFeeds, newFeed];
    const newPosts = data.posts.map((post) => ({ ...post, id }));
    state.posts = [...filteredPosts, ...newPosts];
  });
};

const validate = (value) => {
  const schema = yup
    .string()
    .trim()
    .url()
    .matches(/rss/);
  try {
    schema.validateSync(value);
    return null;
  } catch (err) {
    return err.message;
  }
};

const app = () => {
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
    form: document.querySelector('form'),
    submitBtn: document.querySelector('button'),
    input: document.querySelector('input'),
    example: document.querySelector('p.text-muted'),
    feedback: document.querySelector('div.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const watchedState = initview(state, elements);

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

    const urls = watchedState.links.map((link) => link.url);
    if (isLinkLoaded(urls, url)) {
      watchedState.form.fields.rssUrl = {
        error: 'RSS is exist already',
        valid: false,
      };
      return;
    }

    const error = validate(url);
    if (error) {
      watchedState.form.fields.rssUrl = {
        valid: false,
        error: error === 'this must match the following: "/rss/"'
          ? 'Resource does not contain a valid RSS'
          : error,
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
  setInterval(async () => {
    await updater(watchedState);
  }, 5000);
};

export default app;
