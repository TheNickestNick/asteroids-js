define(function() {
  function AABB(t, l, b, r) {
    this.t = t;
    this.l = l;
    this.b = b;
    this.r = r;
  }

  AABB.prototype.intersects = function(aabb) {
    var overlapsHorizontally = aabb.left >= this.left && aabb.left <= this.right
                            || aabb.right >= this.left && aabb.right <= this.right;

    var overlapsVertically = aabb.top >= this.bottom && aabb.top <= this.top
                          || aabb.bottom >= this.bottom && aabb.bottom <= this.top;

    return overlapsHorizaontally && overlapsVeritcally;
  };

  function Quadtree() {
  }

  Quadtree.prototype.add = function() {
  };

  Quadtree.prototype.remove = function() {
  }

  Quadtree.prototype.findIntersections = function() {
  }
});
