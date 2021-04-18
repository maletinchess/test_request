import onChange from 'on-change';

const renderFeeds = (state, elements) => {
  const { feeds } = state.feeds;
  const ul = document.createElement('ul');
  elements.form.append(ul);
  feeds.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.title;
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
