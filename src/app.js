import axios from 'axios';

const getRss = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const elements = {
  form: document.querySelector('form'),
  btn: document.querySelector('button'),
  input: document.querySelector('#inputUrl'),
};

const app = () => {
  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('name');
    console.log(url);

    try {
      const data = await getRss(url);
      const newDiv = document.createElement('div');
      elements.form.append(newDiv);
      newDiv.textContent = data;
    } catch (err) {
      const newDiv = document.createElement('div');
      elements.form.append(newDiv);
      newDiv.textContent = err;
    }
  });
};

export default app;
