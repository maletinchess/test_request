import axios from 'axios';
import * as yup from 'yup';
import initview from './view';
import parseXml from './parser';

const getRss = async (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/raw?url=';
  const response = await axios.get(`${proxy}${encodeURIComponent(url)}`);
  return response.data;
};

const checkDoubling = (currentUrls, url) => currentUrls.includes(url);

const setId = (item, id) => {
  const result = {
    ...item, id,
  };
  return result;
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
  };

  const elements = {
    form: document.querySelector('form'),
    btn: document.querySelector('button'),
    input: document.querySelector('input'),
    example: document.querySelector('p.text-muted'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const watchedState = initview(state, elements);
  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');

    const urls = watchedState.links.map((link) => link.url);

    if (checkDoubling(urls, url)) {
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

    const link = {
      url,
      id: watchedState.linksCount,
    };

    watchedState.links = [link, ...watchedState.links];

    watchedState.form.fields.rssUrl = {
      error: null,
      valid: true,
    };

    try {
      watchedState.error = null;
      watchedState.form.status = 'loading';
      const xml = await getRss(url);
      const data = parseXml(xml);
      console.log(data);
      const id = watchedState.linksCount;
      const posts = data.posts.map((post) => setId(post, id));
      const feed = setId(data.feed, id);
      console.log(feed);
      watchedState.posts = [...watchedState.posts, ...posts];
      watchedState.feeds = [...watchedState.feeds, feed];
      watchedState.form.status = 'finished';
    } catch (err) {
      watchedState.form.status = 'failed';
      watchedState.error = err.message;
    }
  });
};

export default app;
