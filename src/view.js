import onChange from 'on-change';

const renderFeeds = (state, elements) => {
  const { feeds } = state;
  const ul = document.createElement('ul');
  elements.form.append(ul);
  feeds.forEach((item) => {
    const a = document.createElement('a');
    a.textContent = item.title;
    a.setAttribute('href', item.link);
    ul.append(a);
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
