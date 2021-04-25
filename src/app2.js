/* eslint-disable no-param-reassign */

import axios from 'axios';
import * as yup from 'yup';
import initview from './view2';
import parseXml from './parser';

const getRss = async (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/raw?url=';
  const response = await axios.get(`${proxy}${encodeURIComponent(url)}`);
  return response.data;
};

const isExist = (currentUrls, url) => currentUrls.includes(url);

const setId = (item, id) => {
  const result = {
    ...item, id,
  };
  return result;
};

const updateLinksData = (url, xml, state, id) => {
  const link = {
    url,
    xml,
    id,
  };
  state.links = [...state.links, link];
};

const updateDataForRendering = (data, state, id) => {
  const { feed } = data;
  const { posts } = data;
  state.feeds = [...state.feeds, { ...feed, id }];
  state.posts = [...state.posts, posts.map((post) => setId(post))];
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
    processData: '',
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
    if (isExist(urls, url)) {
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

    try {
      console.log(watchedState);
      watchedState.linksCount += 1;
      const id = watchedState.linksCount;
      watchedState.form.fields.rssUrl = {
        error: null,
        valid: true,
      };
      watchedState.error = null;
      watchedState.form.status = 'loading';
      const xml = await getRss(url);
      const data = parseXml(xml);
      updateLinksData(url, xml, watchedState, id);
      updateDataForRendering(data, watchedState, id);
      watchedState.processData = 'added';
      console.log(watchedState);
    } catch (err) {
      watchedState.processData = 'failed';
      watchedState.error = err.message;
    }
  });

  const updateLink = async (link) => {
    const newXml = await getRss(link.url);
    if (link.xml !== newXml) {
      updateLinksData(link.url, newXml, watchedState, link.id);
      const newData = parseXml(newXml);
      updateDataForRendering(newData, watchedState, link.id);
      watchedState.processData = 'updated';
    }
  };

  const autoUpdate = () => {
    setInterval(() => {
      watchedState.links.forEach((link) => {
        updateLink(link);
      });
    }, 5000);
  };

  autoUpdate();
};

export default app;
