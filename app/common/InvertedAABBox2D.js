import Vector2D from './Vector2D';
import GDI from './GDI';

class InvertedAABBox2D {
  constructor (topLeft, bottomRight) {
    this._vTopLeft = topLeft;
    this._vBottomRight = bottomRight;
    this._vCenter = Vector2D.add(topLeft, bottomRight).div(2);
  }

  isOverlappedWith (otherBox) {
    return !((otherBox.top > this.bottom || (otherBox.bottom < this.top) || (otherBox.left > this.right) || (otherBox.right < this.left)));
  }

  get topLeft () {
    return this._vTopLeft;
  }

  get bottomRight () {
    return this._vBottomRight;
  }

  get top () {
    return this._vTopLeft.y;
  }

  get left () {
    return this._vTopLeft.x;
  }

  get bottom() {
    return this._vBottomRight.y;
  }

  get right () {
    return this._vBottomRight.x;
  }

  get center () {
    return this._vCenter;
  }

  render (ctx, renderCenter) {
    GDI.line(ctx, this.left, this.top, this.right, this.top);
    GDI.line(ctx, this.left, this.bottom, this.right, this.bottom);
    GDI.line(ctx, this.left, this.top, this.left, this.bottom);
    GDI.line(ctx, this.right, this.top, this.right, this.bottom);

    if (renderCenter) {
      GDI.circle(ctx, this._vCenter.x, this._vCenter.y, 5);
    }
  }
}

export default InvertedAABBox2D;
