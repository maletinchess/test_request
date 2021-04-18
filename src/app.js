import axios from 'axios';
import yup from 'yup';
import initview from './view';
import parseXml from './parser';

const getRss = async (url) => {
  const response = await axios.get(`https://hexlet-allorigins.herokuapp.com/raw?url=${url}`);
  return response.data;
};

const app = () => {
  const state = {
    form: {
      fields: {
        rssInput: '',
        error: null,
      },
      status: 'filling',
    },
    feeds: [],
  };

  const elements = {
    form: document.querySelector('form'),
    btn: document.querySelector('button'),
    input: document.querySelector('#inputUrl'),
  };

  const watchedState = initview(state, elements);
  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('name');

    try {
      const xml = await getRss(url);
      watchedState.feeds = [...watchedState.feeds, xml];
    } catch (err) {
      const div = document.createElement('div');
      elements.input.after(div);
      div.textContent = err;
    }
  });
};

export default app;
