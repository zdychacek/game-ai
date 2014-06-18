import Vector2D from './common/Vector2D';

class Game {
  constructor (width, height) {
    // create canvas
    var canvas = this._canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;
    canvas.style.border = '1px solid #000';
    document.body.appendChild(canvas);

    this._ctx = canvas.getContext('2d');
    this._last = +new Date();

    this._x = 0;
    this._y = 0;
  }

  _resetContext (ctx) {
    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // Restore the transform
    ctx.restore();
  }

  render (ctx) {
    this._resetContext(ctx, this._canvas);

    ctx.fillRect(this._x, this._y, 150, 100);
  }

  update (dt) {
    this._x += 10 * dt;
    this._y += 10 * dt;
  }

  run () {
    var now  = +new Date();
    var dt = Math.min(1, (now - this._last) / 1000);    // duration in seconds

    this.update(dt);
    this.render(this._ctx);

    this._last = now;
    requestAnimationFrame(this.run.bind(this));
  }
}

export default Game;
