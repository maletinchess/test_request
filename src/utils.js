import _ from 'lodash';

const arr1 = [
  {
    id: 2, name: '003',
  },
  {
    id: 2, name: '002',
  },
  {
    id: 2, name: '001',
  },
];

const arr2 = [
  {
    id: 2, name: '004',
  },
  {
    id: 2, name: '003',
  },
  {
    id: 2, name: '002',
  },
];

const diff = _.differenceWith(arr1, arr2, _.isEqual);
const newWithDiff = [...arr2, ...diff];

const arr3 = [
  {
    id: 2, name: '005',
  },
  {
    id: 2, name: '004',
  },
  {
    id: 2, name: '003',
  },
];

const diff1 = _.differenceWith(newWithDiff, arr3, _.isEqual);
console.log(diff1);
