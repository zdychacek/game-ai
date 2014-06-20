import Utils from './common/Utils';

class GameInput {
  constructor (global) {
    this._pressedKeys = Object.create(null);

    global.addEventListener('keyup', this.onKeyUp.bind(this), false);
    global.addEventListener('keydown', this.onKeyDown.bind(this), false);
  }

  isPressed (keyCode) {
    return this._pressedKeys[keyCode];
  }

  onKeyDown (event) {
    this._pressedKeys[event.keyCode] = Utils.getTime();
  }

  onKeyUp (event) {
    delete this._pressedKeys[event.keyCode];
  }
}

// key codes
var Keys = {
  Left: 37,
  Up: 38,
  Right: 39,
  Down: 40
};

export { GameInput, Keys };
