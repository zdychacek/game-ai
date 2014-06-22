import { MouseButtons, Keys } from './common/constants';
import Vector2D from './common/Vector2D';
import InvertedAABBox2D from './common/InvertedAABBox2D';
import Utils from './common/Utils';
import Vehicle from './Vehicle';
import Params from './Params';

class GameWorld {
  /**
   * .ctor
   */
  constructor (game) {
    // reference to Game app
    this._game = game;

    this._walls = [];

    this._obstacles = [];

    this._agents = [];

    this._vehicle = new Vehicle({
      vPosition: new Vector2D(this.winWidth / 2, this.winHeight / 2),
      vVelocity: new Vector2D(0, 0),
      world: this,
      rotation: Utils.randFloat() * Math.PI * 2,
      mass: Params.vehicleMass,
      maxForce: 400,
      maxSpeed: Params.maxSpeed,
      maxTurnRate: Params.maxTurnRatePerSecond,
      scale: Params.vehicleScale
    });

    this._vehicle.steering.wanderOn();
  }

  handleKeyPresses (key, pressed, event) {
    if (key == Keys.Left && pressed) {
      console.log('Left key was pressed.');
    }
  }

  handleMouseClick (x, y, button, event) {
    if (button == MouseButtons.Left) {
      console.log(`Left click at ${x}, ${y}.`);
    }
    else if (button == MouseButtons.Right) {
      console.log(`Right click at ${x}, ${y}.`);
    }
  }

  handleMouseMove (x, y, event) {
    /*var newHeading = Vector2D.sub(new Vector2D(x, y), this._vehicle.pos);
    newHeading.normalize();

    this._vehicle.heading = newHeading;*/
  }

  tagVehiclesWithinViewRange (vehicle, distance) {
    // TODO:
  }

  render (ctx) {
    this._vehicle.render(ctx);
  }

  update (dt) {
    this._vehicle.update(dt);
  }

  get winWidth () {
    return this._game.width;
  }

  get winHeight () {
    return this._game.height;
  }

  get walls () {
    return this._walls;
  }

  get obstacles () {
    return this._obstacles;
  }

  get agents () {
    return this._agents;
  }
}

export default GameWorld;
