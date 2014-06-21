import Vector2D from './common/Vector2D';

class SteeringBehavior {
  /**
   * .ctor
   */
  constructor (agent) {
    this._vehicle = agent;
  }

  calculate () {
    return new Vector2D(0, 0);
  }
}

export default SteeringBehavior;
