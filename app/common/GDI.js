class GDI {
  constructor (ctx) {
    this._ctx = ctx;
  }

  line (x1, y1, x2, y2) {
    GDI.line(this._ctx, x1, y1, x2, y2);
  }

  circle (x, y, radius) {
    GDI.circle(this._ctx, x, y, radius);
  }

  static line (ctx, x1, y1, x2, y2) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  static circle (ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
  }
}

export default GDI;
