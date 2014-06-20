import { EPSILON } from './constants';
import Utils from './Utils';

class Vector2D {
  constructor (a, b) {
    this.x = 0;
    this.y = 0;

    // create vector from two numbers
    if (arguments.length == 2) {
      this.x = a;
      this.y = b;
    }
    // create vector from another vector instance
    else if (arguments[0] instanceof Vector2D) {
      this.set(arguments[0]);
    }
  }

  set (v) {
    this.x = v.x;
    this.y = v.y;
  }

  zero () {
    this.x = 0;
    this.y = 0;
  }

  isZero () {
    return (this.x * this.x + this.y * this.y) < Number.MIN_VALUE;
  }

  get length () {
    return Math.sqrt(this.lengthSq);
  }

  get lengthSq () {
    return this.x * this.x + this.y * this.y;
  }

  normalize () {
    var vecLen = this.length;

    if (vecLen > EPSILON) {
      this.x /= vecLen;
      this.y /= vecLen;
    }
  }

  dot (v2) {
    return this.x * v2.x + this.y * v2.y;
  }

  sign (v2) {
    if (this.y * v2.x > this.x * v2.y) {
      return Vector2D.anticlockwise;
    }
    else {
      return Vector2D.clockwise;
    }
  }

  get perp () {
    return new Vector2D(-this.y, this.x);
  }

  truncate (max) {
    if (this.length > max) {
      this.normalize();
      this.mul(max);
    }
  }

  distance (v2) {
    var distSq = this.distanceSq(v2);

    return Math.sqrt(distSq);
  }

  distanceSq (v2) {
    var ySeparation = v2.y - this.y;
    var xSeparation = v2.x - this.x;

    return ySeparation * ySeparation + xSeparation * xSeparation;
  }

  reflect (norm) {
    this.add(norm.getReverse().mul(2.0 * this.dot(norm)));
  }

  getReverse () {
    return new Vector2D(-this.x, -this.y);
  }

  add (rhs) {
    this.x += rhs.x;
    this.y += rhs.y;

    return this;
  }

  sub (rhs) {
    this.x -= rhs.x;
    this.y -= rhs.y;

    return this;
  }

  mul (rhs) {
    this.x *= rhs;
    this.y *= rhs;

    return this;
  }

  div (rhs) {
    this.x /= rhs;
    this.y /= rhs;

    return this;
  }

  isEqual (rhs) {
    return Utils.isEqual(this.x, rhs.x) && Utils.isEqual(this.y, rhs.y);
  }

  notEqual (rhs) {
    return (this.x != rhs.x) || (this.y != rhs.y);
  }

  // Static methods
  static mul (vector, val) {
    var result = new Vector2D(vector);
    result.mul(val);

    return result;
  }

  static div (vector, val) {
    var result = new Vector2D(vector);

    result.x /= val;
    result.y /= val;

    return result;
  }

  static sub (lhs, rhs) {
    var result = new Vector2D(lhs);

    result.x -= rhs.x;
    result.y -= rhs.y;

    return result;
  }

  static add (lhs, rhs) {
    var result = new Vector2D(lhs);

    result.x += rhs.x;
    result.y += rhs.y;

    return result;
  }

  static vec2DNormalize (v) {
    var vec = new this(v);
    var vecLen = vec.length;

    if (vecLen > EPSILON) {
        vec.x /= vecLen;
        vec.y /= vecLen;
    }

    return vec;
  }

  static vec2DDistance (v1, v2) {
    var ySeparation = v2.y - v1.y;
    var xSeparation = v2.x - v1.x;

    return Math.sqrt(ySeparation * ySeparation + xSeparation * xSeparation);
  }

  static vec2DDistanceSq (v1, v2) {
    var ySeparation = v2.y - v1.y;
    var xSeparation = v2.x - v1.x;

    return ySeparation * ySeparation + xSeparation * xSeparation;
  }

  static vec2DLength (v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static vec2DLengthSq (v) {
    return (v.x * v.x + v.y * v.y);
  }

  static pointToVector (p) {
    return new Vector2D(p.x, p.y);
  }

  static vectorToPoint (v) {
    return {
      x: v.x,
      y: v.y
    };
  }

  static wrapAround (pos, maxX, maxY) {
    if (pos.x > maxX) {
        pos.x = 0.0;
    }

    if (pos.x < 0) {
        pos.x = maxX;
    }

    if (pos.y < 0) {
        pos.y = maxY;
    }

    if (pos.y > maxY) {
        pos.y = 0.0;
    }
  }

  /**
   * Returns true if the point p is not inside the region defined by topLeft and botRight
   */
  static notInsideRegion (p, topLeft, botRight) {
    return (p.x < topLeft.x) || (p.x > botRight.x) || (p.y < topLeft.y) || (p.y > botRight.y);
  }

  static insideRegion (p, topLeft, botRight) {
    return !((p.x < topLeft.x) || (p.x > botRight.x) || (p.y < topLeft.y) || (p.y > botRight.y));
  }

  /**
   * true if the target position is in the field of view of the entity positioned at posFirst facing in facingFirst
   */
  static isSecondInFOVOfFirst (posFirst, facingFirst, posSecond, fov) {
    var toTarget = this.vec2DNormalize(this.sub(posSecond, posFirst));

    return facingFirst.dot(toTarget) >= Math.cos(fov / 2.0);
  }

  static cloneVectors (vectors) {
    var arr = [];

    for (var v of vectors) {
      arr.push(new Vector2D(v));
    }

    return arr;
  }
}

Vector2D.clockwise = 1;
Vector2D.anticlockwise = -1;

export default Vector2D;
