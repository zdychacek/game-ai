class Matrix {
  constructor () {
    this._11 = 0;
    this._12 = 0;
    this._13 = 0;
    this._21 = 0;
    this._22 = 0;
    this._23 = 0;
    this._31 = 0;
    this._32 = 0;
    this._33 = 0;
  }
}

class C2DMatrix {
  constructor () {
    this._matrix = new Matrix();

    this.identity();
  }

  // create an identity matrix
  identity () {
    this._matrix._11 = 1;
    this._matrix._12 = 0;
    this._matrix._13 = 0;
    this._matrix._21 = 0;
    this._matrix._22 = 1;
    this._matrix._23 = 0;
    this._matrix._31 = 0;
    this._matrix._32 = 0;
    this._matrix._33 = 1;
  }

  set _11 (val) {
    this._matrix._11 = val;
  }

  set _12 (val) {
    this._matrix._12 = val;
  }

  set _13 (val) {
    this._matrix._13 = val;
  }

  set _21 (val) {
    this._matrix._21 = val;
  }

  set _22 (val) {
    this._matrix._22 = val;
  }

  set _23 (val) {
    this._matrix._23 = val;
  }

  set _31 (val) {
    this._matrix._31 = val;
  }

  set _32 (val) {
    this._matrix._32 = val;
  }

  set _33 (val) {
    this._matrix._33 = val;
  }

  // multiply two matrices together
  matrixMultiply (mIn) {
    var matTemp = new Matrix();
    var matThis = this._matrix;

    //first row
    matTemp._11 = (matThis._11 * mIn._11) + (matThis._12 * mIn._21) + (matThis._13 * mIn._31);
    matTemp._12 = (matThis._11 * mIn._12) + (matThis._12 * mIn._22) + (matThis._13 * mIn._32);
    matTemp._13 = (matThis._11 * mIn._13) + (matThis._12 * mIn._23) + (matThis._13 * mIn._33);

    //second
    matTemp._21 = (matThis._21 * mIn._11) + (matThis._22 * mIn._21) + (matThis._23 * mIn._31);
    matTemp._22 = (matThis._21 * mIn._12) + (matThis._22 * mIn._22) + (matThis._23 * mIn._32);
    matTemp._23 = (matThis._21 * mIn._13) + (matThis._22 * mIn._23) + (matThis._23 * mIn._33);

    //third
    matTemp._31 = (matThis._31 * mIn._11) + (matThis._32 * mIn._21) + (matThis._33 * mIn._31);
    matTemp._32 = (matThis._31 * mIn._12) + (matThis._32 * mIn._22) + (matThis._33 * mIn._32);
    matTemp._33 = (matThis._31 * mIn._13) + (matThis._32 * mIn._23) + (matThis._33 * mIn._33);

    this._matrix = matTemp;
  }

  transformVector2Ds (vPoints) {
    for (var point of vPoints) {
      this.transformVector2D(point);
    }
  }

  transformVector2D (vPoint) {
    var tempX = (this._matrix._11 * vPoint.x) + (this._matrix._21 * vPoint.y) + (this._matrix._31);
    var tempY = (this._matrix._12 * vPoint.x) + (this._matrix._22 * vPoint.y) + (this._matrix._32);

    vPoint.x = tempX;
    vPoint.y = tempY;
  }

  // create a transformation matrix
  translate (x, y) {
    var mat = new Matrix();

    mat._11 = 1; mat._12 = 0; mat._13 = 0;
    mat._21 = 0; mat._22 = 1; mat._23 = 0;
    mat._31 = x; mat._32 = y; mat._33 = 1;

    this.matrixMultiply(mat);
  }

  // create a scale matrix
  scale (xScale, yScale) {
    var mat = new Matrix();

    mat._11 = xScale; mat._12 = 0;      mat._13 = 0;
    mat._21 = 0;      mat._22 = yScale; mat._23 = 0;
    mat._31 = 0;      mat._32 = 0;      mat._33 = 1;

    this.matrixMultiply(mat);
  }

  rotate (rot) {
    var mat = new Matrix();

    if (arguments.length == 2) {
      var vFwd = arguments[0];
      var vSide = arguments[1];

      mat._11 = vFwd.x;  mat._12 = vFwd.y;  mat._13 = 0;
      mat._21 = vSide.x; mat._22 = vSide.y; mat._23 = 0;
      mat._31 = 0;       mat._32 = 0;       mat._33 = 1;
    }
    else {
      var sin = Math.sin(rot);
      var cos = Math.cos(rot);

      mat._11 = cos;  mat._12 = sin; mat._13 = 0;
      mat._21 = -sin; mat._22 = cos; mat._23 = 0;
      mat._31 = 0;    mat._32 = 0;   mat._33 = 1;
    }

    this.matrixMultiply(mat);
  }
}

export default C2DMatrix;
