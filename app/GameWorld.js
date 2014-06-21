import { MouseButtons, Keys } from './common/constants';
import Vector2D from './common/Vector2D';
import InvertedAABBox2D from './common/InvertedAABBox2D';
import Vehicle from './Vehicle';

class GameWorld {
  /**
   * .ctor
   */
  constructor (game) {
    // reference to Game app
    this._owner = game;

    this._vehicle = new Vehicle({
      vPosition: new Vector2D(this.cxClient / 2, this.cyClient / 2),
      vVelocity: new Vector2D(0, 0),
      world: this,
      rotation: 2 * Math.PI / 3,
      mass: 1,
      maxForce: 700,
      maxSpeed: 150,
      maxTurnRate: Math.PI / 6,
      scale: 20
    });
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
    var newHeading = Vector2D.sub(new Vector2D(x, y), this._vehicle.pos);
    newHeading.normalize();

    this._vehicle.heading = newHeading;
  }

  render (ctx) {
    this._vehicle.render(ctx);
  }

  update (dt) {
    this._vehicle.update(dt);
  }

  get cxClient () {
    return this._owner.width;
  }

  get cyClient () {
    return this._owner.height;
  }
}

export default GameWorld;
