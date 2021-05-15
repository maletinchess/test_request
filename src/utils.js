/* eslint-disable no-param-reassign */

import axios from 'axios';
import _ from 'lodash';
import parseXml from './parser';

const getDiff = (data1, data2) => _.differenceWith(data1, data2, _.isEqual);

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
  const diff = getDiff(state.posts, mappedPosts);

  if (diff.length > 0) {
    state.posts = [...mappedPosts, ...diff];
  }
  setTimeout(() => {
    autoUpdateRSS(link, state);
  }, 5000);
};

export const addRSS = (link, state, xml) => {
  const { feed, posts } = parseXml(xml);
  const { id } = link;
  const newFeed = { ...feed, id };
  state.feeds = [...state.feeds, newFeed];
  const mappedPosts = posts.map((post) => ({ ...post, id }));
  state.posts = [...state.posts, ...mappedPosts];

  autoUpdateRSS(link, state);
};
