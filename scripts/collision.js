define(function() {
  function AABB(l, t, r, b) {
    this.l = l;
    this.t = t;
    this.r = r;
    this.b = b;
  }

  AABB.prototype.intersects = function(aabb) {
    var overlapsHorizontally = aabb.l >= this.l && aabb.l <= this.r
                            || aabb.r >= this.l && aabb.r <= this.r;

    var overlapsVertically = aabb.t >= this.b && aabb.t <= this.t
                          || aabb.b >= this.b && aabb.b <= this.t;

    return overlapsHorizaontally && overlapsVeritcally;
  };

  function Circle(cx, cy, r) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
  }

  Circle.prototype.intersects = function(circle) {
    var squaredDistance = (this.cx - circle.cx) * (this.cx - circle.cx)
        + (this.cy - circle.cy) * (this.cy - circle.cy);

    return squaredDistance < ((this.r + circle.r) * (this.r + circle.r));
  };

  function Quadtree(left, top, w, h, depth) {
    this.aabb = new AABB(left, top, left + w, top + h);

    if (depth == 0) {
      this.objects = [];
    }
    else { 
      var childw = w/2;
      var childh = h/2;
      this.children = [
        new Quadtree(left, top, childw, childh, depth-1),
        new Quadtree(left+childw, top, childw, childh, depth-1),
        new Quadtree(left, top+childh, childw, childh, depth-1),
        new Quadtree(left+childw, top+childh, childw, childh, depth-1)
      ];
    }
  }

  Quadtree.prototype.clear = function() {
    if (this.objects) {
      this.objects = [];
    }

    this.eachChild(Quadtree.prototype.clear);
  };

  Quadtree.prototype.eachChild = function(func) {
    if (this.children) {
      for (var i = 0; i < this.children.length; i++) {
        func.apply(this.children[i], Array.prototype.slice.call(arguments, 1));
      }
    }
  };

  Quadtree.DEBUG_COLORS = ['red', 'green', 'blue', 'purple', 'orange'];

  Quadtree.prototype.draw = function(graphics, depth) {
    var depth = depth || 0;
    var aabb = this.aabb;
    graphics.withContext(function(ctx) {
      ctx.beginPath();
      ctx.rect(aabb.l, aabb.t, aabb.r - aabb.l, aabb.b - aabb.t);
      ctx.lineWidth = 2;
      ctx.strokeStyle = Quadtree.DEBUG_COLORS[depth];
      ctx.stroke();
      ctx.closePath();
    });

   this.eachChild(Quadtree.prototype.draw, graphics, depth+1);
  };

  return {
    AABB: AABB,
    Circle: Circle,
    Quadtree: Quadtree
  };
});
