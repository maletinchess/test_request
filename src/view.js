import onChange from 'on-change';

const buildDivWithPosts = () => {
  const feedsContainer = document.createElement('div');
  feedsContainer.classList.add('container');
  const headContainer = document.createElement('div');
  headContainer.classList.add('row');
  const head = document.createElement('div');
  head.classList.add('col-10');
  head.innerHTML = '<h2>Feeds</h2>';
  headContainer.append(head);
  feedsContainer.append(headContainer);
  const linksUl = document.createElement('ul');
  headContainer.after(linksUl);
};

const renderFeeds = (state, elements) => {
  const container = document.querySelector('container');
  if (container) {
    container.remove();
  }
  buildDivWithPosts();
  const newContainer = document.querySelector('container');
  const { feeds } = state;
  const ul = document.querySelector('ul');
  elements.form.after(newContainer);
  feeds.forEach((item) => {
    const a = document.createElement('a');
    const li = document.createElement('li');
    li.append(a);
    a.textContent = item.title;
    a.setAttribute('href', item.link);
    ul.append(li);
  });
};

const initview = (state, elements) => {
  const mapping = {
    feeds: () => renderFeeds(state, elements),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });
  return watchedState;
};

export default initview;
