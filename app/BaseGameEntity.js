import Vector2D from './common/Vector2D';

/**
 * Base game entity class.
 */
class BaseGameEntity {
  /**
   * .ctor
   */
  constructor ({
    entityType = BaseGameEntity.defaultEntityType,
    vPosition = new Vector2D(),
    radius = 0,
    forceId
  }) {
    // each entity has a unique ID
    this._id = forceId || this._getNextValidId();
    // every entity has a type associated with it (health, troll, ammo etc)
    this._entityType = entityType;
    // this is a generic flag
    this._tag = false;
    // its location in the environment
    this._vPosition = vPosition;
    // entity scale
    this._vScale = new Vector2D(1, 1);;
    // the length of this object's bounding radius
    this._boundingRadius = radius;
  }

  update (dt) {
    throw new Error('Not implemented.');
  }

  render (ctx) {
    throw new Error('Not implemented.');
  }

  handleMessage (msg) {
    return false;
  }

  toString () {
    return `x: ${this._vPosition.x}, y: ${this._vPosition.y}`;
  }

  get pos () {
    return new Vector2D(this._vPosition);
  }

  set pos (newPos) {
    this._vPosition = new Vector2D(newPos);
  }

  get BRadius () {
    return this._boundingRadius;
  }

  set BRadius (radius) {
    this._boundingRadius = radius;
  }

  get Id () {
    return this._id;
  }

  get isTagged () {
    return this._tag;
  }

  tag () {
    this._tag = true;
  }

  unTag () {
    this._tag = false;
  }

  get scale () {
    return new Vector2D(this._vScale);
  }

  set scale (val) {
    if (val instanceof Vector2D) {
      this._boundingRadius *= Math.max(val.x, val.y) / Math.max(this._vScale.x, this._vScale.y);
      this._vScale = new Vector2D(val);
    }
    else {
      this._boundingRadius *= val / Math.max(this.vScale.x, this.vScale.y);
      this.vScale = new Vector2D(val, val);
    }
  }

  get entityType () {
    return this._entityType;
  }

  set entityType (newType) {
    this._entityType = newType;
  }

  _getNextValidId () {
    return this.constructor.nextId++;
  }

  static resetValidId () {
    this.nextId = 0;
  }
}

BaseGameEntity.nextId = 0;
BaseGameEntity.defaultEntityType = -1;

export default BaseGameEntity;
