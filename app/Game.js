import Utils from './common/Utils';
import GameWorld from './GameWorld';

/**
 * Game object.
 */
class Game {
  /**
   * .ctor
   */
  constructor (w, h) {
    // dimensions of canvases
    this._width = w;
    this._height = h;

    this.initBuffers(w, h);
    this.initInput(document, this._frontBuffer);

    // time of last update
    this._lastUpdate = Utils.getTime()

    // FPS counter
    this._fps = 0;

    // game world
    this._gameWorld = new GameWorld(this, this._input);
  }

  initBuffers (w, h) {
    // create front buffer
    this._frontBuffer = this.createCanvas(w, h);
    this._frontCtx = this._frontBuffer.getContext('2d');
    document.body.appendChild(this._frontBuffer);

    // create back buffer
    this._backBuffer = this.createCanvas(w, h);
    this._backCtx = this._backBuffer.getContext('2d');
  }

  initInput (document, canvas) {
    // keyboard handling
    document.addEventListener('keydown', (event) => {
      this.handleKeyPresses(event.keyCode, true, event);
    }, false);

    document.addEventListener('keyup', (event) => {
      this.handleKeyPresses(event.keyCode, false, event);
    }, false);

    // mouse handling
    var _handleClick = (event) => {
      var x = event.layerX - canvas.offsetLeft;
      var y = event.layerY - canvas.offsetTop;

      this.handleMouseClick(x, y, event.which, event);
    };

    canvas.addEventListener('click', _handleClick, false);

    canvas.addEventListener('contextmenu', (event) => {
      _handleClick(event);

      // must prevent context menu show
      event.preventDefault();
    });

    canvas.addEventListener('mousemove', (event) => {
      var x = event.layerX - canvas.offsetLeft;
      var y = event.layerY - canvas.offsetTop;

      this.handleMouseMove(x, y, event);
    });
  }

  /**
   * Helper method for creating canvas.
   */
  createCanvas (width, height) {
    var canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    return canvas;
  }

  /**
   * Internal render method.
   */
  renderInternal (backCtx, frontCtx) {
    var w = this._width;
    var h = this._height;

    // invalidate back buffer
    backCtx.clearRect (0, 0, w, h);
    // invalidate front buffer
    frontCtx.clearRect (0, 0, w, h);

    // render game to back buffer
    this.render(backCtx)

    // render, flip back buffer to front buffer
    frontCtx.drawImage(this._backBuffer, 0, 0, w, h);
  }

  /**
   * Game render logic.
   */
  render (ctx) {
    // render game world
    this._gameWorld.render(ctx);

    // render FPC
    this.renderFPS(ctx);
  }

  renderFPS (ctx) {
    var fps = this.fps.toFixed(2);

    // render FPS
    ctx.font = '20px Georgia';
    ctx.fillText(`FPS: ${fps}`, 5, this._height - 10);
  }

  /**
   * Game update logic.
   */
  update (dt) {
    // update game world
    this._gameWorld.update(dt);
  }

  /**
   * Game main loop
   */
  run () {
    var now = Utils.getTime();
    // calculate delta time in seconds
    var dt = Math.min(1, (now - this._lastUpdate) / 1000);

    // calculate FPS
    this._fps = 1000 / (now - this._lastUpdate);

    // update game
    this.update(dt);
    // render current frame
    this.renderInternal(this._backCtx, this._frontCtx);

    this._lastUpdate = now;

    // register for next update step
    window.requestAnimationFrame(this.run.bind(this));
  }

  handleKeyPresses (key, pressed, event) {
    this._gameWorld.handleKeyPresses(...arguments);
  }

  handleMouseClick (x, y, button, event) {
    this._gameWorld.handleMouseClick(...arguments);
  }

  handleMouseMove (x, y, event) {
    this._gameWorld.handleMouseMove(...arguments);
  }

  /**
   * Returns current frames per second
   */
  get fps () {
    return this._fps;
  }

  get width () {
    return this._width;
  }

  get height () {
    return this._height;
  }
}

export default Game;
