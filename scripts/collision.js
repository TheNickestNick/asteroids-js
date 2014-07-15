define(function() {
  function between(x, a, b) {
    return (x >= a && x <= b) || (x >= b && x <= a);
  }


  function AABB(l, t, r, b) {
    this.l = l;
    this.t = t;
    this.r = r;
    this.b = b;
  }

  AABB.prototype.intersects = function(aabb) {
    return (between(aabb.l, this.l, this.r) || between(aabb.r, this.l, this.r))
        && (between(aabb.t, this.t, this.b) || between(aabb.b, this.t, this.b));
  };

  AABB.prototype.draw = function(graphics, style) {
    var aabb = this;
    graphics.withContext(function(ctx) {
      ctx.beginPath();
      ctx.rect(aabb.l, aabb.t, aabb.r - aabb.l, aabb.b - aabb.t);
      ctx.lineWidth = 2;
      ctx.strokeStyle = style || 'white';
      ctx.stroke();
      ctx.closePath();
    });
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

  Quadtree.prototype.add = function(object) {
    if (!this.aabb.intersects(object.aabb)) {
      return;
    };

    if (this.objects) {
      this.objects.push(object);
    }
    
    this.eachChild(Quadtree.prototype.add, object);
  };

  // TODO: clean this up by making a debug package
  Quadtree.DEBUG_COLORS = ['red', 'green', 'blue', 'purple', 'orange', 'brown'];
  Quadtree.debugColor = function(i) {
    return Quadtree.DEBUG_COLORS[i % 6];
  };

  Quadtree.prototype.draw = function(graphics, counter) {
    counter = counter || { num: 0 };
    var color = Quadtree.debugColor(counter.num);
    this.aabb.draw(graphics, color); 

    if (this.objects) {
      for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].aabb.draw(graphics, color);
      }
    }

    counter.num++;
    this.eachChild(Quadtree.prototype.draw, graphics, counter);
  };

  return {
    AABB: AABB,
    Circle: Circle,
    Quadtree: Quadtree
  };
});
