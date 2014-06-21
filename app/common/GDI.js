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
    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.closePath();
    ctx.stroke();
  }

  static circle (ctx, x, y, radius) {
    ctx.beginPath();

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.closePath();
    ctx.stroke();
  }

  static closedShape (ctx, points) {
    for (var i = 0, l = points.length; i < l; i++) {
      var from = points[i];
      var to = points[(i + 1) % l];

      GDI.line(ctx, from.x, from.y, to.x, to.y);
    }
  }
}

export default GDI;
