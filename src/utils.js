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
  const mappedPosts = posts.map((post) => ({ ...post, id }));
  const statePosts = state.posts;
  const diff = getDiff(mappedPosts, statePosts);
  console.log(diff);

  if (diff.length > 0) {
    state.posts = [...diff, ...statePosts];
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
  state.posts = [...mappedPosts, ...state.posts];

  autoUpdateRSS(link, state);
};
