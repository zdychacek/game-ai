import { EPSILON } from './constants';

class Utils {
  static isEqual (a, b) {
    if (Math.abs(a - b) < EPSILON) {
      return true;
    }

    return false;
  }

  static getTime () {
    return +new Date;
  }

  // returns a random double between zero and 1
  static randFloat () {
    return Math.random();
  }

  // returns a random double in the range -1 < n < 1
  static randomClamped () {
    return this.randFloat() - this.randFloat();
  }
}

export default Utils;
