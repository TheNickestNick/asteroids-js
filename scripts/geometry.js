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

  AABB.prototype.containsPoint = function(x, y) {
    return between(x, this.l, this.r) && between(y, this.t, this.b);
  };

  AABB.prototype.intersects = function(aabb) {
    return (between(aabb.l, this.l, this.r) || between(aabb.r, this.l, this.r))
        && (between(aabb.t, this.t, this.b) || between(aabb.b, this.t, this.b));
  };

  AABB.prototype.intersectsCircle = function(cx, cy, cr) {
    // Make a new aabb that is the original extended by the radius on all sides
    var l = this.l - cr;
    var t = this.t - cr;
    var r = this.r + cr;
    var b = this.b + cr;

    // Check whether the center of the circle is in the enlarged box.
    if (!between(cx, l, r) || !between(cy, t, b)) {
      return false;
    }

    // Check the four corner cases.
    if (cx < l && cy > t) return cirlceContainsPoint(cx, cy, cr, l, t);
    if (cx > r && cy > t) return circleContainsPoint(cx, cy, cr, r, t);
    if (cx < l && cy < b) return circleContiansPoint(cx, cy, cr, l, b);
    if (cx > r && cy < b) return circleContainsPoint(cx, cy, cr, r, b);

    return true;
  };

  function circlesIntersect(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var d2 = dx*dx + dy*dy;
    var rsum = r1 + r2;
    return d2 < (rsum * rsum);
  };

  function circleContainsPoint(cx, cy, cr, px, py) {
    var dx = px - cx;
    var dy = py - cy;
    var d2 = dx*dx + dy*dy;
    return d2 < (cr * cr);
  };

  return {
    AABB: AABB,
    circleContainsPoint: circleContainsPoint,
    circlesIntersect: circlesIntersect
  };
});
