/* eslint-disable no-param-reassign */

import * as yup from 'yup';
import { setLocale } from 'yup';
import i18next from 'i18next';
import initview from './view2';
import { addRSS, sendRequest, isLinkLoaded } from './utils';
import resources from './locales';

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
    modalCount: 0,
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

    if (isLinkLoaded(url, watchedState)) {
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
    const newLink = { url, id: watchedState.linksCount };
    watchedState.links = [newLink, ...watchedState.links];

    watchedState.form.fields.rssUrl = {
      error: null,
      valid: true,
    };
    watchedState.error = null;
    watchedState.dataProcess = 'loading';

    try {
      const xml = await sendRequest(url);
      addRSS(newLink, watchedState, xml);
      watchedState.dataProcess = 'added';
    } catch (err) {
      watchedState.dataProcess = 'failed';
      watchedState.error = err.message;
    }
  });

  elements.modalDiv.addEventListener('shown.bs.modal', (e) => {
    watchedState.modalCount += 1;
    console.log(e.target);
    console.log(watchedState.modalCount);
  });
};

export default app;
