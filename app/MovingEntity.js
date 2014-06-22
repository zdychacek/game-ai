import Vector2D from './common/Vector2D';
import C2DMatrix from './common/C2DMatrix';
import BaseGameEntity from './BaseGameEntity';

/**
 * This class implements moving entity.
 */
class MovingEntity extends BaseGameEntity {
  /**
   * .ctor
   */
  constructor ({
    vPosition,
    radius,
    vVelocity,
    maxSpeed,
    vHeading,
    mass,
    vScale = new Vector2D(1, 1),
    maxTurnRate,
    maxForce
  }) {
    // call base class constructor
    super({
      entityType: 0,
      vPosition,
      radius
    });

    this._vHeading = new Vector2D(vHeading);
    this._vSide = this._vHeading.perp;
    this._vVelocity = new Vector2D(vVelocity);
    this._vScale = new Vector2D(vScale);
    this._mass = mass;
    this._maxSpeed = maxSpeed;
    this._maxTurnRate = maxTurnRate;
    this._maxForce = maxForce;
  }

  get velocity () {
    return new Vector2D(this._vVelocity);
  }

  set velocity (vNewVel) {
    this._vVelocity = vNewVel;
  }

  get mass () {
    return this._mass;
  }

  get side () {
    return this._vSide;
  }

  get maxSpeed () {
    return this._maxSpeed;
  }

  set maxSpeed (newSpeed) {
    this._maxSpeed = newSpeed;
  }

  get maxForce () {
    return this._maxForce;
  }

  set maxForce (newForce) {
    this._maxForce = newForce;
  }

  isSpeedMaxedOut () {
    return this._maxSpeed * this._maxSpeed >= this._vVelocity.lengthSq;
  }

  get speed () {
    return this._vVelocity.length;
  }

  get speedSq () {
    return this._vVelocity.lengthSq;
  }

  get heading () {
    return this._vHeading;
  }

  set heading (vNewHeading) {
    assert((vNewHeading.lengthSq - 1) < 0.00001);

    this._vHeading = vNewHeading;

    //the side vector must always be perpendicular to the heading
    this._vSide = this._vHeading.perp;
  }

  get maxTurnRate () {
    return this._maxTurnRate;
  }

  set maxTurnRate (newTurnRate) {
    this._maxTurnRate = newTurnRate;
  }

  rotateHeadingToFacePosition (vTarget) {
    var toTarget = Vector2D.vec2DNormalize(Vector2D.sub(vTarget, this._vPosition));

    // first determine the angle between the heading vector and the target
    var angle = Math.acos(this._vHeading.dot(toTarget));

    if (isNaN(angle))  {
      angle = 0;
    }

    // return true if the player is facing the target
    if (angle < 0.00001) {
      return true;
    }

    // clamp the amount to turn to the max turn rate
    if (angle > this._maxTurnRate) {
      angle = this._maxTurnRate;
    }

    // The next few lines use a rotation matrix to rotate the player's heading vector accordingly
    var rotationMatrix = new C2DMatrix();

    // notice how the direction of rotation has to be determined when creating the rotation matrix
    rotationMatrix.rotate(angle * this._vHeading.sign(toTarget));
    rotationMatrix.transformVector2D(this._vHeading);
    rotationMatrix.transformVector2D(this._vVelocity);

    // finally recreate _vSide
    this._vSide = this._vHeading.perp;

    return false;
  }
}

export default MovingEntity;
