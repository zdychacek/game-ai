import Vector2D from './common/Vector2D';
import InvertedAABBox2D from './common/InvertedAABBox2D';
import { Keys } from './GameInput';
import MovingEntity from './MovingEntity';

class GameWorld {
  constructor (game, input) {
    // reference to Game app
    this._owner = game;

    // input module
    this._input = input;

    this._box1 = new InvertedAABBox2D(new Vector2D(50, 50), new Vector2D(150, 150));
    this._box2 = new InvertedAABBox2D(new Vector2D(85, 85), new Vector2D(300, 350));

    this._vehicle = new MovingEntity({
      vPosition: new Vector2D(100, 100),
      radius: 15,
      vVelocity: new Vector2D(0, 0),
      maxSpeed: 10,
      vHeading: new Vector2D(1, 1),
      mass: 70,
      turnRate: Math.PI / 6,
      maxForce: 700
    });

    console.log(this._vehicle);
  }

  render (ctx) {
    this._box1.render(ctx, true);
    this._box2.render(ctx, true);
  }

  update (dt) {
    if (this._input.isPressed(Keys.Left)) {
      console.log('Pressed...');
    }
  }
}

export default GameWorld;
