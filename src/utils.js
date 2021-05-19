/* eslint-disable no-param-reassign */

import axios from 'axios';
import _ from 'lodash';
import parseXml from './parser';

const getDiff = (newData, currentData) => _.differenceWith(newData, currentData, _.isEqual);

export const isLinkLoaded = (url, state) => state.links.map(
  (link) => link.url,
).includes(url);

export const sendRequest = async (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/get';
  const instanceURL = new URL(proxy);
  instanceURL.searchParams.set('url', url);
  instanceURL.searchParams.set('disableCache', true);
  const apiURL = instanceURL.toString();
  const response = await axios.get(apiURL);
  return response.data.contents;
};

const autoUpdateRSS = async (link, state) => {
  const { url, id } = link;
  const xmlResponse = await sendRequest(url);
  const data = parseXml(xmlResponse);

  const { posts } = data;
  const statePosts = state.posts;
  const mappedStatePosts = statePosts.map((post) => {
    const { title, description } = post;
    return {
      title,
      description,
      link: post.link,
    };
  });
  const diff = getDiff(posts, mappedStatePosts);
  const mappedDiff = diff.map(
    (post, index) => ({ ...post, id, postId: statePosts.length + index }),
  );

  if (diff.length > 0) {
    state.posts = [...mappedDiff, ...statePosts];
    console.log(state.posts);
  }
  setTimeout(() => {
    autoUpdateRSS(link, state);
  }, 10000);
};

export const addRSS = (link, state, xml) => {
  const { feed, posts } = parseXml(xml);
  const { id } = link;
  const newFeed = { ...feed, id };
  state.feeds = [newFeed, ...state.feeds];
  const mappedPosts = posts.map((post) => ({ ...post, id }));
  state.posts = [...mappedPosts, ...state.posts]
    .map((post, index) => ({ ...post, postId: index + state.posts.length }));
  console.log(state.posts);

  autoUpdateRSS(link, state);
};
