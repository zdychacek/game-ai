import { EPSILON } from './constants';

class Utils {
  static isEqual (a, b) {
    if (Math.abs(a - b) < EPSILON) {
      return true;
    }

    return false;
  }
}

export default Utils;
