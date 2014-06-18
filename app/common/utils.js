import { EPSILON } from './constants';

var Utils = {};

Utils.isEqual = function (a, b) {
  if (Math.abs(a - b) < EPSILON) {
    return true;
  }

  return false;
}

export default Utils;
