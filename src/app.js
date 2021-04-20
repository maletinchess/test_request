import axios from 'axios';
import * as yup from 'yup';
import initview from './view';
import parseXml from './utils';

const getRss = async (url) => {
  const response = await axios.get(`https://hexlet-allorigins.herokuapp.com/raw?url=${url}`);
  return response.data;
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
    urls: [],
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

    if (watchedState.urls.includes(url)) {
      watchedState.form.fields.rssUrl = {
        valid: false,
        error: 'RSS is already exist',
      };
      return;
    }

    watchedState.urls = [url, ...watchedState.urls];

    const error = validate(url);

    if (error) {
      watchedState.form.fields.rssUrl = {
        valid: false,
        error,
      };
      return;
    }

    watchedState.form.fields.rssUrl = {
      error: null,
      valid: true,
    };

    try {
      watchedState.error = null;
      watchedState.form.status = 'loading';
      const xml = await getRss(url);
      watchedState.feeds = [...watchedState.feeds, ...parseXml(xml)];
      watchedState.form.status = 'finished';
    } catch (err) {
      watchedState.form.status = 'failed';
      watchedState.error = err.message;
    }
  });
};

export default app;
