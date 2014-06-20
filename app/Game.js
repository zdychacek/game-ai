import Utils from './common/Utils';
import Vector2D from './common/Vector2D';
import Transformation from './common/Transformation';

class Game {
  constructor (width, height) {
    // dimensions of canvases
    this._width = width;
    this._height = height;

    // create front buffer
    this._frontBuffer = this._createCanvas(width, height);
    this._frontCtx = this._frontBuffer.getContext('2d');
    document.body.appendChild(this._frontBuffer);

    // create back buffer
    this._backBuffer = this._createCanvas(width, height);
    this._backCtx = this._backBuffer.getContext('2d');

    // time of last update
    this._lastUpdate = Utils.getTime()

    // FPS counter
    this._fps = 0;
  }

  _createCanvas (width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  _renderInternal (backCtx, frontCtx) {
    var w = this._width;
    var h = this._height;

    // invalidate back buffer
    backCtx.clearRect (0, 0, w, h);
    // invalidate front buffer
    frontCtx.clearRect (0, 0, w, h);

    // game render logic
    this._render(backCtx)

    // double flipping
    frontCtx.drawImage(this._backBuffer, 0, 0, w, h);
  }

  _render (ctx) {
    var fps = this.fps.toFixed(2);

    // render FPS
    ctx.font = '20px Georgia';
    ctx.fillText(`FPS: ${fps}`, 5, this._height - 10);
  }

  _update (dt) {
    // game logic here
  }

  run () {
    var now = Utils.getTime();
    // duration in seconds
    var dt = Math.min(1, (now - this._lastUpdate) / 1000);

    // calculate FPS
    this._fps = 1000 / (now - this._lastUpdate);

    // update game
    this._update(dt);
    // render current frame
    this._renderInternal(this._backCtx, this._frontCtx);

    this._lastUpdate = now;

    // register for next update step
    window.requestAnimationFrame(this.run.bind(this));
  }

  get fps () {
    return this._fps;
  }
}

export default Game;
