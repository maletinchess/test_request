/* eslint-disable no-param-reassign */

import 'jquery';
import 'bootstrap/js/dist/modal';
import onChange from 'on-change';
import i18next from 'i18next';

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

const buildModalElement = (data, id, elements) => {
  const modalElement = document.createElement('li');
  modalElement.classList.add('list-group-item');
  modalElement.classList.add('d-flex');
  modalElement.classList.add('justify-content-between');
  modalElement.classList.add('align-items-start');

  const a = document.createElement('a');
  a.setAttribute('href', data.link);
  a.classList.add('font-weight-bold');
  a.setAttribute('data-id', id);
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  a.textContent = data.title;

  const btnModal = document.createElement('button');
  btnModal.setAttribute('type', 'button');
  btnModal.classList.add('btn');
  btnModal.classList.add('btn-primary');
  btnModal.classList.add('btn-sm');
  btnModal.setAttribute('data-id', id);
  btnModal.setAttribute('data-bs-toggle', 'modal');
  btnModal.setAttribute('data-bs-target', '#modal');
  btnModal.textContent = i18next.t('view');

  btnModal.addEventListener('click', () => {
    elements.modalBody.textContent = '!!!!!!!';
  });

  modalElement.append(a);
  modalElement.append(btnModal);

  return modalElement;
};

const renderPosts = (posts, elements) => {
  elements.posts.innerHTML = '';
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  elements.posts.append(ul);
  posts.forEach((post) => {
    const modal = buildModalElement(post, post.id);
    ul.append(modal);
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
      elements.feedback.classList.remove('text-danger');
      elements.feedback.textContent = i18next.t('success');
      break;
    default:
      throw new Error(`Unknown process ${dataProcess}`);
  }
};

const renderFormError = (form, elements) => {
  const url = form.fields.rssUrl;
  if (url.valid) {
    elements.input.classList.remove('danger-text');
    elements.input.classList.remove('is-invalid');
  } else {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = i18next.t(url.error);
  }
};

const renderAppError = (error, elements) => {
  if (!error) {
    elements.feedback.textContent = '';
    elements.feedback.classList.remove('danger-text');
  } else {
    elements.feedback.textContent = error;
    elements.feedback.classList.add('text-danger');
  }
};

const initview = (state, elements) => {
  const mapping = {
    dataProcess: () => renderForm(state.dataProcess, elements),
    error: () => renderAppError(state.error, elements),
    'form.fields.rssUrl': () => renderFormError(state.form, elements),
    feeds: () => renderFeeds(state.feeds, elements),
    posts: () => renderPosts(state.posts, elements),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });
  return watchedState;
};

export default initview;
