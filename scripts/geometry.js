define(function() {
  function between(x, a, b) {
    return x >= a && x <= b;
  }

  function AABB(l, t, r, b) {
    this.l = Math.min(l, r);
    this.t = Math.min(t, b);
    this.r = Math.max(l, r);
    this.b = Math.max(t, b);
  }

  AABB.prototype.intersects = function(aabb) {
    return (between(aabb.l, this.l, this.r) || between(aabb.r, this.l, this.r))
        && (between(aabb.t, this.t, this.b) || between(aabb.b, this.t, this.b));
  };

  AABB.prototype.intersectsCircle = function(cx, cy, cr) {
    // Make a new aabb that is the original extended by the radius on all sides
    var l = this.l - cr;
    var t = this.t + cr;
    var r = this.r + cr;
    var b = this.b - cr;

    // Check whether the center of the circle is in the enlarged box.
    if (!between(cx, l, r) || !between(cy, b, t)) {
      return false;
    }
  
    // Check the four corner cases.
    return (cx < l && cy > t && Circle.containsPoint(cx, cy, cr, l, t))
        || (cx > r && cy > t && Circle.containsPoint(cx, cy, cr, r, t))
        || (cx < l && cy < b && Circle.contiansPoint(cx, cy, cr, l, b))
        || (cx > r && cy < b && Circle.containsPoint(cx, cy, cr, r, b));
  };

  AABB.prototype.draw = function(graphics, style, offset) {
    offset = offset || 0;
    graphics.drawBox(this.l + offset, 
                     this.t + offset, 
                     this.r - 2*offset, 
                     this.b - 2*offset, style);
  };

  function Circle(x, c, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  Circle.prototype.intersects = function(circle) {
    var dx = circle.x - this.x;
    var dy = circle.y - this.y;
    var d2 = dx*dx + dy*dy;
    var rsum = circle.r + this.r;
    return d2 < (rsum * rsum);
  };

  Circle.containsPoint = function(cx, cy, cr, px, py) {
    var dx = px - cx;
    var dy = py - cy;
    var d2 = dx*dx + dy*dy;
    return d2 < (cr * cr);
  };

  return {
    AABB: AABB,
    Circle: Circle
  };
});
