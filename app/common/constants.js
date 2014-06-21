const EPSILON = 0.000000000001;

// key codes
var Keys = {
  Backspace: 8,
  Tab:       9,
  Return:   13,
  Esc:      27,
  Space:    32,
  PageUp:   33,
  PageDown: 34,
  End:      35,
  Home:     36,
  Left:     37,
  Up:       38,
  Right:    39,
  Down:     40,
  Insert:   45,
  Delete:   46,
  // numbers
  Zero:     48, One: 49, Two: 50, Three: 51, Four: 52, Five: 53, Six: 54, Seven: 55, Eight: 56, Nine: 57,
  // lettres
  A:        65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
  Tilda:    192
};

// mouse buttons
var MouseButtons = {
  Left: 1,
  Middle: 2,
  Right: 3
}

export { EPSILON, Keys, MouseButtons };
